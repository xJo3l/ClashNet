import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08090e] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs">
        
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-rose-500" />
          <span className="font-cinzel font-bold text-white tracking-wider">
            CLASH<span className="text-rose-500">NET</span>
          </span>
          <span>&copy; {new Date().getFullYear()} ClashNet. All rights reserved.</span>
        </div>

        <p className="max-w-md text-center md:text-right text-slate-500 text-[11px] leading-relaxed">
          This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it.
        </p>

      </div>
    </footer>
  );
};
