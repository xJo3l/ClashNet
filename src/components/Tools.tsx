import React from 'react';
import { ShieldCheck, Swords, Calculator, LayoutGrid, Download, Share2 } from 'lucide-react';

export const Tools: React.FC = () => {
  const tools = [
    {
      icon: LayoutGrid,
      title: 'TH17 Base Layout Vault',
      desc: 'Copy verified War, Trophy, and Farming base designs directly into your Clash of Clans app with 1-click links.',
      tag: 'Updated Daily',
      action: 'Browse Base Layouts'
    },
    {
      icon: Calculator,
      title: 'War Army & Upgrade Cost Calculator',
      desc: 'Optimize your Elixir, Dark Elixir, and Ore costs. Calculate upgrade timers and hero equipment progression.',
      tag: 'Meta Calculator',
      action: 'Launch Calculator'
    },
    {
      icon: Swords,
      title: 'Clan War Planning & Roster Board',
      desc: 'Coordinate 30v30 and 50v50 War Leagues. Assign target mirrors, track attack status, and generate war strategy sheets.',
      tag: 'Leader Utility',
      action: 'Open War Planner'
    }
  ];

  return (
    <section id="tools" className="py-24 relative bg-[#0a0b10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Pro Clan Utilities</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              War & Base <span className="gradient-text">Management Tools</span>
            </h2>
          </div>
        </div>

        {/* Tools Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="group bg-[#11131c] border border-rose-500/20 rounded-2xl p-8 transition-all duration-300 hover:border-rose-500/50 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(255,71,87,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                    {t.tag}
                  </span>

                  <h3 className="font-cinzel text-xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
                    {t.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    {t.desc}
                  </p>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-[0_0_20px_rgba(255,71,87,0.4)]">
                  <span>{t.action}</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
