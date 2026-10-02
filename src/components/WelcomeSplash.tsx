import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface WelcomeSplashProps {
  onEnter: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Show the logo presentation for ~2.5 seconds, then smoothly reveal the website
    const timer = setTimeout(() => {
      setIsEntering(true);
      setTimeout(() => {
        onEnter();
      }, 550);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onEnter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040711] text-white overflow-hidden select-none pointer-events-auto"
    >
      {/* Background Animated Tech Grid & Ambient Nebula Glow */}
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />

      {/* Center Logo Presentation - ONLY THE LOGO */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Pulsating Orbital Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Energy Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 rounded-full border border-dashed border-cyan-400/35 pointer-events-none"
          />

          {/* Secondary Counter-rotating Accent Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-12 rounded-full border border-blue-500/25 pointer-events-none"
          />

          {/* Glowing Aura Behind Logo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/40 via-blue-600/35 to-indigo-600/45 blur-3xl animate-pulse" />

          {/* Main Circular Brand Emblem */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.02, 1], opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full p-1.5 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_70px_rgba(6,182,212,0.55)]"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#060a14] relative">
              <img
                src="/assets/logo.png"
                alt="M Abdullah Azam Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-cyan-300/40 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
