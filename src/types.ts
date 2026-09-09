export interface Project {
  id: string;
  title: string;
  category: 'Websites' | 'Business' | 'AI' | 'Portfolio' | 'Other';
  description: string;
  fullDescription: string;
  features: string[];
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  challenges?: string;
  solution?: string;
  featured: boolean;
  completionDate?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Design & UX' | 'Content & Video' | 'AI & Tools';
  iconName?: string;
  experienceYears?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'My Work' | 'Websites' | 'Designs' | 'Videos' | 'Certificates' | 'Other';
  imageUrl: string;
  description: string;
  date?: string;
  tags?: string[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  achievement: string;
  imageUrl?: string;
  badge?: string;
}

export interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceRequired: string;
  projectBudget: string;
  projectDetails: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteInfo {
  name: string;
  title: string;
  greetingBadge: string;
  heroIntro: string;
  bio: string;
  experienceYears: string;
  websitesCreated: string;
  projectsCompleted: string;
  happyClients: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  availability: string;
  whoIAm: string;
  myGoals: string;
}

export type PageTab = 'home' | 'about' | 'projects' | 'gallery' | 'history' | 'contact' | 'admin';
