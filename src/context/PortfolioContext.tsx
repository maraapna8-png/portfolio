import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface PortfolioContextType {
  activePage: PageTab;
  setActivePage: (page: PageTab) => void;
  siteInfo: SiteInfo;
  updateSiteInfo: (info: Partial<SiteInfo>) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProject: (id: string, direction: 'up' | 'down') => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  services: Service[];
  updateService: (id: string, updated: Partial<Service>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;
  skills: Skill[];
  updateSkill: (id: string, updated: Partial<Skill>) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  deleteSkill: (id: string) => void;
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  moveGalleryItem: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  reorderGalleryItems: (startIndex: number, endIndex: number) => void;
  timelineItems: TimelineItem[];
  addTimelineItem: (item: Omit<TimelineItem, 'id'>) => void;
  updateTimelineItem: (id: string, updated: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  contactSubmissions: ContactSubmission[];
  submitContact: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>) => void;
  markContactRead: (id: string, read: boolean) => void;
  deleteContactSubmission: (id: string) => void;
  clearAllContactSubmissions: () => void;
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
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
  resetAllToDefault: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageTab>('home');

  const setActivePage = (page: PageTab) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State with LocalStorage fallbacks
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(() => {
    try {
      const saved = localStorage.getItem('portfolio_site_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.websitesCreated === '12+' || parsed.websitesCreated === '25+' || !parsed.websitesCreated) {
          parsed.websitesCreated = '10+';
        }
        if (parsed.projectsCompleted === '25+' || !parsed.projectsCompleted) {
          parsed.projectsCompleted = '10+';
        }
        if (parsed.happyClients === '23+' || !parsed.happyClients) {
          parsed.happyClients = '10+';
        }
        if (parsed.email === 'contact@mabdullahazam.dev') {
          parsed.email = 'maraapna8@gmail.com';
        }
        if (!parsed.phone || parsed.phone.includes('1234567')) {
          parsed.phone = '+92 343 0277466';
        }
        if (!parsed.whatsapp || parsed.whatsapp.includes('1234567')) {
          parsed.whatsapp = '+92 343 0277466';
        }
        try {
          localStorage.setItem('portfolio_site_info', JSON.stringify(parsed));
        } catch {
          // ignore
        }
        return parsed;
      }
      return initialSiteInfo;
    } catch {
      return initialSiteInfo;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_projects');
      if (saved) {
        const parsed: Project[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (p.id === 'proj-1' || p.title.toLowerCase().includes('sk tea') || p.imageUrl.includes('1576092768241')) {
            return {
              ...p,
              imageUrl: '/assets/sk_tea_company.jpg',
              liveUrl: 'https://sk-tea-company.netlify.app/',
            };
          }
          if (p.id === 'proj-3' || p.title.toLowerCase().includes('nexora') || p.imageUrl.includes('1618005182384')) {
            return {
              ...p,
              imageUrl: '/assets/nexora_logo.jpg',
              liveUrl: 'https://ai-nexoraa.netlify.app/',
            };
          }
          if (p.id === 'proj-4' || p.title.toLowerCase().includes('personal portfolio')) {
            return {
              ...p,
              liveUrl: 'https://abdullah-azam.netlify.app/',
            };
          }
          return p;
        });
      }
      return initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_skills');
      if (saved) {
        const parsed: Skill[] = JSON.parse(saved);
        return parsed.filter(
          (s) => s.name !== 'HTML' && s.name !== 'CSS' && s.name !== 'JavaScript'
        );
      }
      return initialSkills;
    } catch {
      return initialSkills;
    }
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_gallery');
      if (saved) {
        const parsed: GalleryItem[] = JSON.parse(saved);
        let list = parsed.map((g) => {
          if (g.id === 'gal-2' || g.title.toLowerCase().includes('sk tea') || g.imageUrl.includes('1576092768241')) {
            return { ...g, imageUrl: '/assets/sk_tea_company.jpg' };
          }
          if (g.id === 'gal-6' || g.title.toLowerCase().includes('nexora') || g.imageUrl.includes('1618005182384')) {
            return { ...g, imageUrl: '/assets/nexora_logo.jpg' };
          }
          if (g.id === 'gal-4' || g.title.toLowerCase().includes('promo video') || g.imageUrl.includes('1536240478700')) {
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
          // Fix Google Drive video entries, including tea promotional video
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

        // Ensure tea promotional video is present if not already added
        const hasTeaPromo = list.some(
          (g) =>
            g.title.toLowerCase().includes('tea promotional video') ||
            g.videoUrl?.includes('1c1y3DN_7hynbpY09') ||
            g.id === 'gal-tea-promo'
        );
        if (!hasTeaPromo) {
          const teaItem = initialGalleryItems.find((g) => g.id === 'gal-tea-promo');
          if (teaItem) {
            list = [teaItem, ...list];
          }
        }

        return list;
      }
      return initialGalleryItems;
    } catch {
      return initialGalleryItems;
    }
  });

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_timeline');
      return saved ? JSON.parse(saved) : initialTimeline;
    } catch {
      return initialTimeline;
    }
  });

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_contacts');
      return saved ? JSON.parse(saved) : initialContactSubmissions;
    } catch {
      return initialContactSubmissions;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('portfolio_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [isHireMeOpen, setIsHireMeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('portfolio_site_info', JSON.stringify(siteInfo));
  }, [siteInfo]);

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('portfolio_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('portfolio_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('portfolio_timeline', JSON.stringify(timelineItems));
  }, [timelineItems]);

  useEffect(() => {
    localStorage.setItem('portfolio_contacts', JSON.stringify(contactSubmissions));
  }, [contactSubmissions]);

  useEffect(() => {
    localStorage.setItem('portfolio_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Actions
  const updateSiteInfo = (info: Partial<SiteInfo>) => {
    setSiteInfo((prev) => ({ ...prev, ...info }));
    showToast('Site info updated successfully');
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProj: Project = { ...project, id: `proj-${Date.now()}` };
    setProjects((prev) => [newProj, ...prev]);
    showToast('Project added successfully');
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Project updated');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project removed');
  };

  const moveProject = (id: string, direction: 'up' | 'down') => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    setProjects((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      try {
        localStorage.setItem('portfolio_projects', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to sync projects to localStorage', err);
      }
      return next;
    });
    showToast(`Project moved ${direction}`);
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    if (startIndex === endIndex) return;
    setProjects((prev) => {
      if (
        startIndex < 0 ||
        startIndex >= prev.length ||
        endIndex < 0 ||
        endIndex >= prev.length
      )
        return prev;
      const next = [...prev];
      const [moved] = next.splice(startIndex, 1);
      next.splice(endIndex, 0, moved);
      try {
        localStorage.setItem('portfolio_projects', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to sync projects to localStorage', err);
      }
      return next;
    });
    showToast('Projects reordered successfully');
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Service updated');
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = { ...service, id: `srv-${Date.now()}` };
    setServices((prev) => [...prev, newService]);
    showToast('Service added');
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service removed');
  };

  const updateSkill = (id: string, updated: Partial<Skill>) => {
    setSkills((prev) => prev.map((sk) => (sk.id === id ? { ...sk, ...updated } : sk)));
    showToast('Skill updated');
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...skill, id: `sk-${Date.now()}` };
    setSkills((prev) => [...prev, newSkill]);
    showToast('Skill added');
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((sk) => sk.id !== id));
    showToast('Skill deleted');
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    let processed = { ...item };
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
    const newItem: GalleryItem = { ...processed, id: `gal-${Date.now()}` };
    setGalleryItems((prev) => [newItem, ...prev]);
    showToast(media.isVideo ? 'Video artifact added' : 'Gallery item added');
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGalleryItems((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const merged = { ...g, ...updated };
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
        return merged;
      })
    );
    showToast('Gallery item updated');
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    showToast('Gallery item removed');
  };

  const moveGalleryItem = (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    setGalleryItems((prev) => {
      const index = prev.findIndex((g) => g.id === id);
      if (index === -1) return prev;
      const isEarlier = direction === 'up' || direction === 'left';
      const targetIndex = isEarlier ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      try {
        localStorage.setItem('portfolio_gallery', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to sync gallery to localStorage', err);
      }
      return next;
    });
    showToast('Gallery item moved');
  };

  const reorderGalleryItems = (startIndex: number, endIndex: number) => {
    if (!isAdminAuthenticated) {
      showToast('Admin authorization required');
      return;
    }
    if (startIndex === endIndex) return;
    setGalleryItems((prev) => {
      if (
        startIndex < 0 ||
        startIndex >= prev.length ||
        endIndex < 0 ||
        endIndex >= prev.length
      )
        return prev;
      const next = [...prev];
      const [moved] = next.splice(startIndex, 1);
      next.splice(endIndex, 0, moved);
      try {
        localStorage.setItem('portfolio_gallery', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to sync gallery to localStorage', err);
      }
      return next;
    });
    showToast('Gallery items reordered successfully');
  };

  const addTimelineItem = (item: Omit<TimelineItem, 'id'>) => {
    const newItem: TimelineItem = { ...item, id: `time-${Date.now()}` };
    setTimelineItems((prev) => [newItem, ...prev]);
    showToast('Timeline entry added');
  };

  const updateTimelineItem = (id: string, updated: Partial<TimelineItem>) => {
    setTimelineItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    showToast('Timeline entry updated');
  };

  const deleteTimelineItem = (id: string) => {
    setTimelineItems((prev) => prev.filter((t) => t.id !== id));
    showToast('Timeline entry removed');
  };

  const submitContact = (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setContactSubmissions((prev) => [newSubmission, ...prev]);
  };

  const markContactRead = (id: string, read: boolean) => {
    setContactSubmissions((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
  };

  const deleteContactSubmission = (id: string) => {
    setContactSubmissions((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('portfolio_contacts', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync contacts deletion to localStorage', err);
      }
      return updated;
    });
    showToast('Inquiry deleted successfully');
  };

  const clearAllContactSubmissions = () => {
    setContactSubmissions([]);
    try {
      localStorage.setItem('portfolio_contacts', JSON.stringify([]));
    } catch (err) {
      console.error('Failed to clear contacts in localStorage', err);
    }
    showToast('All client inquiries cleared');
  };

  const adminLogin = (password: string): boolean => {
    // Secure simulated admin credential check - accepts 'admin123' or 'abdullah2026' or 'admin'
    if (password === 'admin123' || password === 'abdullah2026' || password === 'admin') {
      setIsAdminAuthenticated(true);
      showToast('Admin logged in successfully');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Logged out of Admin');
  };

  const openProjectModal = (project: Project) => setSelectedProject(project);
  const closeProjectModal = () => setSelectedProject(null);

  const openGalleryLightbox = (index: number) => setSelectedGalleryIndex(index);
  const closeGalleryLightbox = () => setSelectedGalleryIndex(null);

  const openHireMe = () => setIsHireMeOpen(true);
  const closeHireMe = () => setIsHireMeOpen(false);

  const resetAllToDefault = () => {
    setSiteInfo(initialSiteInfo);
    setProjects(initialProjects);
    setServices(initialServices);
    setSkills(initialSkills);
    setGalleryItems(initialGalleryItems);
    setTimelineItems(initialTimeline);
    setContactSubmissions(initialContactSubmissions);
    showToast('All portfolio data reset to showcase defaults');
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
        adminLogin,
        adminLogout,
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
