import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, Award, Sparkles, CheckCircle2, ChevronRight, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

export const HistoryPage: React.FC = () => {
  const { timelineItems, setActivePage } = usePortfolio();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400">
          CAREER EVOLUTION
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          My Journey
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          From first lines of code to building commercial platforms and producing multimedia digital experiences.
        </p>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pt-6 pb-12">
        {/* Central glowing vertical track line */}
        <div className="absolute left-4 sm:left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-cyan-400 to-indigo-600 opacity-40 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />

        <div className="space-y-12 sm:space-y-16">
          {timelineItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-12`}
              >
                {/* Node Center Marker */}
                <div className="absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#080d1a] border-2 border-cyan-400 shadow-lg shadow-cyan-500/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400" />
                </div>

                {/* Content Card (Left or Right depending on alignment) */}
                <div className="ml-12 sm:ml-0 w-full sm:w-1/2">
                  <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-blue-900/40 via-slate-800/50 to-blue-950/40 hover:from-blue-500/50 hover:to-cyan-400/40 transition-all duration-300 shadow-xl group">
                    <div className="rounded-2xl bg-[#080d1a]/95 backdrop-blur-xl p-6 sm:p-7 border border-blue-900/30 group-hover:border-blue-500/40 transition-colors space-y-4">
                      {/* Year badge & Badge tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-cyan-300 text-xs font-mono font-bold">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.year}</span>
                        </div>

                        {item.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Achievement Box */}
                      {item.achievement && (
                        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-2.5">
                          <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div className="text-xs text-blue-200">
                            <span className="font-semibold text-white">Key Milestone: </span>
                            {item.achievement}
                          </div>
                        </div>
                      )}

                      {/* Optional Milestone Image */}
                      {item.imageUrl && (
                        <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-950 mt-3 border border-slate-800">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover filter brightness-90"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Empty spacer for desktop symmetry */}
                <div className="hidden sm:block sm:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Milestone Callout */}
      <div className="text-center p-8 rounded-2xl bg-[#080d1a] border border-blue-900/40 space-y-3">
        <h3 className="text-xl font-bold text-white">
          The Journey Continues in 2026
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Currently expanding into enterprise full-stack solutions and next-generation AI web interfaces.
        </p>
        <button
          onClick={() => setActivePage('contact')}
          className="mt-3 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
        >
          Work With Me on the Next Milestone
        </button>
      </div>
    </div>
  );
};
