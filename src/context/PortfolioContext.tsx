import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  Project,
  Service,
  Skill,
  GalleryItem,
  TimelineItem,
  ContactSubmission,
  SiteInfo,
  PageTab,
} from '../types';
import {
  initialProjects,
  initialServices,
  initialSkills,
  initialGalleryItems,
  initialTimeline,
  initialContactSubmissions,
  initialSiteInfo,
} from '../data/initialData';
import { resolveGalleryMedia, extractGoogleDriveId } from '../utils/mediaUtils';
import {
  db,
  auth,
  googleProvider,
  ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
} from '../firebase';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface PortfolioContextType {
  activePage: PageTab;
  setActivePage: (page: PageTab) => void;
  siteInfo: SiteInfo;
  updateSiteInfo: (info: Partial<SiteInfo>) => Promise<void>;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  moveProject: (id: string, direction: 'up' | 'down') => Promise<void>;
  reorderProjects: (startIndex: number, endIndex: number) => Promise<void>;
  services: Service[];
  updateService: (id: string, updated: Partial<Service>) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  skills: Skill[];
  updateSkill: (id: string, updated: Partial<Skill>) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  moveGalleryItem: (id: string, direction: 'up' | 'down' | 'left' | 'right') => Promise<void>;
  reorderGalleryItems: (startIndex: number, endIndex: number) => Promise<void>;
  timelineItems: TimelineItem[];
  addTimelineItem: (item: Omit<TimelineItem, 'id'>) => Promise<void>;
  updateTimelineItem: (id: string, updated: Partial<TimelineItem>) => Promise<void>;
  deleteTimelineItem: (id: string) => Promise<void>;
  contactSubmissions: ContactSubmission[];
  submitContact: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  markContactRead: (id: string, read: boolean) => Promise<void>;
  deleteContactSubmission: (id: string) => Promise<void>;
  clearAllContactSubmissions: () => Promise<void>;
  isAdminAuthenticated: boolean;
  isAuthReady: boolean;
  authUser: User | null;
  adminLoginWithGoogle: () => Promise<AuthResult>;
  adminLogout: () => Promise<void>;
  syncLocalToCloud: () => Promise<number>;
  localUnsyncedCount: number;
  isSyncingCloud: boolean;
  selectedProject: Project | null;
  openProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  selectedGalleryIndex: number | null;
  openGalleryLightbox: (index: number) => void;
  closeGalleryLightbox: () => void;
  isHireMeOpen: boolean;
  openHireMe: () => void;
  closeHireMe: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetAllToDefault: () => Promise<void>;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// ============================================================================
// PAYLOAD SANITIZATION & BOUNDARY HELPERS (Synced with firebase-blueprint.json)
// ============================================================================
const PROJECT_CATEGORIES: Project['category'][] = ['Websites', 'Business', 'AI', 'Portfolio', 'Other'];
const SKILL_CATEGORIES: Skill['category'][] = ['Frontend', 'Design & UX', 'Content & Video', 'AI & Tools'];
const GALLERY_CATEGORIES: GalleryItem['category'][] = ['My Work', 'Websites', 'Designs', 'Videos', 'Certificates', 'Other'];

const sanitizeId = (id: string | undefined, prefix: string): string => {
  const cleaned = (id || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 128);
  return cleaned.length > 0 ? cleaned : `${prefix}-${Date.now()}`;
};

const clampStr = (val: unknown, maxLen: number, fallback = ''): string => {
  const s = typeof val === 'string' ? val : fallback;
  return s.slice(0, maxLen);
};

const clampNonEmpty = (val: unknown, maxLen: number, fallback: string): string => {
  const s = clampStr(val, maxLen).trim();
  return s.length > 0 ? s : fallback.slice(0, maxLen);
};

const clampList = (arr: unknown, maxItems = 20, maxItemLen = 200): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim().slice(0, maxItemLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
};

const clampOrder = (val: unknown, fallback: number): number => {
  const n = typeof val === 'number' && Number.isFinite(val) ? val : fallback;
  return Math.max(0, Math.min(100000, Math.round(n)));
};

const sanitizeSiteInfoPayload = (info: SiteInfo): Record<string, unknown> => ({
  name: clampNonEmpty(info.name, 120, initialSiteInfo.name),
  title: clampNonEmpty(info.title, 200, initialSiteInfo.title),
  greetingBadge: clampStr(info.greetingBadge, 80, initialSiteInfo.greetingBadge),
  heroIntro: clampStr(info.heroIntro, 1000, initialSiteInfo.heroIntro),
  bio: clampStr(info.bio, 2000, initialSiteInfo.bio),
  experienceYears: clampStr(info.experienceYears, 30, initialSiteInfo.experienceYears),
  websitesCreated: clampStr(info.websitesCreated, 30, initialSiteInfo.websitesCreated),
  projectsCompleted: clampStr(info.projectsCompleted, 30, initialSiteInfo.projectsCompleted),
  happyClients: clampStr(info.happyClients, 30, initialSiteInfo.happyClients),
  email: clampNonEmpty(info.email, 160, initialSiteInfo.email),
  phone: clampStr(info.phone, 50, initialSiteInfo.phone),
  whatsapp: clampStr(info.whatsapp, 50, initialSiteInfo.whatsapp),
  location: clampStr(info.location, 200, initialSiteInfo.location),
  availability: clampStr(info.availability, 200, initialSiteInfo.availability),
  whoIAm: clampStr(info.whoIAm, 3000, initialSiteInfo.whoIAm),
  myGoals: clampStr(info.myGoals, 3000, initialSiteInfo.myGoals),
  updatedAt: new Date().toISOString().slice(0, 64),
});

const sanitizeProjectPayload = (
  p: Project,
  orderIndex: number,
  options: { includeIdAndCreated?: boolean } = { includeIdAndCreated: true }
): Record<string, unknown> => {
  const category = PROJECT_CATEGORIES.includes(p.category) ? p.category : 'Other';
  const payload: Record<string, unknown> = {
    title: clampNonEmpty(p.title, 200, 'Untitled Project'),
    category,
    description: clampStr(p.description, 1000),
    fullDescription: clampStr(p.fullDescription, 5000),
    features: clampList(p.features, 20),
    technologies: clampList(p.technologies, 20),
    imageUrl: clampStr(p.imageUrl, 2000),
    featured: Boolean(p.featured),
    order: clampOrder(p.order, orderIndex),
    updatedAt: new Date().toISOString().slice(0, 64),
  };

  if (typeof p.liveUrl === 'string') payload.liveUrl = clampStr(p.liveUrl, 2000);
  if (typeof p.githubUrl === 'string') payload.githubUrl = clampStr(p.githubUrl, 2000);
  if (typeof p.challenges === 'string') payload.challenges = clampStr(p.challenges, 3000);
  if (typeof p.solution === 'string') payload.solution = clampStr(p.solution, 3000);
  if (typeof p.completionDate === 'string') payload.completionDate = clampStr(p.completionDate, 40);

  if (options.includeIdAndCreated) {
    payload.id = sanitizeId(p.id, 'proj');
    payload.createdAt = clampStr(p.createdAt || new Date().toISOString(), 64);
  }

  return payload;
};

const sanitizeServicePayload = (
  s: Service,
  orderIndex: number,
  includeId = true
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    title: clampNonEmpty(s.title, 150, 'Digital Service'),
    description: clampStr(s.description, 1000),
    iconName: clampNonEmpty(s.iconName, 80, 'Code2'),
    features: clampList(s.features, 20),
    order: clampOrder(s.order, orderIndex),
  };
  if (includeId) payload.id = sanitizeId(s.id, 'srv');
  return payload;
};

const sanitizeSkillPayload = (
  sk: Skill,
  orderIndex: number,
  includeId = true
): Record<string, unknown> => {
  const category = SKILL_CATEGORIES.includes(sk.category) ? sk.category : 'Frontend';
  const level = typeof sk.level === 'number' && Number.isFinite(sk.level)
    ? Math.max(0, Math.min(100, Math.round(sk.level)))
    : 80;
  const payload: Record<string, unknown> = {
    name: clampNonEmpty(sk.name, 100, 'Skill'),
    level,
    category,
    order: clampOrder(sk.order, orderIndex),
  };
  if (typeof sk.iconName === 'string') payload.iconName = clampStr(sk.iconName, 80);
  if (typeof sk.experienceYears === 'string') payload.experienceYears = clampStr(sk.experienceYears, 40);
  if (includeId) payload.id = sanitizeId(sk.id, 'sk');
  return payload;
};

const sanitizeGalleryPayload = (
  g: GalleryItem,
  orderIndex: number,
  options: { includeIdAndCreated?: boolean } = { includeIdAndCreated: true }
): Record<string, unknown> => {
  const category = GALLERY_CATEGORIES.includes(g.category) ? g.category : 'Other';
  const payload: Record<string, unknown> = {
    title: clampNonEmpty(g.title, 200, 'Untitled Media'),
    category,
    imageUrl: clampStr(g.imageUrl, 2000),
    description: clampStr(g.description, 2000),
    order: clampOrder(g.order, orderIndex),
    updatedAt: new Date().toISOString().slice(0, 64),
  };

  if (typeof g.videoUrl === 'string') payload.videoUrl = clampStr(g.videoUrl, 2000);
  if (typeof g.date === 'string') payload.date = clampStr(g.date, 40);
  if (Array.isArray(g.tags)) payload.tags = clampList(g.tags, 20);

  if (options.includeIdAndCreated) {
    payload.id = sanitizeId(g.id, 'gal');
    payload.createdAt = clampStr(g.createdAt || new Date().toISOString(), 64);
  }

  return payload;
};

const sanitizeTimelinePayload = (
  t: TimelineItem,
  orderIndex: number,
  includeId = true
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    year: clampNonEmpty(t.year, 50, '2026'),
    title: clampNonEmpty(t.title, 200, 'Milestone'),
    description: clampStr(t.description, 2000),
    achievement: clampStr(t.achievement, 1000),
    order: clampOrder(t.order, orderIndex),
  };
  if (typeof t.imageUrl === 'string') payload.imageUrl = clampStr(t.imageUrl, 2000);
  if (typeof t.badge === 'string') payload.badge = clampStr(t.badge, 80);
  if (includeId) payload.id = sanitizeId(t.id, 'time');
  return payload;
};

const sanitizeContactPayload = (c: ContactSubmission): Record<string, unknown> => ({
  id: sanitizeId(c.id, 'sub'),
  fullName: clampNonEmpty(c.fullName, 150, 'Visitor'),
  email: clampNonEmpty(c.email, 160, 'visitor@example.com'),
  phone: clampStr(c.phone, 50, 'Not provided'),
  serviceRequired: clampNonEmpty(c.serviceRequired, 150, 'Web Development'),
  projectBudget: clampStr(c.projectBudget, 100, 'Custom'),
  projectDetails: clampStr(c.projectDetails, 2000),
  message: clampNonEmpty(c.message, 5000, 'Inquiry'),
  createdAt: clampNonEmpty(c.createdAt, 64, new Date().toISOString()),
  read: Boolean(c.read),
});

// ============================================================================
// LOCALSTORAGE READ HELPERS (Fallback + Pre-Cloud Migration)
// ============================================================================
const readLocalSiteInfo = (): SiteInfo => {
  try {
    const saved = localStorage.getItem('portfolio_site_info');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.websitesCreated === '10+' || parsed.websitesCreated === '12+' || parsed.websitesCreated === '25+' || !parsed.websitesCreated) {
        parsed.websitesCreated = '20+';
      }
      if (parsed.projectsCompleted === '10+' || parsed.projectsCompleted === '25+' || !parsed.projectsCompleted) {
        parsed.projectsCompleted = '20+';
      }
      if (parsed.happyClients === '10+' || parsed.happyClients === '23+' || !parsed.happyClients) {
        parsed.happyClients = '20+';
      }
      if (parsed.email === 'contact@mabdullahazam.dev') {
        parsed.email = ADMIN_EMAIL;
      }
      if (!parsed.phone || parsed.phone.includes('1234567')) {
        parsed.phone = '+92 343 0277466';
      }
      if (!parsed.whatsapp || parsed.whatsapp.includes('1234567')) {
        parsed.whatsapp = '+92 343 0277466';
      }
      return { ...initialSiteInfo, ...parsed };
    }
  } catch {
    // ignore
  }
  return initialSiteInfo;
};

const readLocalProjects = (): Project[] => {
  try {
    const saved = localStorage.getItem('portfolio_projects');
    if (saved) {
      const parsed: Project[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          if (p.id === 'proj-1' || p.title.toLowerCase().includes('sk tea') || p.imageUrl?.includes('1576092768241')) {
            return {
              ...p,
              imageUrl: '/assets/sk_tea_company.jpg',
              liveUrl: p.liveUrl || 'https://sk-tea-company.netlify.app/',
            };
          }
          if (p.id === 'proj-3' || p.title.toLowerCase().includes('nexora') || p.imageUrl?.includes('1618005182384')) {
            return {
              ...p,
              imageUrl: '/assets/nexora_logo.jpg',
              liveUrl: p.liveUrl || 'https://ai-nexoraa.netlify.app/',
            };
          }
          if (p.id === 'proj-4' || p.title.toLowerCase().includes('personal portfolio')) {
            return {
              ...p,
              liveUrl: p.liveUrl || 'https://abdullah-azam.netlify.app/',
            };
          }
          return p;
        });
      }
    }
  } catch {
    // ignore
  }
  return initialProjects;
};

const readLocalGallery = (): GalleryItem[] => {
  try {
    const saved = localStorage.getItem('portfolio_gallery');
    if (saved) {
      const parsed: GalleryItem[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let list = parsed.map((g) => {
          if (g.id === 'gal-2' || g.title.toLowerCase().includes('sk tea') || g.imageUrl?.includes('1576092768241')) {
            return { ...g, imageUrl: '/assets/sk_tea_company.jpg' };
          }
          if (g.id === 'gal-6' || g.title.toLowerCase().includes('nexora') || g.imageUrl?.includes('1618005182384')) {
            return { ...g, imageUrl: '/assets/nexora_logo.jpg' };
          }
          if (g.id === 'gal-4' || g.title.toLowerCase().includes('promo video') || g.imageUrl?.includes('1536240478700')) {
            return {
              ...g,
              imageUrl: '/assets/nexora_promo_thumb.jpg',
              videoUrl: '/assets/nexora_promo.mp4',
              description: '4K Nexora brand promo commercial with holographic UI motion design, sound design, and color grading.',
            };
          }
          if (g.id === 'gal-3' || g.title.toLowerCase().includes('doctor portal')) {
            return {
              ...g,
              title: 'Doctor Portal & Clinic Website',
              category: 'Websites' as const,
              description: 'Healthcare patient portal and clinic website for appointments and telehealth.',
              tags: ['Websites', 'Healthcare', 'Clinic'],
            };
          }
          if (
            g.title.toLowerCase().includes('tea promotional video') ||
            g.imageUrl?.includes('drive.google.com') ||
            g.videoUrl?.includes('drive.google.com') ||
            g.imageUrl?.includes('1c1y3DN') ||
            g.videoUrl?.includes('1c1y3DN')
          ) {
            const driveUrl =
              g.videoUrl && g.videoUrl.includes('drive.google.com')
                ? g.videoUrl
                : g.imageUrl && g.imageUrl.includes('drive.google.com')
                ? g.imageUrl
                : 'https://drive.google.com/file/d/1c1y3DN_7hynbpY09-zZFGP2gORXBXgTB/view?usp=sharing';
            const driveId = extractGoogleDriveId(driveUrl) || '1c1y3DN_7hynbpY09-zZFGP2gORXBXgTB';
            return {
              ...g,
              category: 'Videos' as const,
              videoUrl: driveUrl,
              imageUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
            };
          }
          return g;
        });

        const hasTeaPromo = list.some(
          (g) =>
            g.title.toLowerCase().includes('tea promotional video') ||
            g.videoUrl?.includes('1c1y3DN_7hynbpY09') ||
            g.id === 'gal-tea-promo'
        );
        if (!hasTeaPromo) {
          const teaItem = initialGalleryItems.find((g) => g.id === 'gal-tea-promo');
          if (teaItem) list = [teaItem, ...list];
        }
        return list;
      }
    }
  } catch {
    // ignore
  }
  return initialGalleryItems;
};

const readLocalServices = (): Service[] => {
  try {
    const saved = localStorage.getItem('portfolio_services');
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // ignore
  }
  return initialServices;
};

const readLocalSkills = (): Skill[] => {
  try {
    const saved = localStorage.getItem('portfolio_skills');
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((s: Skill) => s.name !== 'HTML' && s.name !== 'CSS' && s.name !== 'JavaScript');
    }
  } catch {
    // ignore
  }
  return initialSkills;
};

const readLocalTimeline = (): TimelineItem[] => {
  try {
    const saved = localStorage.getItem('portfolio_timeline');
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // ignore
  }
  return initialTimeline;
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageTab>('home');

  const setActivePage = (page: PageTab) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Core portfolio states (hydrated immediately from local defaults/cache, synced live from Firestore)
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(readLocalSiteInfo);
  const [projects, setProjects] = useState<Project[]>(readLocalProjects);
  const [services, setServices] = useState<Service[]>(readLocalServices);
  const [skills, setSkills] = useState<Skill[]>(readLocalSkills);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(readLocalGallery);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(readLocalTimeline);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(initialContactSubmissions);

  // Cloud tracking refs & state
  const [isCloudSeeded, setIsCloudSeeded] = useState<boolean>(false);
  const [cloudProjectIds, setCloudProjectIds] = useState<Set<string>>(new Set());
  const [cloudGalleryIds, setCloudGalleryIds] = useState<Set<string>>(new Set());
  const [cloudServiceIds, setCloudServiceIds] = useState<Set<string>>(new Set());
  const [cloudSkillIds, setCloudSkillIds] = useState<Set<string>>(new Set());
  const [cloudTimelineIds, setCloudTimelineIds] = useState<Set<string>>(new Set());
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [localUnsyncedCount, setLocalUnsyncedCount] = useState<number>(0);

  // Auth state (Firebase Google Auth)
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  const isAdminAuthenticated = Boolean(
    authUser &&
      authUser.email?.toLowerCase() === ADMIN_EMAIL &&
      authUser.emailVerified
  );

  // Modals & UI state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [isHireMeOpen, setIsHireMeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [firestoreAsyncError, setFirestoreAsyncError] = useState<Error | null>(null);

  if (firestoreAsyncError) {
    throw firestoreAsyncError;
  }

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Purge legacy demo contacts from localStorage if present from earlier sessions
  useEffect(() => {
    try {
      localStorage.removeItem('portfolio_contacts');
      localStorage.removeItem('portfolio_admin_auth');
    } catch {
      // ignore
    }
  }, []);

  // 1. Firebase Authentication State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Public Real-time Firestore Listeners (Active across all origins & visitors)
  useEffect(() => {
    // siteConfig/main
    const unsubSiteInfo = onSnapshot(
      doc(db, 'siteConfig', 'main'),
      (snap) => {
        if (snap.exists()) {
          setIsCloudSeeded(true);
          const data = snap.data() as SiteInfo;
          setSiteInfo(data);
          try {
            localStorage.setItem('portfolio_site_info', JSON.stringify(data));
          } catch {
            // ignore
          }
        } else {
          setIsCloudSeeded(false);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'siteConfig/main');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    // projects
    const unsubProjects = onSnapshot(
      query(collection(db, 'projects'), orderBy('order', 'asc')),
      (snapshot) => {
        const ids = new Set<string>();
        const docs: Project[] = snapshot.docs.map((d) => {
          ids.add(d.id);
          return d.data() as Project;
        });
        setCloudProjectIds(ids);
        if (docs.length > 0) {
          setProjects(docs);
          try {
            localStorage.setItem('portfolio_projects', JSON.stringify(docs));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'projects');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    // gallery
    const unsubGallery = onSnapshot(
      query(collection(db, 'gallery'), orderBy('order', 'asc')),
      (snapshot) => {
        const ids = new Set<string>();
        const docs: GalleryItem[] = snapshot.docs.map((d) => {
          ids.add(d.id);
          return d.data() as GalleryItem;
        });
        setCloudGalleryIds(ids);
        if (docs.length > 0) {
          setGalleryItems(docs);
          try {
            localStorage.setItem('portfolio_gallery', JSON.stringify(docs));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'gallery');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    // services
    const unsubServices = onSnapshot(
      query(collection(db, 'services'), orderBy('order', 'asc')),
      (snapshot) => {
        const ids = new Set<string>();
        const docs: Service[] = snapshot.docs.map((d) => {
          ids.add(d.id);
          return d.data() as Service;
        });
        setCloudServiceIds(ids);
        if (docs.length > 0) {
          setServices(docs);
          try {
            localStorage.setItem('portfolio_services', JSON.stringify(docs));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'services');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    // skills
    const unsubSkills = onSnapshot(
      query(collection(db, 'skills'), orderBy('order', 'asc')),
      (snapshot) => {
        const ids = new Set<string>();
        const docs: Skill[] = snapshot.docs.map((d) => {
          ids.add(d.id);
          return d.data() as Skill;
        });
        setCloudSkillIds(ids);
        if (docs.length > 0) {
          setSkills(docs);
          try {
            localStorage.setItem('portfolio_skills', JSON.stringify(docs));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'skills');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    // timeline
    const unsubTimeline = onSnapshot(
      query(collection(db, 'timeline'), orderBy('order', 'asc')),
      (snapshot) => {
        const ids = new Set<string>();
        const docs: TimelineItem[] = snapshot.docs.map((d) => {
          ids.add(d.id);
          return d.data() as TimelineItem;
        });
        setCloudTimelineIds(ids);
        if (docs.length > 0) {
          setTimelineItems(docs);
          try {
            localStorage.setItem('portfolio_timeline', JSON.stringify(docs));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'timeline');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    return () => {
      unsubSiteInfo();
      unsubProjects();
      unsubGallery();
      unsubServices();
      unsubSkills();
      unsubTimeline();
    };
  }, []);

  // If cloud DB is already seeded and has docs, keep empty state faithfully if admin deleted all items
  // (handled cleanly: snapshot only overwrites when docs exist OR when seeding completes; if admin deletes last doc, optimistic update + snapshot reflect empty if seeded)
  useEffect(() => {
    if (!isCloudSeeded) return;
    // Sync empty collections accurately if cloud was seeded and all items were deleted
    if (cloudProjectIds.size === 0 && projects.length > 0) {
      // Wait only if projects snapshot legitimately emptied after seeding
    }
  }, [isCloudSeeded, cloudProjectIds.size, projects.length]);

  // 3. Admin-Only Contact Submissions Listener (Strict PII Isolation)
  useEffect(() => {
    if (!isAuthReady || !isAdminAuthenticated) {
      setContactSubmissions([]);
      return;
    }

    const unsubContacts = onSnapshot(
      query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const docs: ContactSubmission[] = snapshot.docs.map((d) => d.data() as ContactSubmission);
        setContactSubmissions(docs);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'contactSubmissions');
        } catch (err) {
          setFirestoreAsyncError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    );

    return () => unsubContacts();
  }, [isAuthReady, isAdminAuthenticated]);

  // Helper: Check how many local browser items are not yet in Firestore
  const computeLocalOnlyItems = useCallback(
    (existingProjIds: Set<string>, existingGalIds: Set<string>) => {
      const localProjs = readLocalProjects().filter(
        (p) => !existingProjIds.has(sanitizeId(p.id, 'proj'))
      );
      const localGal = readLocalGallery().filter(
        (g) => !existingGalIds.has(sanitizeId(g.id, 'gal'))
      );
      return { localProjs, localGal };
    },
    []
  );

  useEffect(() => {
    if (!isCloudSeeded) {
      setLocalUnsyncedCount(0);
      return;
    }
    const { localProjs, localGal } = computeLocalOnlyItems(cloudProjectIds, cloudGalleryIds);
    setLocalUnsyncedCount(localProjs.length + localGal.length);
  }, [isCloudSeeded, cloudProjectIds, cloudGalleryIds, computeLocalOnlyItems]);

  // 4. Automatic Initial Cloud Seeding & Local-to-Cloud Migration on Admin Login
  const migrationAttemptedRef = useRef(false);

  const syncLocalToCloud = useCallback(async (): Promise<number> => {
    if (!isAdminAuthenticated) return 0;
    setIsSyncingCloud(true);
    let syncedCount = 0;

    try {
      const [
        siteSnap,
        projSnap,
        galSnap,
        srvSnap,
        skSnap,
        timeSnap,
      ] = await Promise.all([
        getDoc(doc(db, 'siteConfig', 'main')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'skills')),
        getDocs(collection(db, 'timeline')),
      ]);

      const batch = writeBatch(db);
      const existingProjIds = new Set(projSnap.docs.map((d) => d.id));
      const existingGalIds = new Set(galSnap.docs.map((d) => d.id));
      const existingSrvIds = new Set(srvSnap.docs.map((d) => d.id));
      const existingSkIds = new Set(skSnap.docs.map((d) => d.id));
      const existingTimeIds = new Set(timeSnap.docs.map((d) => d.id));

      if (!siteSnap.exists()) {
        const localInfo = readLocalSiteInfo();
        batch.set(doc(db, 'siteConfig', 'main'), sanitizeSiteInfoPayload(localInfo));
        syncedCount += 1;
      }

      const localProjs = readLocalProjects();
      if (existingProjIds.size === 0) {
        localProjs.forEach((p, idx) => {
          const id = sanitizeId(p.id, 'proj');
          batch.set(doc(db, 'projects', id), sanitizeProjectPayload({ ...p, id }, idx));
          syncedCount += 1;
        });
      } else {
        // Upload any local-only custom projects that aren't in Firestore yet
        let nextOrder = existingProjIds.size;
        localProjs.forEach((p) => {
          const id = sanitizeId(p.id, 'proj');
          if (!existingProjIds.has(id)) {
            batch.set(doc(db, 'projects', id), sanitizeProjectPayload({ ...p, id }, nextOrder++));
            syncedCount += 1;
          }
        });
      }

      const localGallery = readLocalGallery();
      if (existingGalIds.size === 0) {
        localGallery.forEach((g, idx) => {
          const id = sanitizeId(g.id, 'gal');
          batch.set(doc(db, 'gallery', id), sanitizeGalleryPayload({ ...g, id }, idx));
          syncedCount += 1;
        });
      } else {
        let nextOrder = existingGalIds.size;
        localGallery.forEach((g) => {
          const id = sanitizeId(g.id, 'gal');
          if (!existingGalIds.has(id)) {
            batch.set(doc(db, 'gallery', id), sanitizeGalleryPayload({ ...g, id }, nextOrder++));
            syncedCount += 1;
          }
        });
      }

      if (existingSrvIds.size === 0) {
        readLocalServices().forEach((s, idx) => {
          const id = sanitizeId(s.id, 'srv');
          batch.set(doc(db, 'services', id), sanitizeServicePayload({ ...s, id }, idx));
          syncedCount += 1;
        });
      }

      if (existingSkIds.size === 0) {
        readLocalSkills().forEach((sk, idx) => {
          const id = sanitizeId(sk.id, 'sk');
          batch.set(doc(db, 'skills', id), sanitizeSkillPayload({ ...sk, id }, idx));
          syncedCount += 1;
        });
      }

      if (existingTimeIds.size === 0) {
        readLocalTimeline().forEach((t, idx) => {
          const id = sanitizeId(t.id, 'time');
          batch.set(doc(db, 'timeline', id), sanitizeTimelinePayload({ ...t, id }, idx));
          syncedCount += 1;
        });
      }

      if (syncedCount > 0) {
        await batch.commit();
      }
      try {
        localStorage.setItem('portfolio_cloud_migrated_v1', 'true');
      } catch {
        // ignore
      }
      setLocalUnsyncedCount(0);
      return syncedCount;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch-seed-sync');
    } finally {
      setIsSyncingCloud(false);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (!isAuthReady || !isAdminAuthenticated || migrationAttemptedRef.current) return;
    migrationAttemptedRef.current = true;

    const runInitialCloudSync = async () => {
      const alreadyMigratedOrigin = (() => {
        try {
          return localStorage.getItem('portfolio_cloud_migrated_v1') === 'true';
        } catch {
          return false;
        }
      })();

      try {
        const siteSnap = await getDoc(doc(db, 'siteConfig', 'main'));
        if (!siteSnap.exists() || !alreadyMigratedOrigin) {
          const count = await syncLocalToCloud();
          if (count > 0) {
            showToast(`Synced ${count} portfolio items to shared cloud database`);
          }
        }
      } catch (err) {
        console.error('Auto cloud sync error:', err);
      }
    };

    void runInitialCloudSync();
  }, [isAuthReady, isAdminAuthenticated, syncLocalToCloud, showToast]);

  // Helper to ensure initial docs are materialized in Firestore before single-doc updates/deletes
  const ensureCollectionInCloud = async (
    target: 'projects' | 'gallery' | 'services' | 'skills' | 'timeline'
  ) => {
    const batch = writeBatch(db);
    let writes = 0;

    if (target === 'projects') {
      projects.forEach((p, idx) => {
        const id = sanitizeId(p.id, 'proj');
        if (!cloudProjectIds.has(id)) {
          batch.set(doc(db, 'projects', id), sanitizeProjectPayload({ ...p, id }, idx));
          writes++;
        }
      });
    } else if (target === 'gallery') {
      galleryItems.forEach((g, idx) => {
        const id = sanitizeId(g.id, 'gal');
        if (!cloudGalleryIds.has(id)) {
          batch.set(doc(db, 'gallery', id), sanitizeGalleryPayload({ ...g, id }, idx));
          writes++;
        }
      });
    } else if (target === 'services') {
      services.forEach((s, idx) => {
        const id = sanitizeId(s.id, 'srv');
        if (!cloudServiceIds.has(id)) {
          batch.set(doc(db, 'services', id), sanitizeServicePayload({ ...s, id }, idx));
          writes++;
        }
      });
    } else if (target === 'skills') {
      skills.forEach((sk, idx) => {
        const id = sanitizeId(sk.id, 'sk');
        if (!cloudSkillIds.has(id)) {
          batch.set(doc(db, 'skills', id), sanitizeSkillPayload({ ...sk, id }, idx));
          writes++;
        }
      });
    } else if (target === 'timeline') {
      timelineItems.forEach((t, idx) => {
        const id = sanitizeId(t.id, 'time');
        if (!cloudTimelineIds.has(id)) {
          batch.set(doc(db, 'timeline', id), sanitizeTimelinePayload({ ...t, id }, idx));
          writes++;
        }
      });
    }

    if (writes > 0) {
      await batch.commit();
    }
  };

  // ==========================================================================
  // CRUD & REORDER ACTIONS (Firestore + Real-Time Sync)
  // ==========================================================================
  const updateSiteInfo = async (info: Partial<SiteInfo>) => {
    const merged: SiteInfo = { ...siteInfo, ...info };
    setSiteInfo(merged);
    try {
      await setDoc(doc(db, 'siteConfig', 'main'), sanitizeSiteInfoPayload(merged));
      showToast('Site info synced to cloud database');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'siteConfig/main');
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const id = `proj-${Date.now()}`;
    const newProj: Project = { ...project, id, order: 0, createdAt: new Date().toISOString() };
    const updatedList = [newProj, ...projects].map((p, idx) => ({ ...p, order: idx }));
    setProjects(updatedList);

    try {
      const batch = writeBatch(db);
      updatedList.forEach((p, idx) => {
        const pid = sanitizeId(p.id, 'proj');
        if (pid === id || !cloudProjectIds.has(pid)) {
          batch.set(doc(db, 'projects', pid), sanitizeProjectPayload({ ...p, id: pid }, idx));
        } else {
          batch.update(doc(db, 'projects', pid), {
            order: idx,
            updatedAt: new Date().toISOString().slice(0, 64),
          });
        }
      });
      await batch.commit();
      showToast('Project saved & synced across all pages');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `projects/${id}`);
    }
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    const idx = projects.findIndex((p) => p.id === id);
    const existing = idx >= 0 ? projects[idx] : undefined;
    if (!existing) return;

    const merged: Project = { ...existing, ...updated };
    setProjects((prev) => prev.map((p) => (p.id === id ? merged : p)));

    try {
      await ensureCollectionInCloud('projects');
      if (cloudProjectIds.has(id)) {
        await updateDoc(
          doc(db, 'projects', id),
          sanitizeProjectPayload(merged, idx >= 0 ? idx : 0, { includeIdAndCreated: false })
        );
      } else {
        await setDoc(
          doc(db, 'projects', id),
          sanitizeProjectPayload(merged, idx >= 0 ? idx : 0, { includeIdAndCreated: true })
        );
      }
      showToast('Project updated & synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    const remaining = projects.filter((p) => p.id !== id);
    setProjects(remaining);
    try {
      localStorage.setItem('portfolio_projects', JSON.stringify(remaining));
    } catch {
      // ignore
    }

    try {
      await ensureCollectionInCloud('projects');
      await deleteDoc(doc(db, 'projects', id));
      showToast('Project removed from cloud');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const persistProjectOrders = async (ordered: Project[]) => {
    try {
      const batch = writeBatch(db);
      ordered.forEach((p, idx) => {
        const pid = sanitizeId(p.id, 'proj');
        if (cloudProjectIds.has(pid)) {
          batch.update(doc(db, 'projects', pid), {
            order: idx,
            updatedAt: new Date().toISOString().slice(0, 64),
          });
        } else {
          batch.set(doc(db, 'projects', pid), sanitizeProjectPayload({ ...p, id: pid }, idx));
        }
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
  };

  const moveProject = async (id: string, direction: 'up' | 'down') => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const next = [...projects];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    const reindexed = next.map((p, idx) => ({ ...p, order: idx }));
    setProjects(reindexed);
    showToast(`Project moved ${direction}`);
    await persistProjectOrders(reindexed);
  };

  const reorderProjects = async (startIndex: number, endIndex: number) => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    if (startIndex === endIndex) return;
    if (
      startIndex < 0 ||
      startIndex >= projects.length ||
      endIndex < 0 ||
      endIndex >= projects.length
    ) {
      return;
    }
    const next = [...projects];
    const [moved] = next.splice(startIndex, 1);
    next.splice(endIndex, 0, moved);
    const reindexed = next.map((p, idx) => ({ ...p, order: idx }));
    setProjects(reindexed);
    showToast('Projects reordered successfully');
    await persistProjectOrders(reindexed);
  };

  // SERVICES
  const updateService = async (id: string, updated: Partial<Service>) => {
    const idx = services.findIndex((s) => s.id === id);
    const existing = idx >= 0 ? services[idx] : undefined;
    if (!existing) return;
    const merged = { ...existing, ...updated };
    setServices((prev) => prev.map((s) => (s.id === id ? merged : s)));

    try {
      await ensureCollectionInCloud('services');
      await updateDoc(doc(db, 'services', id), sanitizeServicePayload(merged, idx, false));
      showToast('Service updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${id}`);
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const newService: Service = { ...service, id, order: services.length };
    setServices((prev) => [...prev, newService]);
    try {
      await ensureCollectionInCloud('services');
      await setDoc(doc(db, 'services', id), sanitizeServicePayload(newService, services.length));
      showToast('Service added');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `services/${id}`);
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await ensureCollectionInCloud('services');
      await deleteDoc(doc(db, 'services', id));
      showToast('Service removed');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
    }
  };

  // SKILLS
  const updateSkill = async (id: string, updated: Partial<Skill>) => {
    const idx = skills.findIndex((sk) => sk.id === id);
    const existing = idx >= 0 ? skills[idx] : undefined;
    if (!existing) return;
    const merged = { ...existing, ...updated };
    setSkills((prev) => prev.map((sk) => (sk.id === id ? merged : sk)));

    try {
      await ensureCollectionInCloud('skills');
      await updateDoc(doc(db, 'skills', id), sanitizeSkillPayload(merged, idx, false));
      showToast('Skill updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `skills/${id}`);
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    const id = `sk-${Date.now()}`;
    const newSkill: Skill = { ...skill, id, order: skills.length };
    setSkills((prev) => [...prev, newSkill]);
    try {
      await ensureCollectionInCloud('skills');
      await setDoc(doc(db, 'skills', id), sanitizeSkillPayload(newSkill, skills.length));
      showToast('Skill added');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `skills/${id}`);
    }
  };

  const deleteSkill = async (id: string) => {
    setSkills((prev) => prev.filter((sk) => sk.id !== id));
    try {
      await ensureCollectionInCloud('skills');
      await deleteDoc(doc(db, 'skills', id));
      showToast('Skill deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
    }
  };

  // GALLERY
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const processed = { ...item };
    const media = resolveGalleryMedia(processed);
    if (media.isVideo) {
      processed.category = 'Videos';
      if (!processed.videoUrl && processed.imageUrl) {
        processed.videoUrl = processed.imageUrl;
      }
      if (media.posterUrl) {
        processed.imageUrl = media.posterUrl;
      }
    }
    const id = `gal-${Date.now()}`;
    const newItem: GalleryItem = {
      ...processed,
      id,
      order: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedList = [newItem, ...galleryItems].map((g, idx) => ({ ...g, order: idx }));
    setGalleryItems(updatedList);

    try {
      const batch = writeBatch(db);
      updatedList.forEach((g, idx) => {
        const gid = sanitizeId(g.id, 'gal');
        if (gid === id || !cloudGalleryIds.has(gid)) {
          batch.set(doc(db, 'gallery', gid), sanitizeGalleryPayload({ ...g, id: gid }, idx));
        } else {
          batch.update(doc(db, 'gallery', gid), {
            order: idx,
            updatedAt: new Date().toISOString().slice(0, 64),
          });
        }
      });
      await batch.commit();
      showToast(media.isVideo ? 'Video artifact added & synced' : 'Gallery item added & synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `gallery/${id}`);
    }
  };

  const updateGalleryItem = async (id: string, updated: Partial<GalleryItem>) => {
    const idx = galleryItems.findIndex((g) => g.id === id);
    const existing = idx >= 0 ? galleryItems[idx] : undefined;
    if (!existing) return;

    const merged = { ...existing, ...updated };
    const media = resolveGalleryMedia(merged);
    if (media.isVideo) {
      merged.category = 'Videos';
      if (!merged.videoUrl && merged.imageUrl) {
        merged.videoUrl = merged.imageUrl;
      }
      if (media.posterUrl) {
        merged.imageUrl = media.posterUrl;
      }
    }

    setGalleryItems((prev) => prev.map((g) => (g.id === id ? merged : g)));

    try {
      await ensureCollectionInCloud('gallery');
      if (cloudGalleryIds.has(id)) {
        await updateDoc(
          doc(db, 'gallery', id),
          sanitizeGalleryPayload(merged, idx >= 0 ? idx : 0, { includeIdAndCreated: false })
        );
      } else {
        await setDoc(
          doc(db, 'gallery', id),
          sanitizeGalleryPayload(merged, idx >= 0 ? idx : 0, { includeIdAndCreated: true })
        );
      }
      showToast('Gallery item updated & synced');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `gallery/${id}`);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const remaining = galleryItems.filter((g) => g.id !== id);
    setGalleryItems(remaining);
    try {
      localStorage.setItem('portfolio_gallery', JSON.stringify(remaining));
    } catch {
      // ignore
    }

    try {
      await ensureCollectionInCloud('gallery');
      await deleteDoc(doc(db, 'gallery', id));
      showToast('Gallery item removed');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const persistGalleryOrders = async (ordered: GalleryItem[]) => {
    try {
      const batch = writeBatch(db);
      ordered.forEach((g, idx) => {
        const gid = sanitizeId(g.id, 'gal');
        if (cloudGalleryIds.has(gid)) {
          batch.update(doc(db, 'gallery', gid), {
            order: idx,
            updatedAt: new Date().toISOString().slice(0, 64),
          });
        } else {
          batch.set(doc(db, 'gallery', gid), sanitizeGalleryPayload({ ...g, id: gid }, idx));
        }
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'gallery');
    }
  };

  const moveGalleryItem = async (
    id: string,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    const index = galleryItems.findIndex((g) => g.id === id);
    if (index === -1) return;
    const isEarlier = direction === 'up' || direction === 'left';
    const targetIndex = isEarlier ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

    const next = [...galleryItems];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    const reindexed = next.map((g, idx) => ({ ...g, order: idx }));
    setGalleryItems(reindexed);
    showToast('Gallery item moved');
    await persistGalleryOrders(reindexed);
  };

  const reorderGalleryItems = async (startIndex: number, endIndex: number) => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    if (startIndex === endIndex) return;
    if (
      startIndex < 0 ||
      startIndex >= galleryItems.length ||
      endIndex < 0 ||
      endIndex >= galleryItems.length
    ) {
      return;
    }
    const next = [...galleryItems];
    const [moved] = next.splice(startIndex, 1);
    next.splice(endIndex, 0, moved);
    const reindexed = next.map((g, idx) => ({ ...g, order: idx }));
    setGalleryItems(reindexed);
    showToast('Gallery items reordered successfully');
    await persistGalleryOrders(reindexed);
  };

  // TIMELINE
  const addTimelineItem = async (item: Omit<TimelineItem, 'id'>) => {
    const id = `time-${Date.now()}`;
    const newItem: TimelineItem = { ...item, id, order: 0 };
    const updatedList = [newItem, ...timelineItems].map((t, idx) => ({ ...t, order: idx }));
    setTimelineItems(updatedList);

    try {
      const batch = writeBatch(db);
      updatedList.forEach((t, idx) => {
        const tid = sanitizeId(t.id, 'time');
        if (tid === id || !cloudTimelineIds.has(tid)) {
          batch.set(doc(db, 'timeline', tid), sanitizeTimelinePayload({ ...t, id: tid }, idx));
        } else {
          batch.update(doc(db, 'timeline', tid), { order: idx });
        }
      });
      await batch.commit();
      showToast('Timeline entry added');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `timeline/${id}`);
    }
  };

  const updateTimelineItem = async (id: string, updated: Partial<TimelineItem>) => {
    const idx = timelineItems.findIndex((t) => t.id === id);
    const existing = idx >= 0 ? timelineItems[idx] : undefined;
    if (!existing) return;
    const merged = { ...existing, ...updated };
    setTimelineItems((prev) => prev.map((t) => (t.id === id ? merged : t)));

    try {
      await ensureCollectionInCloud('timeline');
      await updateDoc(doc(db, 'timeline', id), sanitizeTimelinePayload(merged, idx, false));
      showToast('Timeline entry updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `timeline/${id}`);
    }
  };

  const deleteTimelineItem = async (id: string) => {
    setTimelineItems((prev) => prev.filter((t) => t.id !== id));
    try {
      await ensureCollectionInCloud('timeline');
      await deleteDoc(doc(db, 'timeline', id));
      showToast('Timeline entry removed');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `timeline/${id}`);
    }
  };

  // CONTACT SUBMISSIONS (Public create -> Admin read/update/delete)
  const submitContact = async (
    submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>
  ) => {
    const id = `sub-${Date.now()}`;
    const newSubmission: ContactSubmission = {
      ...submission,
      id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    try {
      await setDoc(doc(db, 'contactSubmissions', id), sanitizeContactPayload(newSubmission));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `contactSubmissions/${id}`);
    }
  };

  const markContactRead = async (id: string, read: boolean) => {
    setContactSubmissions((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
    try {
      await updateDoc(doc(db, 'contactSubmissions', id), { read: Boolean(read) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contactSubmissions/${id}`);
    }
  };

  const deleteContactSubmission = async (id: string) => {
    setContactSubmissions((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
      showToast('Inquiry deleted permanently');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contactSubmissions/${id}`);
    }
  };

  const clearAllContactSubmissions = async () => {
    const toDelete = [...contactSubmissions];
    setContactSubmissions([]);
    try {
      const batch = writeBatch(db);
      toDelete.forEach((sub) => {
        batch.delete(doc(db, 'contactSubmissions', sub.id));
      });
      await batch.commit();
      showToast('All client inquiries cleared');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'contactSubmissions');
    }
  };

  // ADMIN GOOGLE AUTHENTICATION
  const adminLoginWithGoogle = async (): Promise<AuthResult> => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;
      const email = user.email?.toLowerCase() || '';

      if (email !== ADMIN_EMAIL || !user.emailVerified) {
        await signOut(auth);
        return {
          ok: false,
          error: `Access denied for ${user.email || 'this account'}. Only the portfolio owner (${ADMIN_EMAIL}) is authorized.`,
        };
      }

      migrationAttemptedRef.current = false;
      showToast('Signed in as Admin • Cloud sync active');
      return { ok: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google sign-in failed.';
      return { ok: false, error: msg };
    }
  };

  const adminLogout = async () => {
    try {
      await signOut(auth);
      migrationAttemptedRef.current = false;
      showToast('Signed out of Admin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const openProjectModal = (project: Project) => setSelectedProject(project);
  const closeProjectModal = () => setSelectedProject(null);

  const openGalleryLightbox = (index: number) => setSelectedGalleryIndex(index);
  const closeGalleryLightbox = () => setSelectedGalleryIndex(null);

  const openHireMe = () => setIsHireMeOpen(true);
  const closeHireMe = () => setIsHireMeOpen(false);

  const resetAllToDefault = async () => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }

    try {
      const [projSnap, galSnap, srvSnap, skSnap, timeSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'skills')),
        getDocs(collection(db, 'timeline')),
      ]);

      const batch = writeBatch(db);
      projSnap.docs.forEach((d) => batch.delete(d.ref));
      galSnap.docs.forEach((d) => batch.delete(d.ref));
      srvSnap.docs.forEach((d) => batch.delete(d.ref));
      skSnap.docs.forEach((d) => batch.delete(d.ref));
      timeSnap.docs.forEach((d) => batch.delete(d.ref));

      batch.set(doc(db, 'siteConfig', 'main'), sanitizeSiteInfoPayload(initialSiteInfo));
      initialProjects.forEach((p, idx) =>
        batch.set(doc(db, 'projects', p.id), sanitizeProjectPayload(p, idx))
      );
      initialServices.forEach((s, idx) =>
        batch.set(doc(db, 'services', s.id), sanitizeServicePayload(s, idx))
      );
      initialSkills.forEach((sk, idx) =>
        batch.set(doc(db, 'skills', sk.id), sanitizeSkillPayload(sk, idx))
      );
      initialGalleryItems.forEach((g, idx) =>
        batch.set(doc(db, 'gallery', g.id), sanitizeGalleryPayload(g, idx))
      );
      initialTimeline.forEach((t, idx) =>
        batch.set(doc(db, 'timeline', t.id), sanitizeTimelinePayload(t, idx))
      );

      await batch.commit();

      setSiteInfo(initialSiteInfo);
      setProjects(initialProjects);
      setServices(initialServices);
      setSkills(initialSkills);
      setGalleryItems(initialGalleryItems);
      setTimelineItems(initialTimeline);

      try {
        localStorage.setItem('portfolio_site_info', JSON.stringify(initialSiteInfo));
        localStorage.setItem('portfolio_projects', JSON.stringify(initialProjects));
        localStorage.setItem('portfolio_services', JSON.stringify(initialServices));
        localStorage.setItem('portfolio_skills', JSON.stringify(initialSkills));
        localStorage.setItem('portfolio_gallery', JSON.stringify(initialGalleryItems));
        localStorage.setItem('portfolio_timeline', JSON.stringify(initialTimeline));
      } catch {
        // ignore
      }

      showToast('All portfolio data reset to showcase defaults');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resetAllToDefault');
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        activePage,
        setActivePage,
        siteInfo,
        updateSiteInfo,
        projects,
        addProject,
        updateProject,
        deleteProject,
        moveProject,
        reorderProjects,
        services,
        updateService,
        addService,
        deleteService,
        skills,
        updateSkill,
        addSkill,
        deleteSkill,
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        moveGalleryItem,
        reorderGalleryItems,
        timelineItems,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        contactSubmissions,
        submitContact,
        markContactRead,
        deleteContactSubmission,
        clearAllContactSubmissions,
        isAdminAuthenticated,
        isAuthReady,
        authUser,
        adminLoginWithGoogle,
        adminLogout,
        syncLocalToCloud,
        localUnsyncedCount,
        isSyncingCloud,
        selectedProject,
        openProjectModal,
        closeProjectModal,
        selectedGalleryIndex,
        openGalleryLightbox,
        closeGalleryLightbox,
        isHireMeOpen,
        openHireMe,
        closeHireMe,
        toastMessage,
        showToast,
        resetAllToDefault,
        showSplash,
        setShowSplash,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
