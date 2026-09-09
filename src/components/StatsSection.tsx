import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Globe, FolderGit2, Users, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const StatsSection: React.FC = () => {
  const { siteInfo } = usePortfolio();

  const stats = [
    {
      value: siteInfo.websitesCreated === '12+' ? '25+' : (siteInfo.websitesCreated || '25+'),
      label: 'Websites Created',
      description: 'Production-ready web solutions',
      icon: Globe,
      color: 'from-blue-500 to-cyan-400',
      borderColor: 'group-hover:border-blue-500/50',
      glowColor: 'group-hover:shadow-blue-500/20',
    },
    {
      value: siteInfo.projectsCompleted || '25+',
      label: 'Projects Completed',
      description: 'Web & digital media deliveries',
      icon: FolderGit2,
      color: 'from-cyan-400 to-teal-400',
      borderColor: 'group-hover:border-cyan-500/50',
      glowColor: 'group-hover:shadow-cyan-500/20',
    },
    {
      value: siteInfo.happyClients || '23+',
      label: 'Happy Clients',
      description: 'Businesses & content creators',
      icon: Users,
      color: 'from-indigo-400 to-purple-400',
      borderColor: 'group-hover:border-indigo-500/50',
      glowColor: 'group-hover:shadow-indigo-500/20',
    },
    {
      value: siteInfo.experienceYears || '2+',
      label: 'Years of Experience',
      description: 'Continuous coding & design',
      icon: Award,
      color: 'from-purple-400 to-pink-400',
      borderColor: 'group-hover:border-purple-500/50',
      glowColor: 'group-hover:shadow-purple-500/20',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-purple-600/30 shadow-xl shadow-blue-950/40">
        <div className="rounded-2xl bg-[#080d1a]/95 backdrop-blur-xl p-6 sm:p-8 border border-blue-900/30">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`group pt-4 first:pt-0 lg:pt-0 lg:px-6 first:lg:pl-0 last:lg:pr-0 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-blue-900/40 group-hover:scale-105 transition-all duration-300">
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-25 transition-opacity`} />
                      <Icon className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" />
                    </div>

                    <div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-['JetBrains_Mono',monospace]">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 hidden sm:block">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
