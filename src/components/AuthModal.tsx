import React, { useState } from 'react';
import { X, Shield, KeyRound, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [playerTag, setPlayerTag] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Welcome Chief! Logged in with player tag: ${playerTag || '#P8YV028R'}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-md bg-[#11131c] border border-rose-500/40 rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(255,71,87,0.25)] animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              Join <span className="gradient-text">ClashNet</span>
            </h2>
            <p className="text-xs text-slate-400">Connect with thousands of Chiefs & Clan Leaders</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Player Tag or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                placeholder="#P8YV028R or chief@clash.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <UserCheck className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(255,71,87,0.5)] transition-all mt-4"
          >
            Enter the Realm
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <a href="#" className="text-rose-400 font-semibold hover:underline">
            Sign Up Now
          </a>
        </p>

      </div>
    </div>
  );
};
