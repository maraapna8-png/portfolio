import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, GalleryItem, TimelineItem, Skill, Service } from '../types';
import {
  Shield,
  Lock,
  LogOut,
  FolderGit2,
  Image as ImageIcon,
  Mail,
  History,
  User,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Save,
  X,
  MessageSquare,
  Search,
  Check,
  AlertTriangle,
  Film,
  Play,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resolveGalleryMedia, extractGoogleDriveId } from '../utils/mediaUtils';

export const AdminPage: React.FC = () => {
  const {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    projects,
    addProject,
    updateProject,
    deleteProject,
    moveProject,
    reorderProjects,
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
    markContactRead,
    deleteContactSubmission,
    clearAllContactSubmissions,
    siteInfo,
    updateSiteInfo,
    skills,
    updateSkill,
    addSkill,
    deleteSkill,
    services,
    updateService,
    resetAllToDefault,
    showToast,
  } = usePortfolio();

  // Authentication State
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Drag and drop reordering states
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);

  // Deletion Confirmation Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<
    'projects' | 'gallery' | 'contacts' | 'history' | 'about'
  >('projects');

  // Modal / Form Edit States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    category: 'Websites',
    description: '',
    fullDescription: '',
    features: ['Responsive UI', 'Clean Architecture'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: '',
    githubUrl: '',
    challenges: '',
    solution: '',
    featured: true,
    completionDate: '2026',
  });

  // Gallery Form State
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'My Work',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    videoUrl: '',
    description: '',
    date: '2026',
    tags: ['Work', 'Web'],
  });

  // Timeline Form State
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [timelineForm, setTimelineForm] = useState<Omit<TimelineItem, 'id'>>({
    year: '2026',
    title: '',
    description: '',
    achievement: '',
    badge: 'Milestone',
    imageUrl: '',
  });

  // About & Skills Form State
  const [aboutForm, setAboutForm] = useState(siteInfo);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(90);
  const [newSkillCategory, setNewSkillCategory] = useState<Skill['category']>('Frontend');

  // Selected Message for Inspector
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setPasswordInput('');
    }
  };

  // ----------------------------------------------------
  // PROJECT HANDLERS
  // ----------------------------------------------------
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    if (editingProject) {
      updateProject(editingProject.id, projectForm);
      setEditingProject(null);
    } else {
      addProject(projectForm);
      setIsAddingProject(false);
    }
  };

  const startEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      category: p.category,
      description: p.description,
      fullDescription: p.fullDescription,
      features: p.features || [],
      technologies: p.technologies || [],
      imageUrl: p.imageUrl,
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      challenges: p.challenges || '',
      solution: p.solution || '',
      featured: p.featured,
      completionDate: p.completionDate || '2026',
    });
  };

  // ----------------------------------------------------
  // GALLERY HANDLERS
  // ----------------------------------------------------
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) return;

    if (editingGallery) {
      updateGalleryItem(editingGallery.id, galleryForm);
      setEditingGallery(null);
      setIsAddingGallery(false);
    } else {
      addGalleryItem(galleryForm);
      setIsAddingGallery(false);
    }
  };

  const startEditGallery = (g: GalleryItem) => {
    setEditingGallery(g);
    setGalleryForm({
      title: g.title,
      category: g.category,
      imageUrl: g.imageUrl,
      videoUrl: g.videoUrl || '',
      description: g.description,
      date: g.date || '2026',
      tags: g.tags || [],
    });
    setIsAddingGallery(true);
  };

  // ----------------------------------------------------
  // TIMELINE HANDLERS
  // ----------------------------------------------------
  const handleSaveTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineForm.title.trim()) return;

    if (editingTimeline) {
      updateTimelineItem(editingTimeline.id, timelineForm);
      setEditingTimeline(null);
    } else {
      addTimelineItem(timelineForm);
      setIsAddingTimeline(false);
    }
  };

  const startEditTimeline = (t: TimelineItem) => {
    setEditingTimeline(t);
    setTimelineForm({
      year: t.year,
      title: t.title,
      description: t.description,
      achievement: t.achievement,
      badge: t.badge || 'Milestone',
      imageUrl: t.imageUrl || '',
    });
  };

  // ----------------------------------------------------
  // ABOUT / SKILLS HANDLERS
  // ----------------------------------------------------
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteInfo(aboutForm);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill({
      name: newSkillName,
      level: newSkillLevel,
      category: newSkillCategory,
      experienceYears: '2+ yrs',
    });
    setNewSkillName('');
  };

  // Unauthenticated View: Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/50 via-cyan-400/30 to-purple-600/50 shadow-2xl shadow-blue-950/90">
          <div className="rounded-2xl bg-[#080d1a] p-8 border border-blue-900/40 text-center space-y-6">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 mx-auto shadow-xl shadow-cyan-500/30">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#080d1a]">
                <img
                  src="/assets/logo.png"
                  alt="M Abdullah Azam Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Admin Control Portal
              </h1>
              <p className="text-xs text-slate-400">
                Secure access to manage projects, gallery artifacts, messages, and portfolio details.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Administrator Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Enter administrator passcode"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-400 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                    title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {authError && (
                  <p className="text-[11px] text-rose-400 mt-1.5 font-medium">
                    Invalid administrator passcode. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Authorize & Login</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = contactSubmissions.filter((c) => !c.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#080d1a] border border-blue-900/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-md">
            <img
              src="/assets/logo.png"
              alt="M Abdullah Azam Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Admin Management Portal
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as M Abdullah Azam • Real-time synchronization active
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetAllToDefault}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Reset to default showcase dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={adminLogout}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-blue-900/40 pb-4">
        <button
          onClick={() => setAdminTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'projects'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'gallery'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery ({galleryItems.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'contacts'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inquiries ({contactSubmissions.length})</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-400 text-black font-bold">
              {unreadCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'history'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History Timeline ({timelineItems.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('about')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'about'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>About & Skills</span>
        </button>
      </div>

      {/* ====================================
          TAB 1: PROJECTS MANAGEMENT
         ==================================== */}
      {adminTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Project Portfolio Management</h2>
              <p className="text-xs text-slate-400">Add, edit, feature, or delete projects.</p>
            </div>
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectForm({
                  title: '',
                  category: 'Websites',
                  description: '',
                  fullDescription: '',
                  features: ['Responsive UI', 'Modern Styling'],
                  technologies: ['React', 'TypeScript', 'Tailwind CSS'],
                  imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                  liveUrl: '',
                  githubUrl: '',
                  challenges: '',
                  solution: '',
                  featured: true,
                  completionDate: '2026',
                });
                setIsAddingProject(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Add / Edit Project Form Modal */}
          {(isAddingProject || editingProject) && (
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingProject(false);
                    setEditingProject(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. SK Tea Company"
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, category: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Websites">Websites</option>
                      <option value="Business">Business</option>
                      <option value="AI">AI</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Short Summary Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                    placeholder="Brief 1-2 sentence overview"
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Project Details & Scope
                  </label>
                  <textarea
                    rows={2}
                    value={projectForm.fullDescription}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, fullDescription: e.target.value })
                    }
                    placeholder="Detailed explanation of the project..."
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Image / Screenshot URL
                    </label>
                    <input
                      type="url"
                      required
                      value={projectForm.imageUrl}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Live Website URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.liveUrl}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, liveUrl: e.target.value })
                      }
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projectForm.technologies.join(', ')}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="React, TypeScript, Tailwind CSS"
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span>Feature on Homepage</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProject(false);
                      setEditingProject(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Table / List */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-slate-300 shadow-md">
              <div className="flex items-center gap-2.5">
                <ArrowUpDown className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Rearrange Projects:</strong> Use the <strong>Up (↑)</strong> and <strong>Down (↓)</strong> buttons or <strong>drag rows</strong> to adjust project order. Order updates instantly across the portfolio.
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 px-2.5 py-1 rounded-lg bg-blue-900/50 border border-blue-700/50 shrink-0 self-start sm:self-auto">
                {projects.length} Total Projects
              </span>
            </div>

            <div className="rounded-2xl bg-[#080d1a] border border-blue-900/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#050811] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4 w-28 text-center">Position</th>
                      <th className="p-4">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Tech Stack</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {projects.map((p, idx) => (
                      <tr
                        key={p.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedProjectIndex(idx);
                          e.dataTransfer.setData('text/plain', String(idx));
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedProjectIndex !== null && draggedProjectIndex !== idx) {
                            reorderProjects(draggedProjectIndex, idx);
                          }
                          setDraggedProjectIndex(null);
                        }}
                        onDragEnd={() => setDraggedProjectIndex(null)}
                        className={`hover:bg-slate-900/50 transition-colors ${
                          draggedProjectIndex === idx ? 'opacity-40 bg-blue-900/20' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-cyan-400 transition-colors p-1"
                              title="Drag to reorder project"
                            >
                              <GripVertical className="w-4 h-4" />
                            </button>
                            <span className="w-7 text-center font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 shadow-inner">
                              #{idx + 1}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                onClick={() => moveProject(p.id, 'up')}
                                disabled={idx === 0}
                                title="Move project up (earlier)"
                                className="p-1 rounded bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveProject(p.id, 'down')}
                                disabled={idx === projects.length - 1}
                                title="Move project down (later)"
                                className="p-1 rounded bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-12 h-10 rounded-lg object-cover bg-slate-950 shrink-0 border border-blue-900/40"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{p.title}</div>
                            <div className="text-slate-400 line-clamp-1 text-[11px]">
                              {p.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-950 text-cyan-300 border border-blue-800/50">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {p.technologies.slice(0, 3).map((t, tidx) => (
                              <span
                                key={tidx}
                                className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          {p.featured ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-500">No</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEditProject(p)}
                              className="p-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteDialog({
                                  title: 'Delete Project',
                                  description: `Are you sure you want to permanently delete project "${p.title}"?`,
                                  onConfirm: () => deleteProject(p.id),
                                });
                              }}
                              className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          TAB 2: GALLERY MANAGEMENT
         ==================================== */}
      {adminTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Gallery Artifacts Management</h2>
              <p className="text-xs text-slate-400">Upload images, categorize, and update descriptions.</p>
            </div>
            <button
              onClick={() => {
                setEditingGallery(null);
                setGalleryForm({
                  title: '',
                  category: 'My Work',
                  imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
                  description: '',
                  date: '2026',
                  tags: ['Artifact', 'Showcase'],
                });
                setIsAddingGallery(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gallery Image</span>
            </button>
          </div>

          {/* Add / Edit Gallery Modal */}
          {(isAddingGallery || editingGallery) && (
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {editingGallery ? 'Edit Gallery Item' : 'Add Image to Gallery'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingGallery(false);
                    setEditingGallery(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Image Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={galleryForm.title}
                      onChange={(e) =>
                        setGalleryForm({ ...galleryForm, title: e.target.value })
                      }
                      placeholder="e.g. Modern Developer Setup"
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) =>
                        setGalleryForm({ ...galleryForm, category: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="My Work">My Work</option>
                      <option value="Websites">Websites</option>
                      <option value="Designs">Designs</option>
                      <option value="Videos">Videos</option>
                      <option value="Certificates">Certificates</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Video URL (Google Drive, YouTube, Vimeo, or .MP4)
                  </label>
                  <input
                    type="url"
                    value={galleryForm.videoUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const driveId = extractGoogleDriveId(val);
                      setGalleryForm((prev) => ({
                        ...prev,
                        videoUrl: val,
                        category: val.trim() ? 'Videos' : prev.category,
                        imageUrl:
                          driveId && (!prev.imageUrl || prev.imageUrl.includes('unsplash'))
                            ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`
                            : prev.imageUrl,
                      }));
                    }}
                    placeholder="https://drive.google.com/file/d/... or YouTube / Vimeo / MP4"
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports Google Drive sharing links, YouTube, Vimeo, or direct MP4 files. Will play seamlessly with interactive controls.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Image / Poster URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={galleryForm.imageUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      const driveId = extractGoogleDriveId(val);
                      if (driveId) {
                        setGalleryForm((prev) => ({
                          ...prev,
                          videoUrl: prev.videoUrl || val,
                          category: 'Videos',
                          imageUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
                        }));
                      } else {
                        setGalleryForm((prev) => ({ ...prev, imageUrl: val }));
                      }
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cover image or poster frame. If pasting a Google Drive link, the video will be auto-detected.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={galleryForm.description}
                    onChange={(e) =>
                      setGalleryForm({ ...galleryForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingGallery(false);
                      setEditingGallery(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer hover:shadow-cyan-500/20 transition-all"
                  >
                    {editingGallery ? 'Update Item' : 'Save Media Item'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Gallery Items Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-slate-300 shadow-md">
              <div className="flex items-center gap-2.5">
                <ArrowUpDown className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Rearrange Gallery Artifacts:</strong> Click <strong>← (Move Earlier)</strong> or <strong>→ (Move Later)</strong>, or <strong>drag cards</strong> to change their visual placement.
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 px-2.5 py-1 rounded-lg bg-blue-900/50 border border-blue-700/50 shrink-0 self-start sm:self-auto">
                {galleryItems.length} Total Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryItems.map((g, idx) => {
                const media = resolveGalleryMedia(g);
                return (
                  <div
                    key={g.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedGalleryIndex(idx);
                      e.dataTransfer.setData('text/plain', String(idx));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedGalleryIndex !== null && draggedGalleryIndex !== idx) {
                        reorderGalleryItems(draggedGalleryIndex, idx);
                      }
                      setDraggedGalleryIndex(null);
                    }}
                    onDragEnd={() => setDraggedGalleryIndex(null)}
                    className={`p-3 rounded-xl bg-[#080d1a] border border-blue-900/30 hover:border-cyan-400/50 space-y-2.5 group transition-all relative ${
                      draggedGalleryIndex === idx ? 'opacity-40 border-cyan-400' : ''
                    }`}
                  >
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-950">
                      <img
                        src={media.posterUrl}
                        alt={g.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const isTea = g.title.toLowerCase().includes('tea') || g.category === 'Videos';
                          (e.target as HTMLImageElement).src = isTea
                            ? 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80'
                            : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-cyan-300 flex items-center gap-1 shadow-md">
                        {media.isVideo ? (
                          <Film className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-blue-400" />
                        )}
                        <span>{g.category}</span>
                      </div>

                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-black/80 text-cyan-300 border border-blue-500/40 shadow-md">
                        #{idx + 1}
                      </div>

                      {media.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-full bg-blue-600/80 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-4 h-4 ml-0.5 fill-white text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs line-clamp-1">{g.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{g.description}</p>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800">
                      {/* Position swap buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveGalleryItem(g.id, 'left')}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Move Earlier (Left)"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-cyan-400 transition-colors p-0.5"
                          title="Drag card to reorder"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryItem(g.id, 'right')}
                          disabled={idx === galleryItems.length - 1}
                          className="p-1 rounded bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Move Later (Right)"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit & Delete actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEditGallery(g)}
                          className="p-1 rounded bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white text-xs cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteDialog({
                              title: 'Delete Media Item',
                              description: `Are you sure you want to delete "${g.title}"?`,
                              onConfirm: () => deleteGalleryItem(g.id),
                            });
                          }}
                          className="p-1 rounded bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white text-xs cursor-pointer transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          TAB 3: CONTACT SUBMISSIONS MANAGEMENT
         ==================================== */}
      {adminTab === 'contacts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Client Inquiry Submissions</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600/20 text-cyan-300 border border-blue-500/30">
                  {contactSubmissions.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Read customer requests, mark read/unread status, delete inquiries, or reply directly.
              </p>
            </div>
            {contactSubmissions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setDeleteDialog({
                    title: 'Clear All Inquiries',
                    description: 'Are you sure you want to permanently delete all inquiries? This action cannot be undone.',
                    onConfirm: () => {
                      clearAllContactSubmissions();
                      setSelectedSubmissionId(null);
                    },
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 hover:text-rose-100 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Inquiries</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-6 space-y-3">
              {contactSubmissions.length === 0 ? (
                <div className="p-10 text-center rounded-2xl bg-[#080d1a] border border-blue-900/30 text-slate-400 text-xs">
                  No inquiries found. All inquiries have been cleared or deleted.
                </div>
              ) : (
                contactSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmissionId(sub.id);
                      if (!sub.read) markContactRead(sub.id, true);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedSubmissionId === sub.id
                        ? 'bg-blue-950/70 border-cyan-400 shadow-md'
                        : sub.read
                        ? 'bg-[#080d1a] border-slate-800 hover:border-slate-700'
                        : 'bg-slate-900 border-blue-500/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!sub.read && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                        )}
                        <span className="font-bold text-sm text-white">{sub.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialog({
                              title: 'Delete Inquiry',
                              description: `Permanently delete the inquiry from "${sub.fullName}"?`,
                              onConfirm: () => {
                                deleteContactSubmission(sub.id);
                                if (selectedSubmissionId === sub.id) {
                                  setSelectedSubmissionId(null);
                                }
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          title="Delete this inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600/20 text-cyan-300">
                        {sub.serviceRequired}
                      </span>
                      <span className="text-xs text-slate-400">{sub.projectBudget}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {sub.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Selected Inquiry Detail Inspector */}
            <div className="lg:col-span-6">
              {selectedSubmissionId ? (
                (() => {
                  const sub = contactSubmissions.find((c) => c.id === selectedSubmissionId);
                  if (!sub) return null;
                  return (
                    <div className="p-6 rounded-2xl bg-[#080d1a] border border-blue-900/50 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{sub.fullName}</h3>
                          <div className="text-xs text-slate-400">{sub.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => markContactRead(sub.id, !sub.read)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {sub.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteDialog({
                                title: 'Delete Inquiry',
                                description: `Permanently delete the inquiry from "${sub.fullName}"?`,
                                onConfirm: () => {
                                  deleteContactSubmission(sub.id);
                                  setSelectedSubmissionId(null);
                                },
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-slate-400 text-[10px]">Service Requested</div>
                          <div className="font-bold text-cyan-300">{sub.serviceRequired}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-slate-400 text-[10px]">Estimated Budget</div>
                          <div className="font-bold text-white">{sub.projectBudget}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-slate-400 text-[10px]">Phone Number</div>
                          <div className="font-bold text-slate-200">{sub.phone}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-slate-400 text-[10px]">Timeline / Details</div>
                          <div className="font-bold text-slate-200">{sub.projectDetails}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-slate-400 mb-1">Message</div>
                        <div className="p-4 rounded-xl bg-[#050811] border border-blue-950 text-xs text-slate-200 leading-relaxed">
                          {sub.message}
                        </div>
                      </div>

                      {/* Direct Reply Actions */}
                      <div className="pt-2 flex flex-wrap gap-3">
                        <a
                          href={`mailto:${sub.email}?subject=Regarding your inquiry: ${sub.serviceRequired}`}
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-2"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                        {sub.phone && (
                          <a
                            href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Client</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-12 text-center rounded-2xl bg-[#080d1a] border border-blue-900/30 text-slate-400 text-xs">
                  Select a message from the list to view full details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          TAB 4: HISTORY MANAGEMENT
         ==================================== */}
      {adminTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Journey History Timeline</h2>
              <p className="text-xs text-slate-400">Add or revise milestones on the journey page.</p>
            </div>
            <button
              onClick={() => {
                setEditingTimeline(null);
                setTimelineForm({
                  year: '2026',
                  title: '',
                  description: '',
                  achievement: '',
                  badge: 'Milestone',
                  imageUrl: '',
                });
                setIsAddingTimeline(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Timeline Milestone</span>
            </button>
          </div>

          {(isAddingTimeline || editingTimeline) && (
            <div className="p-6 rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {editingTimeline ? 'Edit Milestone' : 'Add Milestone'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingTimeline(false);
                    setEditingTimeline(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTimeline} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Year / Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={timelineForm.year}
                      onChange={(e) =>
                        setTimelineForm({ ...timelineForm, year: e.target.value })
                      }
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Milestone Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={timelineForm.title}
                      onChange={(e) =>
                        setTimelineForm({ ...timelineForm, title: e.target.value })
                      }
                      placeholder="e.g. AI-Powered Applications & Full Stack Systems"
                      className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={timelineForm.description}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Key Achievement
                  </label>
                  <input
                    type="text"
                    value={timelineForm.achievement}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, achievement: e.target.value })
                    }
                    placeholder="Key result or milestone outcome"
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTimeline(false);
                      setEditingTimeline(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Timeline Table */}
          <div className="rounded-2xl bg-[#080d1a] border border-blue-900/40 divide-y divide-slate-800">
            {timelineItems.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{t.year}</span>
                    <span className="font-bold text-white text-sm">{t.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEditTimeline(t)}
                    className="p-1.5 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteDialog({
                        title: 'Delete Milestone',
                        description: `Are you sure you want to delete milestone "${t.title}"?`,
                        onConfirm: () => deleteTimelineItem(t.id),
                      });
                    }}
                    className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================
          TAB 5: ABOUT & SKILLS MANAGEMENT
         ==================================== */}
      {adminTab === 'about' && (
        <div className="space-y-8">
          {/* Site Bio and Profile Info */}
          <div className="p-6 rounded-2xl bg-[#080d1a] border border-blue-900/40 space-y-4">
            <h2 className="text-lg font-bold text-white">General Information & Contact Channels</h2>
            <form onSubmit={handleSaveAbout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={aboutForm.name}
                    onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={aboutForm.email}
                    onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={aboutForm.phone}
                    onChange={(e) => setAboutForm({ ...aboutForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={aboutForm.whatsapp}
                    onChange={(e) => setAboutForm({ ...aboutForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs"
                  />
                </div>
              </div>

              {/* Counter Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#050811]/70 border border-blue-900/30">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Websites Created</label>
                  <input
                    type="text"
                    value={aboutForm.websitesCreated || '10+'}
                    onChange={(e) => setAboutForm({ ...aboutForm, websitesCreated: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d1a] border border-blue-900/50 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Projects Completed</label>
                  <input
                    type="text"
                    value={aboutForm.projectsCompleted || '10+'}
                    onChange={(e) => setAboutForm({ ...aboutForm, projectsCompleted: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d1a] border border-blue-900/50 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Happy Clients</label>
                  <input
                    type="text"
                    value={aboutForm.happyClients || '10+'}
                    onChange={(e) => setAboutForm({ ...aboutForm, happyClients: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d1a] border border-blue-900/50 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Years</label>
                  <input
                    type="text"
                    value={aboutForm.experienceYears || '2+'}
                    onChange={(e) => setAboutForm({ ...aboutForm, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d1a] border border-blue-900/50 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Introduction</label>
                <textarea
                  rows={2}
                  value={aboutForm.heroIntro}
                  onChange={(e) => setAboutForm({ ...aboutForm, heroIntro: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md"
                >
                  Save General Information
                </button>
              </div>
            </form>
          </div>

          {/* Skills Management */}
          <div className="p-6 rounded-2xl bg-[#080d1a] border border-blue-900/40 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Skills & Competencies</h2>
              <p className="text-xs text-slate-400">Add or delete skills displayed on the About page.</p>
            </div>

            {/* Add New Skill Form */}
            <form onSubmit={handleAddSkill} className="flex flex-wrap items-end gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[11px] text-slate-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Next.js"
                  className="w-full px-3 py-2 rounded-lg bg-[#050811] border border-blue-900/50 text-white text-xs"
                />
              </div>

              <div className="w-32">
                <label className="block text-[11px] text-slate-400 mb-1">Proficiency %</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#050811] border border-blue-900/50 text-white text-xs"
                />
              </div>

              <div className="w-40">
                <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#050811] border border-blue-900/50 text-white text-xs"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Design & UX">Design & UX</option>
                  <option value="Content & Video">Content & Video</option>
                  <option value="AI & Tools">AI & Tools</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </form>

            {/* Existing Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{skill.name}</div>
                    <div className="text-[10px] text-cyan-400">{skill.level}% • {skill.category}</div>
                  </div>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Universal In-App Deletion Confirmation Modal (Reliable in iFrame) */}
      <AnimatePresence>
        {deleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-[#0a0f1d] border border-rose-900/60 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{deleteDialog.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{deleteDialog.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setDeleteDialog(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const action = deleteDialog.onConfirm;
                    setDeleteDialog(null);
                    action();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Permanently Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
