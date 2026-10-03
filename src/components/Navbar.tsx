import React, { useState } from 'react';
import { Menu, X, Shield, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'events', label: 'Events', href: '#events' },
    { id: 'creator', label: 'Creator', href: '#creator' },
    { id: 'tools', label: 'Tools', href: '#tools' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0b10]/85 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="#home" 
          className="flex items-center gap-3 text-white group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-9 h-9 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(255,71,87,0.5)] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-108">
            <Shield className="w-8 h-8 text-rose-500 fill-rose-500/20" />
          </div>
          <span className="font-cinzel text-xl font-black tracking-wider">
            CLASH<span className="text-rose-500 drop-shadow-[0_0_12px_rgba(255,71,87,0.6)]">NET</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 text-sm font-medium tracking-wide transition-colors ${
                  activeTab === item.id ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-orange-500 rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500/15 to-orange-500/15 text-white border border-rose-500/40 px-5 py-2 rounded-full text-sm font-semibold hover:from-rose-500 hover:to-orange-500 hover:border-transparent transition-all shadow-[0_0_15px_rgba(255,71,87,0.15)] hover:shadow-[0_0_25px_rgba(255,71,87,0.5)] hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4 text-rose-400 group-hover:text-white" />
            <span>Login / Sign Up</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none p-1"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0b10]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-direction-col space-y-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block text-lg font-medium ${
                activeTab === item.id ? 'text-rose-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
