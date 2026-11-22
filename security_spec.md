# Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Default Deny**: No path outside explicitly matched collections is readable or writable.
2. **Admin Authorization**: Only the bootstrapped owner (`maraapna8@gmail.com` with `email_verified == true`) or a UID registered in `/admins/{uid}` may create, update, delete, or reorder portfolio content (`siteConfig`, `projects`, `services`, `skills`, `gallery`, `timeline`), or read/update/delete `contactSubmissions`.
3. **PII Isolation**: `contactSubmissions` contains client PII (`fullName`, `email`, `phone`, `message`). Public visitors can only `create` a valid inquiry (`read == false` forced on creation); `get`, `list`, `update`, and `delete` are strictly restricted to `isAdmin()`.
4. **Schema & Boundary Guards**: Every string field enforces `.size() <= MAX`, every array enforces `.size() <= 20`, every document ID enforces `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars), and `keys().hasAll(...)` + `keys().hasOnly(...)` prevent shadow/ghost fields.
5. **Action-Based Updates**: Every `allow update` begins with `isValid[Entity](incoming())` and checks `affectedKeys().hasOnly(...)` or `isAdmin()` with strict field allowlists.

## 2. Dirty Dozen Attack Payloads (All Must Return PERMISSION_DENIED)
1. **Shadow Field Injection on Project Create**: Admin or attacker sends `{ ..., isAdminOverride: true }`. Rejected by `keys().hasOnly(...)`.
2. **Unauthenticated Project Create**: Anonymous or unauthenticated client tries to create `/projects/proj-999`. Rejected by `isAdmin()`.
3. **Unverified Admin Email Spoof**: User with `email: 'maraapna8@gmail.com'` and `email_verified: false` attempts write. Rejected by `request.auth.token.email_verified == true`.
4. **Oversized Document ID Poisoning**: Client attempts `/projects/` + `'a'.repeat(500)`. Rejected by `isValidId()`.
5. **Oversized String Exhaustion (Denial of Wallet)**: Client submits `/contactSubmissions/sub-9` with `message` > 5000 chars. Rejected by `data.message.size() <= 5000`.
6. **Public Inquiry Pre-Marked Read**: Visitor creates `/contactSubmissions/sub-10` with `read: true`. Rejected by `data.read == false`.
7. **PII Scraping (List Inquiries as Non-Admin)**: Unauthenticated or non-admin user queries `/contactSubmissions`. Rejected by `isAdmin()`.
8. **PII Single Read as Non-Admin**: Non-admin user calls `getDoc('/contactSubmissions/sub-1')`. Rejected by `isAdmin()`.
9. **Invalid Project Category Enum**: Admin sends `category: 'HackedCategory'` on `/projects/proj-10`. Rejected by `data.category in ['Websites', 'Business', 'AI', 'Portfolio', 'Other']`.
10. **Unbounded Array Injection**: Admin sends `technologies` with 50 items (> 20 limit). Rejected by `data.technologies.size() <= 20`.
11. **Wildcard Collection Write**: Attacker writes to `/arbitraryCollection/doc1`. Rejected by default-deny `match /{document=**}`.
12. **Type Confusion on Inquiry Update**: Attacker sends `read: "yes"` instead of `bool`. Rejected by `isValidContactSubmission(incoming())`.
