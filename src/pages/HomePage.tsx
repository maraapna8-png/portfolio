import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { HeroVisual } from '../components/HeroVisual';
import { StatsSection } from '../components/StatsSection';
import { ProjectCard } from '../components/ProjectCard';
import {
  Code2,
  Building2,
  LayoutGrid,
  Video,
  FileText,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { siteInfo, services, projects, setActivePage, openHireMe } = usePortfolio();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-cyan-400" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-6 h-6 text-cyan-400" />;
      case 'Video':
        return <Video className="w-6 h-6 text-cyan-400" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
      default:
        return <Code2 className="w-6 h-6 text-cyan-400" />;
    }
  };

  const featuredProjects = projects.filter((p) => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24">
      {/* ====================================
          HERO SECTION
         ==================================== */}
      <section className="relative pt-8 sm:pt-14 pb-4 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 sm:space-y-8"
            >
              {/* Small Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 shadow-md shadow-blue-900/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-cyan-300">
                  {siteInfo.greetingBadge || "Hello, I'm"}
                </span>
              </div>

              {/* Large Heading with highlighted Azam */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  M Abdullah{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 drop-shadow-sm">
                    Azam
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-400/90 tracking-tight">
                  {siteInfo.title}
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {siteInfo.heroIntro}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-view-projects-btn"
                  onClick={() => setActivePage('projects')}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
                >
                  <span>View My Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-contact-me-btn"
                  onClick={() => setActivePage('contact')}
                  className="px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-blue-900/60 hover:border-blue-500/50 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Trust Indicators / Badges */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Custom Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Fast Turnaround</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>100% Client Satisfaction</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Visual (Developer Workspace in Blue Cinematic Lighting) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================
          STATISTICS SECTION
         ==================================== */}
      <StatsSection />

      {/* ====================================
          SERVICES SECTION ("What I Do")
         ==================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400">
            MY SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What I Do
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            I provide a range of digital services to help you build your online presence and grow your business.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-blue-900/30 via-slate-800/40 to-blue-950/40 hover:from-blue-500/70 hover:via-cyan-400/50 hover:to-indigo-500/70 transition-all duration-300 shadow-lg hover:shadow-blue-500/15"
            >
              <div className="h-full rounded-2xl bg-[#080d1a]/95 backdrop-blur-xl p-6 sm:p-7 border border-blue-900/30 group-hover:border-blue-500/40 transition-colors flex flex-col justify-between">
                <div>
                  {/* Service Icon with Glow */}
                  <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-slate-900 border border-blue-900/50 group-hover:border-cyan-400/60 group-hover:scale-105 transition-all duration-300 shadow-md">
                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/25 rounded-xl transition-colors" />
                    {getServiceIcon(service.iconName)}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mt-5 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features list */}
                  {service.features && service.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5 pt-3 border-t border-slate-800/80">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-3">
                  <button
                    onClick={() => setActivePage('about')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====================================
          FEATURED PROJECTS SECTION
         ==================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400">
              FEATURED PROJECTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Latest Projects
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Here are some of my recent projects. I create modern, functional and visually appealing websites.
            </p>
          </div>

          <button
            id="view-all-projects-top-btn"
            onClick={() => setActivePage('projects')}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-blue-800/50 hover:border-cyan-400/60 text-cyan-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 group shadow-sm"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Bottom "View All Projects" Button */}
        <div className="mt-12 text-center">
          <button
            id="view-all-projects-bottom-btn"
            onClick={() => setActivePage('projects')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2.5"
          >
            <span>Explore All Projects & Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ====================================
          CALL TO ACTION SECTION
         ==================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-400 shadow-2xl shadow-blue-950/60 overflow-hidden">
          <div className="relative rounded-[23px] bg-gradient-to-br from-[#080d1a] via-[#0d152a] to-[#0a1024] p-8 sm:p-14 text-center overflow-hidden">
            {/* Ambient Lighting FX */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Let's collaborate on your next vision</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Have a project in mind?
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                I'm always open to new opportunities. Let's turn your ideas into reality with modern code, responsive design, and striking visuals.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="cta-contact-btn"
                  onClick={() => setActivePage('contact')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Contact Me</span>
                </button>

                <button
                  id="cta-hire-me-btn"
                  onClick={openHireMe}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-blue-800/60 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Hire Me Directly</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
