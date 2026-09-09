import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Bell } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = usePortfolio();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-slate-100 shadow-2xl shadow-blue-950/90 backdrop-blur-xl"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-cyan-300 flex items-center justify-center shrink-0 border border-blue-500/40">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-100">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
