import React from 'react';
import { Project } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Eye, Code, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { openProjectModal } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-blue-900/30 via-slate-800/40 to-blue-950/40 hover:from-blue-500/60 hover:via-cyan-400/40 hover:to-indigo-500/60 transition-all duration-300 shadow-xl hover:shadow-blue-500/15"
    >
      <div className="flex flex-col h-full rounded-2xl bg-[#080d1a]/95 backdrop-blur-xl border border-blue-900/30 overflow-hidden group-hover:border-blue-500/40 transition-colors">
        {/* Project Thumbnail */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent opacity-80" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md border border-blue-500/40 text-cyan-300 shadow-md">
              {project.category}
            </span>
          </div>

          {/* Featured Tag if applicable */}
          {project.featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-md shadow-blue-600/30">
              <Sparkles className="w-3 h-3 text-cyan-200" />
              <span>Featured</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
              {project.title}
            </h3>

            <p className="mt-2.5 text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Badges */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-950/60 border border-blue-800/40 text-blue-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-400">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
            <button
              onClick={() => openProjectModal(project)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-cyan-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all duration-200 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Project</span>
            </button>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all duration-200"
                title="Open Live Website"
              >
                <span>Live Website</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
