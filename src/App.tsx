import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GridOverlay } from './components/GridOverlay';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-outfit selection:bg-rose-500 selection:text-white relative">
      {/* Full-page vertical grid overlay */}
      <GridOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Main hero section */}
      <main>
        <Hero />
      </main>
    </div>
  );
};

export default App;
