import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PageTab } from '../types';
import { Menu, X, Sparkles, Shield, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, openHireMe, siteInfo } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'history', label: 'History' },
    { id: 'contact', label: 'Contact' },
    { id: 'admin', label: 'Admin' },
  ];

  const handleNavClick = (page: PageTab) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-900/30 bg-[#070b14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: MA Logo & Name */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left transition-transform duration-200 active:scale-95"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 tracking-wider text-lg font-['JetBrains_Mono',monospace]">
                MA
              </span>
            </div>
            <div className="absolute -inset-0.5 bg-blue-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300 -z-10" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              {siteInfo.name}
            </span>
            <span className="text-[11px] font-medium text-slate-400 tracking-wide">
              Portfolio
            </span>
          </div>
        </button>

        {/* Center/Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-blue-900/40 px-3 py-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full -z-10 shadow-md shadow-blue-500/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Hire Me Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            id="nav-hire-me-btn"
            onClick={openHireMe}
            className="relative group px-6 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 active:scale-95 cursor-pointer shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] group-hover:animate-pulse" />
            <div className="relative flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Hire Me</span>
            </div>
          </button>
        </div>

        {/* Mobile Hamburger Toggle & Quick Hire */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="mobile-hire-me-btn"
            onClick={openHireMe}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-md shadow-blue-600/30"
          >
            Hire Me
          </button>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-blue-900/50 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-b border-blue-900/40 bg-[#070b14]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2"
          >
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3">
              <button
                id="mobile-drawer-hire-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openHireMe();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Hire Me for Projects</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
