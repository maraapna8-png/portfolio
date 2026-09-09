import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ChevronLeft, ChevronRight, Maximize2, Tag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryLightbox: React.FC = () => {
  const { galleryItems, selectedGalleryIndex, closeGalleryLightbox, openGalleryLightbox } =
    usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedGalleryIndex === null) return;
      if (e.key === 'Escape') closeGalleryLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryIndex, galleryItems.length]);

  if (selectedGalleryIndex === null || !galleryItems[selectedGalleryIndex]) return null;

  const currentItem = galleryItems[selectedGalleryIndex];

  const handlePrev = () => {
    if (selectedGalleryIndex > 0) {
      openGalleryLightbox(selectedGalleryIndex - 1);
    } else {
      openGalleryLightbox(galleryItems.length - 1);
    }
  };

  const handleNext = () => {
    if (selectedGalleryIndex < galleryItems.length - 1) {
      openGalleryLightbox(selectedGalleryIndex + 1);
    } else {
      openGalleryLightbox(0);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060f]/90 backdrop-blur-xl p-4 sm:p-6 select-none">
        {/* Close Button */}
        <button
          onClick={closeGalleryLightbox}
          className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-slate-900/80 border border-blue-500/40 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors shadow-xl"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Prev / Next controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/80 border border-blue-500/40 text-slate-200 hover:text-cyan-400 hover:bg-slate-800 flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/80 border border-blue-500/40 text-slate-200 hover:text-cyan-400 hover:bg-slate-800 flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Center Image Container */}
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-[#080d1a] border border-blue-900/50 shadow-2xl shadow-blue-950/80"
        >
          <div className="relative w-full max-h-[65vh] flex items-center justify-center bg-black/60 overflow-hidden">
            <img
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className="max-h-[65vh] max-w-full object-contain filter contrast-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom Information Bar */}
          <div className="w-full p-5 sm:p-6 bg-[#080d1a] border-t border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600/30 text-cyan-300 border border-blue-500/40">
                  {currentItem.category}
                </span>
                {currentItem.date && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {currentItem.date}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400">
                  {selectedGalleryIndex + 1} / {galleryItems.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {currentItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                {currentItem.description}
              </p>
            </div>

            {/* Tags */}
            {currentItem.tags && currentItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {currentItem.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
