import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code2, Terminal, Sparkles, Cpu, Layers, CheckCircle2 } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app' | 'style' | 'api'>('app');
  const [typingIndex, setTypingIndex] = useState(0);

  const codeSnippets = {
    app: `// Developer Portfolio - M Abdullah Azam
import { createModernApp } from '@portfolio/core';

export const DeveloperProfile = () => {
  const dev = useDeveloper('M Abdullah Azam');
  
  return (
    <Experience
      role="Web Developer | Video & Digital Creator"
      performance="100% Responsive & Fast"
      aiPowered={true}
      cleanArchitecture={true}
    />
  );
};`,
    style: `/* Modern Cyber Aesthetic */
.portfolio-canvas {
  background: radial-gradient(#070b14, #030712);
  border-accent: #3b82f6; /* Electric Blue */
  ambient-glow: rgba(59, 130, 246, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`,
    api: `// Project Service Dispatcher
const response = await fetch('/api/projects', {
  method: 'POST',
  body: JSON.stringify({
    client: 'Your Brand',
    service: 'Full-Stack Web App',
    status: 'Ready To Build'
  })
});`,
  };

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Cinematic ambient aura & neon backlights */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-600/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/40 via-blue-900/30 to-purple-600/40 shadow-2xl shadow-blue-950/80">
        <div className="rounded-2xl bg-[#080d1a]/95 backdrop-blur-xl overflow-hidden border border-blue-900/30">
          {/* Top developer window header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0c1324] border-b border-blue-900/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-['JetBrains_Mono',monospace] text-slate-400">
                m-abdullah-azam.tsx
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-md border border-blue-900/40 text-[11px] font-mono text-cyan-400">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE SYSTEM</span>
            </div>
          </div>

          {/* Workspace Visual Hero Image with Blue Cinematic Environment */}
          <div className="relative h-48 sm:h-56 w-full overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
              alt="Developer workspace in cinematic blue lighting"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/50 to-blue-900/20" />
            <div className="absolute inset-0 bg-blue-950/30 mix-blend-color" />

            {/* Overlaid Developer Badge */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-xl shadow-lg">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Full-Stack & Digital Studio
                </span>
              </div>
              <div className="text-[11px] font-mono text-blue-300 bg-blue-950/80 border border-blue-800/40 px-2 py-1 rounded-lg">
                60 FPS UI
              </div>
            </div>
          </div>

          {/* Code Tabs & Interactive Display */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 border-b border-blue-900/30 pb-2">
              <button
                onClick={() => setActiveTab('app')}
                className={`text-xs font-['JetBrains_Mono',monospace] px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'app'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                App.tsx
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`text-xs font-['JetBrains_Mono',monospace] px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'style'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                theme.css
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`text-xs font-['JetBrains_Mono',monospace] px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'api'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                dispatch.ts
              </button>
            </div>

            {/* Code Body */}
            <div className="bg-[#050811] rounded-xl p-3.5 border border-blue-950/80 font-['JetBrains_Mono',monospace] text-[12px] leading-relaxed text-slate-300 overflow-x-auto">
              <pre className="text-slate-300 whitespace-pre">
                <code>{codeSnippets[activeTab]}</code>
              </pre>
            </div>

            {/* Floating feature pills underneath */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
              <div className="bg-slate-900/80 border border-blue-900/40 p-2.5 rounded-xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Architecture</div>
                  <div className="text-xs font-semibold text-slate-200">Modern</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-blue-900/40 p-2.5 rounded-xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Speed & UX</div>
                  <div className="text-xs font-semibold text-slate-200">Optimized</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-blue-900/40 p-2.5 rounded-xl flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Quality</div>
                  <div className="text-xs font-semibold text-slate-200">Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
