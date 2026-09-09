import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ExternalLink, Github, CheckCircle2, Cpu, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProjectModal: React.FC = () => {
  const { selectedProject, closeProjectModal, openHireMe } = usePortfolio();

  if (!selectedProject) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProjectModal}
          className="fixed inset-0 bg-[#03060f]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl my-8 bg-[#080d1a] border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-950/80 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Image banner */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden shrink-0">
            <img
              src={selectedProject.imageUrl}
              alt={selectedProject.title}
              className="w-full h-full object-cover object-center filter brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={closeProjectModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-blue-500/30 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors shadow-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Category over image */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white shadow-md">
                  {selectedProject.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
                  {selectedProject.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="View Source Code"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-slate-300">
            {/* Project Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Project Overview
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {selectedProject.fullDescription || selectedProject.description}
              </p>
            </div>

            {/* Key Features */}
            {selectedProject.features && selectedProject.features.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                  Key Features & Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-blue-900/40"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200 font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Technologies & Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/70 border border-blue-800/50 text-blue-300 text-xs font-medium"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges & Solution */}
            {(selectedProject.challenges || selectedProject.solution) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {selectedProject.challenges && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                      Technical Challenge
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedProject.challenges}
                    </p>
                  </div>
                )}
                {selectedProject.solution && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                      Engineering Solution
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom CTA Box */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-blue-950/70 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Want a project with similar architecture?
                </h4>
                <p className="text-xs text-slate-400">
                  Let's collaborate to build something tailored to your business needs.
                </p>
              </div>
              <button
                onClick={() => {
                  closeProjectModal();
                  openHireMe();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs whitespace-nowrap shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Discuss This Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
