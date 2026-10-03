import React from 'react';
import { Hero } from './components/Hero';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-outfit selection:bg-rose-500 selection:text-white">
      <main>
        <Hero onExploreEvents={() => {}} />
      </main>
    </div>
  );
};

export default App;
