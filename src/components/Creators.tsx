import React from 'react';
import { Video, Tv, ExternalLink, Star } from 'lucide-react';

export const Creators: React.FC = () => {
  const creators = [
    {
      name: 'Chief Pat',
      role: 'Content Creator & Pro Strategist',
      subs: '2.5M Subscribers',
      platform: 'YouTube',
      avatarBg: 'bg-rose-600',
      badge: 'Partnered',
      popular: 'TH17 Hybrid Attack Guide'
    },
    {
      name: 'Judo Sloth',
      role: 'Guide Specialist & Base Reviewer',
      subs: '1.8M Subscribers',
      platform: 'YouTube',
      avatarBg: 'bg-orange-600',
      badge: 'Verified Creator',
      popular: '3-Star Everything Meta'
    },
    {
      name: 'CarbonFin',
      role: 'Esports Caster & Live Streamer',
      subs: '450K Followers',
      platform: 'Twitch',
      avatarBg: 'bg-purple-600',
      badge: 'Live Caster',
      popular: 'War League Breakdown'
    }
  ];

  return (
    <section id="creator" className="py-24 relative bg-[#0d0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-widest mb-3">
            <Star className="w-4 h-4 fill-rose-500" />
            <span>Community Spotlight</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-4">
            Creator <span className="gradient-text">Hub & Guides</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Learn from top Clash of Clans strategists and content creators. Watch exclusive attack breakdowns and base design tutorials.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creators.map((c, i) => (
            <div
              key={i}
              className="bg-[#11131c] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-rose-500/40 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-full ${c.avatarBg} flex items-center justify-center text-white font-cinzel font-bold text-xl shadow-lg`}>
                    {c.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                    {c.badge}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl font-bold text-white mb-1">{c.name}</h3>
                <p className="text-xs text-rose-400 font-medium mb-3">{c.role}</p>
                <p className="text-xs text-slate-400 mb-6 flex items-center gap-2">
                  {c.platform === 'YouTube' ? <Video className="w-4 h-4 text-red-500" /> : <Tv className="w-4 h-4 text-purple-400" />}
                  <span>{c.subs}</span>
                </p>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-6">
                  <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Featured Video</span>
                  <span className="text-xs font-semibold text-slate-200">{c.popular}</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 hover:border-transparent font-semibold py-2.5 rounded-xl transition-all text-xs">
                <span>View Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
