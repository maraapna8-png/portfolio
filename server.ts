import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPort = Number(process.env.PORT);
const nginxPort = Number(process.env.NGINX_PORT);
const PORT =
  envPort && envPort !== nginxPort
    ? envPort
    : Number(process.env.DEFAULT_APP_PORT) || 3000;
const PRIMARY_AUTH_STORE_PATH = path.resolve(__dirname, '.admin-auth.json');
const FALLBACK_AUTH_STORE_PATH = path.join(os.tmpdir(), 'portfolio-admin-auth.json');

// Ephemeral in-memory signing secret if SESSION_SECRET env var is not configured
const SESSION_SECRET = process.env.SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

interface StoredCredential {
  salt: string;
  hash: string;
  claimedAt: string;
}

const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    return true;
  }
  return entry.count < 10;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

function getEnvPasscode(): string | null {
  const raw = process.env.ADMIN_PASSCODE?.trim();
  return raw && raw.length > 0 ? raw : null;
}

function readClaimedCredential(): StoredCredential | null {
  for (const storePath of [PRIMARY_AUTH_STORE_PATH, FALLBACK_AUTH_STORE_PATH]) {
    try {
      if (!fs.existsSync(storePath)) continue;
      const raw = fs.readFileSync(storePath, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoredCredential>;
      if (typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
        return {
          salt: parsed.salt,
          hash: parsed.hash,
          claimedAt: typeof parsed.claimedAt === 'string' ? parsed.claimedAt : new Date().toISOString(),
        };
      }
    } catch {
      // Try next path
    }
  }
  return null;
}

function signAdminToken(): string {
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${sig}`;
}

function verifyAdminToken(authHeader: string | undefined): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return false;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  const sigBuf = Buffer.from(sigB64, 'utf-8');
  const expectedBuf = Buffer.from(expectedSig, 'utf-8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function timingSafeCompareStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a, 'utf-8').digest();
  const hashB = crypto.createHash('sha256').update(b, 'utf-8').digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '16kb' }));

  app.use('/api/admin', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    next();
  });

  // Check current admin auth mode & Bearer session validity
  app.get('/api/admin/status', (req, res) => {
    const envPasscode = getEnvPasscode();
    const claimed = readClaimedCredential();
    const isConfigured = Boolean(envPasscode || claimed);
    const authenticated = verifyAdminToken(req.headers.authorization);

    res.json({
      mode: isConfigured ? 'login' : 'claim',
      envConfigured: Boolean(envPasscode),
      authenticated,
    });
  });

  // First-run passcode bootstrap when ADMIN_PASSCODE env var is unset
  app.post('/api/admin/claim', (req, res) => {
    if (getEnvPasscode()) {
      res.status(403).json({ error: 'Admin passcode is already configured in environment.' });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (passcode.length < 4 || passcode.length > 128) {
      res.status(400).json({ error: 'Passcode must be between 4 and 128 characters.' });
      return;
    }

    if (readClaimedCredential()) {
      res.status(403).json({ error: 'Admin passcode has already been initialized.' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(passcode, salt, 64).toString('hex');
    const record: StoredCredential = {
      salt,
      hash,
      claimedAt: new Date().toISOString(),
    };

    let persisted = false;
    let alreadyExists = false;
    for (const storePath of [PRIMARY_AUTH_STORE_PATH, FALLBACK_AUTH_STORE_PATH]) {
      try {
        // Atomic exclusive write prevents race condition on first claim
        fs.writeFileSync(storePath, JSON.stringify(record, null, 2), {
          encoding: 'utf-8',
          flag: 'wx',
          mode: 0o600,
        });
        persisted = true;
        break;
      } catch (err: unknown) {
        const code = (err as NodeJS.ErrnoException)?.code;
        if (code === 'EEXIST') {
          alreadyExists = true;
          break;
        }
        if (code !== 'EROFS' && code !== 'EACCES') {
          console.error('Failed to persist admin passcode hash:', err);
        }
      }
    }

    if (alreadyExists) {
      res.status(403).json({ error: 'Admin passcode has already been initialized.' });
      return;
    }
    if (!persisted) {
      res.status(500).json({ error: 'Failed to initialize admin passcode.' });
      return;
    }

    const token = signAdminToken();
    res.json({ ok: true, token });
  });

  // Verify admin passcode and issue in-memory Bearer token
  app.post('/api/admin/login', (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({ error: 'Too many failed attempts. Please wait a few minutes.' });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (!passcode || passcode.length > 128) {
      res.status(400).json({ error: 'Please enter a valid passcode.' });
      return;
    }

    const envPasscode = getEnvPasscode();
    let valid = false;

    if (envPasscode) {
      valid = timingSafeCompareStrings(passcode, envPasscode);
    } else {
      const stored = readClaimedCredential();
      if (!stored) {
        res.status(409).json({ error: 'Admin passcode has not been set up yet.' });
        return;
      }
      const computed = crypto.scryptSync(passcode, stored.salt, 64);
      const expected = Buffer.from(stored.hash, 'hex');
      valid = computed.length === expected.length && crypto.timingSafeEqual(computed, expected);
    }

    if (!valid) {
      recordFailedAttempt(clientIp);
      res.status(401).json({ error: 'Invalid administrator passcode. Please try again.' });
      return;
    }

    clearFailedAttempts(clientIp);
    const token = signAdminToken();
    res.json({ ok: true, token });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
