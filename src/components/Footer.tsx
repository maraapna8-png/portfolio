import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PageTab } from '../types';
import { Mail, Phone, MessageSquare, ArrowUpRight, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, siteInfo } = usePortfolio();

  const handleNav = (tab: PageTab) => {
    setActivePage(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#05080f] border-t border-blue-900/30 text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[1.5px] shadow-md shadow-blue-500/20">
                <div className="w-full h-full bg-[#070b14] rounded-[9px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-sm font-['JetBrains_Mono',monospace]">
                    MA
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {siteInfo.name}
              </span>
            </div>

            <p className="text-sm text-blue-400 font-medium">
              {siteInfo.title}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Crafting premium digital platforms, responsive business websites, and engaging digital media experiences with modern code and design excellence.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for new projects</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              QUICK LINKS
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => handleNav('home')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  About
                </button>
              </li>
              <li>
                <button
                  id="footer-link-projects"
                  onClick={() => handleNav('projects')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Projects
                </button>
              </li>
              <li>
                <button
                  id="footer-link-gallery"
                  onClick={() => handleNav('gallery')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Gallery
                </button>
              </li>
              <li>
                <button
                  id="footer-link-history"
                  onClick={() => handleNav('history')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  History
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => handleNav('contact')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              SERVICES
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Web Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Business Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  Video Creation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  CV Creation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">›</span>
                  AI Websites
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              CONTACT INFO
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${siteInfo.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Phone</div>
                    <span className="font-medium text-xs sm:text-sm">{siteInfo.phone}</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-800/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">WhatsApp</div>
                    <span className="font-medium text-xs sm:text-sm">{siteInfo.whatsapp}</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Email</div>
                    <span className="font-medium text-xs sm:text-sm">{siteInfo.email}</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & admin access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 M Abdullah Azam. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('admin')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Admin Portal</span>
            </button>
            <span>•</span>
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-cyan-400 transition-colors"
            >
              Client Inquiries
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
