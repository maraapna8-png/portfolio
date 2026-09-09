import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Maximize2, Tag, Calendar, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryPage: React.FC = () => {
  const { galleryItems, openGalleryLightbox } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'My Work',
    'Websites',
    'Designs',
    'Videos',
    'Certificates',
    'Other',
  ];

  const filteredItems =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400">
          VISUAL SHOWCASE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Creative Gallery & Artifacts
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          A visual record of design layouts, production milestones, video editing sessions, and certifications.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-[#080d1a]/80 border border-blue-900/40 max-w-3xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`gallery-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            // Find actual index in global galleryItems for the lightbox
            const globalIndex = galleryItems.findIndex((g) => g.id === item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group relative rounded-2xl overflow-hidden bg-[#080d1a] border border-blue-900/40 hover:border-cyan-400/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 cursor-pointer flex flex-col"
                onClick={() => openGalleryLightbox(globalIndex >= 0 ? globalIndex : 0)}
              >
                {/* Image Frame */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent opacity-70" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 text-cyan-300 border border-blue-500/30 shadow-md">
                      {item.category}
                    </span>
                  </div>

                  {/* Fullscreen icon indicator on hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex flex-col justify-between flex-1 bg-[#080d1a]">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-slate-800/60">
                      {item.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#080d1a]/50 border border-blue-900/30 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No images in this category</h3>
          <p className="text-xs text-slate-400">
            Check back soon or select 'All' to view complete gallery.
          </p>
        </div>
      )}
    </div>
  );
};
