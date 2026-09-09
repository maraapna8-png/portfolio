import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GalleryPage } from './pages/GalleryPage';
import { HistoryPage } from './pages/HistoryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { ProjectModal } from './components/ProjectModal';
import { GalleryLightbox } from './components/GalleryLightbox';
import { HireMeModal } from './components/HireMeModal';
import { Toast } from './components/Toast';
import { motion, AnimatePresence } from 'motion/react';

const PortfolioContent: React.FC = () => {
  const { activePage } = usePortfolio();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'history':
        return <HistoryPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-['Outfit',sans-serif] relative overflow-x-hidden tech-grid-bg selection:bg-blue-600/30 selection:text-cyan-200">
      {/* Background Ambience & Lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[350px] bg-indigo-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Body with Transitions */}
      <main className="flex-1 w-full relative z-10 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals, Overlays & Notifications */}
      <ProjectModal />
      <GalleryLightbox />
      <HireMeModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
