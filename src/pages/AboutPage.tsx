import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Sparkles,
  Download,
  CheckCircle2,
  Code2,
  Video,
  Send,
  Briefcase,
  Target,
  Cpu,
  Layers,
  Palette,
  FileCheck,
  Smartphone,
  Globe,
  Layout,
  Atom,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  const { siteInfo, skills, setActivePage, openHireMe, showToast } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Design & UX', 'Content & Video', 'AI & Tools'];

  // Filter skills excluding HTML, CSS, JavaScript
  const availableSkills = skills.filter(
    (s) => s.name !== 'HTML' && s.name !== 'CSS' && s.name !== 'JavaScript'
  );

  const filteredSkills =
    activeCategory === 'All'
      ? availableSkills
      : availableSkills.filter((s) => s.category === activeCategory);

  const getSkillIcon = (name: string) => {
    switch (name) {
      case 'React':
      case 'Atom':
        return <Atom className="w-5 h-5 text-cyan-400" />;
      case 'Responsive Web Design':
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'UI/UX':
      case 'Layout':
        return <Layout className="w-5 h-5 text-purple-400" />;
      case 'Website Development':
      case 'Globe':
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'Video Creation':
      case 'Video':
        return <Video className="w-5 h-5 text-rose-400" />;
      case 'AI Tools':
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'CV / Resume Design':
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-teal-400" />;
      case 'Tailwind CSS':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'TypeScript':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleDownloadCV = () => {
    // Generate a clean text / PDF printable resume view or download trigger
    showToast('Preparing M Abdullah Azam CV download...');
    const cvContent = `
===================================================
M ABDULLAH AZAM - CURRICULUM VITAE
Web Developer | Video Creator | Digital Creator
===================================================
Email: ${siteInfo.email}
Phone: ${siteInfo.phone}
WhatsApp: ${siteInfo.whatsapp}

PROFESSIONAL SUMMARY
${siteInfo.whoIAm}

CORE SKILLS
- Frontend: React, Tailwind CSS, TypeScript, Web Development
- Design & UX: Responsive Web Design, UI/UX Wireframing, ATS CV/Resume Design
- Digital Media: Video Creation, Motion Editing, Promo Media
- Intelligent Tools: AI Integrations, Workflow Automation

SERVICES
- Web Development & Responsive Web Applications
- Business & Corporate Websites
- Modern Portfolio Websites
- Video Creation & Post-Production
- Executive CV / Resume Creation
- AI-Powered Web Platforms

EXPERIENCE & DELIVERIES
- 25+ Websites Created
- 25+ Completed Projects
- 23+ Satisfied Clients
- 2+ Years of Active Hands-on Engineering
===================================================
    `.trim();

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `M_Abdullah_Azam_CV.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('CV downloaded successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 sm:space-y-24">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400">
          ABOUT ME
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Crafting Digital Experiences That Inspire
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Get to know my journey, core technical proficiencies, vision, and how I bring ideas to life.
        </p>
      </div>

      {/* Profile & Bio Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Profile Image / Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/50 via-cyan-400/30 to-purple-600/50 shadow-2xl shadow-blue-950/80">
            <div className="rounded-2xl bg-[#080d1a] overflow-hidden border border-blue-900/40">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1534972195531-a756b1126975?auto=format&fit=crop&w=1000&q=80"
                  alt="M Abdullah Azam - Professional Profile"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-blue-900/10" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">M Abdullah Azam</div>
                      <div className="text-[11px] text-cyan-400 font-medium">
                        Web Developer & Creator
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Open for Work
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Footer on image card */}
              <div className="p-4 grid grid-cols-3 gap-2 text-center bg-[#060a14] border-t border-slate-800">
                <div>
                  <div className="text-base font-bold text-cyan-400 font-mono">
                    {siteInfo.experienceYears}
                  </div>
                  <div className="text-[10px] text-slate-400">Experience</div>
                </div>
                <div>
                  <div className="text-base font-bold text-blue-400 font-mono">
                    {siteInfo.websitesCreated}
                  </div>
                  <div className="text-[10px] text-slate-400">Websites</div>
                </div>
                <div>
                  <div className="text-base font-bold text-purple-400 font-mono">
                    {siteInfo.happyClients}
                  </div>
                  <div className="text-[10px] text-slate-400">Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Text & Who I Am */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Who I Am
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {siteInfo.whoIAm}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {siteInfo.bio}
            </p>
          </div>

          {/* Quick Experience Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-blue-900/40 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                <Code2 className="w-4 h-4" />
                <span>Frontend Specialization</span>
              </div>
              <p className="text-xs text-slate-300">
                Crafting reactive, mobile-first, and WCAG-compliant web layouts with React, Tailwind, and TypeScript.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-blue-900/40 space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                <Video className="w-4 h-4" />
                <span>Digital Media & Video</span>
              </div>
              <p className="text-xs text-slate-300">
                Producing captivating video reels, tech explainers, and ATS-optimized executive resumes.
              </p>
            </div>
          </div>

          {/* Buttons: Download CV & Hire Me */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              id="download-cv-btn"
              onClick={handleDownloadCV}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CV / Resume</span>
            </button>

            <button
              id="about-hire-me-btn"
              onClick={openHireMe}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs border border-blue-900/60 hover:border-cyan-400 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Hire Me</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================
          MY SKILLS SECTION
         ==================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              TECHNICAL EXPERTISE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Proficiencies across web application engineering, visual design, digital media, and AI tools.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-blue-900/40">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#080d1a]/95 border border-blue-900/30 hover:border-cyan-400/50 transition-all duration-300 shadow-md group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-blue-900/40 group-hover:scale-110 transition-transform">
                    {getSkillIcon(skill.name)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {skill.level}%
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500"
                />
              </div>

              {skill.experienceYears && (
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Experience</span>
                  <span className="font-semibold text-slate-300">{skill.experienceYears}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====================================
          MY GOALS & EXPERIENCE SECTION
         ==================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* My Experience */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#080d1a]/95 border border-blue-900/40 space-y-4">
          <div className="flex items-center gap-3 text-cyan-400">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              My Experience
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            With 2+ years of hands-on experience, I have delivered commercial web solutions ranging from high-converting brand showcases for tea companies and medical clinics to interactive SaaS platforms and automated AI tools.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Full lifecycle web development: wireframing, architecture, coding & deployment.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Multimedia production & video editing for brands and content creators.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Integration of AI models for smart workflow acceleration.</span>
            </li>
          </ul>
        </div>

        {/* My Goals */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#080d1a]/95 border border-blue-900/40 space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              My Goals & Vision
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {siteInfo.myGoals}
          </p>
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40">
            <div className="text-xs font-semibold text-cyan-300">Core Mission</div>
            <p className="text-xs text-slate-300 mt-1">
              "To empower brands and entrepreneurs with cutting-edge digital footprints that turn traffic into lasting relationships."
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Action CTA */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-blue-950/80 border border-blue-900/50">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Interested in working together?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Let's discuss how my skills and expertise can bring your project to life.
        </p>
        <button
          onClick={() => setActivePage('contact')}
          className="mt-5 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer inline-flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Get in Touch</span>
        </button>
      </div>
    </div>
  );
};
