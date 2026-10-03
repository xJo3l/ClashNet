import React, { useState } from 'react';
import { Calendar, Users, Trophy, Flame, ChevronRight } from 'lucide-react';

export const Events: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const events = [
    {
      id: 1,
      title: 'TH17 Blood Moon Championship',
      prize: '$5,000 USD',
      teams: '64 / 64 Teams',
      date: 'Oct 12 - Oct 15, 2026',
      status: 'live',
      tag: 'Official Community Cup',
      imageBg: 'from-rose-950/40 to-orange-950/30'
    },
    {
      id: 2,
      title: 'Clan War League Showdown',
      prize: '50,000 Gems + Trophy',
      teams: '112 / 128 Teams',
      date: 'Oct 20 - Oct 25, 2026',
      status: 'upcoming',
      tag: '5v5 Competitive',
      imageBg: 'from-indigo-950/40 to-purple-950/30'
    },
    {
      id: 3,
      title: 'Builder Base 2.0 Blitz',
      prize: '$1,500 USD',
      teams: '32 / 32 Players',
      date: 'Nov 02 - Nov 04, 2026',
      status: 'upcoming',
      tag: 'Solo Tournament',
      imageBg: 'from-amber-950/40 to-rose-950/30'
    }
  ];

  const filteredEvents = events.filter(e => filter === 'all' || e.status === filter);

  return (
    <section id="events" className="py-24 relative bg-[#0a0b10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-widest mb-3">
              <Flame className="w-4 h-4" />
              <span>Esports & Tournaments</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Featured <span className="gradient-text">Clash Tournaments</span>
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-xl mt-6 md:mt-0">
            {(['all', 'live', 'upcoming'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(255,71,87,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group relative bg-[#11131c] border border-rose-500/20 rounded-2xl p-6 transition-all duration-300 hover:border-rose-500/50 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(255,71,87,0.15)] flex flex-col justify-between"
            >
              <div>
                {/* Status Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
                    {event.tag}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    event.status === 'live' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {event.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {event.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">
                  {event.title}
                </h3>

                {/* Details */}
                <div className="space-y-2.5 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Prize Pool: <strong className="text-white">{event.prize}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-rose-400" />
                    <span>Slots: <strong className="text-slate-200">{event.teams}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-rose-500 hover:text-white border border-white/10 hover:border-transparent text-slate-200 font-semibold py-3 rounded-xl transition-all group-hover:shadow-[0_0_20px_rgba(255,71,87,0.3)]">
                <span>View Tournament</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
