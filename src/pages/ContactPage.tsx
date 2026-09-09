import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ContactPage: React.FC = () => {
  const { siteInfo, submitContact, showToast } = usePortfolio();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceRequired, setServiceRequired] = useState('Web Development');
  const [projectBudget, setProjectBudget] = useState('$500 - $1,000');
  const [projectDetails, setProjectDetails] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitContact({
        fullName,
        email,
        phone: phone || 'Not provided',
        serviceRequired,
        projectBudget,
        projectDetails: projectDetails || serviceRequired,
        message,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Inquiry sent successfully!');
    }, 700);
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setProjectDetails('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs font-bold uppercase tracking-widest text-cyan-400">
          GET IN TOUCH
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let's Start a Conversation
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Have an upcoming project, web requirement, video request, or custom digital idea? Send a message and let's bring it to reality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Contact Channels & Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl p-6 sm:p-8 bg-[#080d1a] border border-blue-900/40 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Contact Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Feel free to reach out directly via WhatsApp, phone, or email for instantaneous communication.
            </p>

            <div className="space-y-4">
              {/* WhatsApp Direct Option */}
              <a
                href={`https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20Abdullah%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct WhatsApp Chat</div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-300">
                    {siteInfo.whatsapp}
                  </div>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${siteInfo.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 hover:border-blue-500/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Phone Call</div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300">
                    {siteInfo.phone}
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${siteInfo.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 hover:border-blue-500/60 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Inquiry Email</div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300">
                    {siteInfo.email}
                  </div>
                </div>
              </a>
            </div>

            {/* Availability info */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Response Time: Typically within 1-4 hours</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Client Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-blue-500/40 via-cyan-400/20 to-purple-600/30 shadow-2xl shadow-blue-950/80">
            <div className="rounded-2xl bg-[#080d1a]/95 backdrop-blur-xl p-6 sm:p-8 border border-blue-900/40">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Thank you! Your message has been received.
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
                    I will review your project details and contact you soon.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleSendAnother}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
                    >
                      Send Another Inquiry
                    </button>
                    <a
                      href={`https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Project Inquiry Form
                    </h2>
                    <p className="text-xs text-slate-400">
                      Fill in the details below to receive a custom proposal and quote.
                    </p>
                  </div>

                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-blue-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Required <span className="text-blue-400">*</span>
                      </label>
                      <select
                        value={serviceRequired}
                        onChange={(e) => setServiceRequired(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Business Websites">Business Websites</option>
                        <option value="Portfolio Websites">Portfolio Websites</option>
                        <option value="Video Creation">Video Creation</option>
                        <option value="CV / Resume Creation">CV / Resume Creation</option>
                        <option value="AI-Powered Websites">AI-Powered Websites</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget & Project Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Project Budget
                      </label>
                      <select
                        value={projectBudget}
                        onChange={(e) => setProjectBudget(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        <option value="<$500">&lt; $500</option>
                        <option value="$500 - $1,000">$500 - $1,000</option>
                        <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                        <option value="$3,000+">$3,000+</option>
                        <option value="Custom / Long-term">Custom / Long-term</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Project Details / Timeline
                      </label>
                      <input
                        type="text"
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        placeholder="e.g. Need ready in 2-3 weeks"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Message <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your vision, target audience, specific features, or questions..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#050811] border border-blue-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-bold text-xs shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
