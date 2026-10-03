import React from 'react';
import { ArrowRight, Swords } from 'lucide-react';

interface HeroProps {
  onExploreEvents?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreEvents }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-white">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-[10%] right-[10%] w-[550px] h-[550px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Hero Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-700 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse-glow" />
            <span>Clash of Clans Community Hub</span>
          </div>

          {/* Heading */}
          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 mb-6">
            UNITE. STRATEGIZE. <br />
            <span className="gradient-text">DOMINATE THE REALM.</span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            The ultimate gathering ground for Chiefs and Clan leaders. Join high-stakes community tournaments, discover verified War & Trophy layouts, explore creator spotlights, and manage your clan wars with pro tools.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-11">
            <a
              href="#events"
              onClick={onExploreEvents}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-semibold px-7 py-3.5 rounded-xl shadow-[0_10px_25px_-5px_rgba(225,29,72,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(225,29,72,0.5)] hover:-translate-y-0.5 transition-all"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#tools"
              className="inline-flex items-center gap-2.5 bg-slate-100 text-slate-800 font-semibold px-7 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-200 hover:border-slate-300 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <Swords className="w-4 h-4 text-rose-600" />
              <span>War Tools</span>
            </a>
          </div>

          {/* Hero Stats */}
          <div className="w-full pt-7 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <div className="font-cinzel text-2xl font-bold text-slate-900">45K+</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Active Clashers</div>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <div className="font-cinzel text-2xl font-bold text-slate-900">1.2K+</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Tournaments</div>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <div className="font-cinzel text-2xl font-bold text-rose-600">TH 17</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Meta Ready</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.15),0_0_25px_rgba(225,29,72,0.1)] hover:shadow-[0_25px_50px_rgba(15,23,42,0.2),0_0_35px_rgba(225,29,72,0.2)] hover:border-rose-400/50 transition-all duration-500">
            <img
              src="/images/hero-coc.png"
              alt="Clash of Clans Blood Moon Battle"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            {/* Floating Tag */}
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2.5 bg-slate-900/90 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-white shadow-lg">
              <span className="bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Live</span>
              <span>Blood Moon Season</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
