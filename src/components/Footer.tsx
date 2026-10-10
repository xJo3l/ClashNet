import React from 'react';
import { Heart, MessageSquare, Youtube, Twitter, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#090a0f] text-slate-300 font-outfit border-t border-white/10 overflow-hidden z-30 selection:bg-rose-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 md:pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          
          {/* Brand Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-6 group cursor-pointer inline-flex" onClick={scrollToTop}>
                <img
                  src="/images/logo.webp"
                  alt="ClashNet Logo"
                  className="h-10 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)] transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-montserrat font-bold text-xl tracking-[0.22em] uppercase text-white">
                  clashnet
                </span>
              </div>
              <p className="font-outfit text-sm text-slate-400 leading-relaxed max-w-sm mb-8">
                The ultimate competitive home for Clashers. Discover top creators, tournament events, custom base analytics, and tools built for victory.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3">
              {[
                { name: 'Discord', icon: MessageSquare, href: '#' },
                { name: 'YouTube', icon: Youtube, href: '#' },
                { name: 'Twitter', icon: Twitter, href: '#' },
                { name: 'GitHub', icon: Github, href: '#' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/[0.08]"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Explore
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { label: 'Home', href: '#home' },
                { label: 'What\'s New', href: '#whats-new' },
                { label: 'Creators', href: '#creators' },
                { label: 'Events', href: '#events' },
                { label: 'Tools', href: '#tools' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column (3 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Resources
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { label: 'Base Layouts', href: '#' },
                { label: 'Attack Strategies', href: '#' },
                { label: 'War Analytics', href: '#' },
                { label: 'Creator Program', href: '#' },
                { label: 'API & Guides', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ClashNet. All rights reserved.</p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-slate-600 leading-relaxed">
            ClashNet is not affiliated with, endorsed, sponsored, or specifically approved by Supercell, and Supercell is not responsible for it.
          </p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for the Clash community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
