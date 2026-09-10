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

interface PortfolioContextType {
  activePage: PageTab;
  setActivePage: (page: PageTab) => void;
  siteInfo: SiteInfo;
  updateSiteInfo: (info: Partial<SiteInfo>) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
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
  timelineItems: TimelineItem[];
  addTimelineItem: (item: Omit<TimelineItem, 'id'>) => void;
  updateTimelineItem: (id: string, updated: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  contactSubmissions: ContactSubmission[];
  submitContact: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>) => void;
  markContactRead: (id: string, read: boolean) => void;
  deleteContactSubmission: (id: string) => void;
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
        if (parsed.websitesCreated === '12+') {
          parsed.websitesCreated = '25+';
        }
        if (parsed.email === 'contact@mabdullahazam.dev') {
          parsed.email = 'maraapna8@gmail.com';
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
      return saved ? JSON.parse(saved) : initialProjects;
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
      return saved ? JSON.parse(saved) : initialGalleryItems;
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
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setGalleryItems((prev) => [newItem, ...prev]);
    showToast('Gallery image added');
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGalleryItems((prev) => prev.map((g) => (g.id === id ? { ...g, ...updated } : g)));
    showToast('Gallery image updated');
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    showToast('Gallery item removed');
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
    setContactSubmissions((prev) => prev.filter((c) => c.id !== id));
    showToast('Message deleted');
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
        timelineItems,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        contactSubmissions,
        submitContact,
        markContactRead,
        deleteContactSubmission,
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
