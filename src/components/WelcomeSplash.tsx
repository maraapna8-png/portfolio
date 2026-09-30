import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Code2, Film, Camera } from 'lucide-react';

interface WelcomeSplashProps {
  onEnter: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Smooth progress loading bar (completes in ~2.5 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 75 ? 3 : 5;
        return Math.min(prev + increment, 100);
      });
    }, 75);

    return () => clearInterval(interval);
  }, []);

  const triggerEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 500);
  };

  // Compulsory: Auto enter only once 100% is reached
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        triggerEnter();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040711] text-white overflow-hidden select-none pointer-events-auto"
    >
      {/* Background Animated Tech Grid & Ambient Nebula Glow */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

      {/* Center Hero Logo Presentation */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Pulsating Orbital Rings */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer Rotating Energy Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-5 rounded-full border border-dashed border-cyan-400/30 pointer-events-none"
          />

          {/* Secondary Counter-rotating Accent Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-10 rounded-full border border-blue-500/20 pointer-events-none"
          />

          {/* Glowing Aura Behind Logo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/40 via-blue-600/30 to-indigo-600/40 blur-2xl animate-pulse" />

          {/* Main Circular Brand Emblem */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_55px_rgba(6,182,212,0.5)]"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#060a14] relative">
              <img
                src="/assets/logo.png"
                alt="M Abdullah Azam Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-cyan-300/30 pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* Identity & Subtitle Typography */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-cyan-500/30 text-[11px] font-semibold tracking-wider text-cyan-300 uppercase shadow-inner">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Official Portfolio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 tracking-tight">
            M Abdullah Azam
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-300 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-cyan-400">Web Developer</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400">Video Creator</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-300">Digital Creator</span>
          </p>

          <div className="flex items-center justify-center gap-4 pt-1 text-slate-400 text-xs">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Web Code
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Film className="w-3.5 h-3.5 text-blue-400" /> 4K Video
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Camera className="w-3.5 h-3.5 text-indigo-400" /> Digital Media
            </span>
          </div>
        </motion.div>

        {/* Progress Bar & Status (Compulsory loading to 100%) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-xs space-y-2"
        >
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              {progress < 100 ? 'Entering Experience...' : 'Welcome to the Portfolio'}
            </span>
            <span className="text-cyan-300 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-blue-900/40 overflow-hidden p-[1px]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Footer Branding Note */}
      <div className="absolute bottom-6 text-center text-[11px] text-slate-500 tracking-wide font-mono">
        M ABDULLAH AZAM • DIGITAL PORTFOLIO
      </div>
    </motion.div>
  );
};

