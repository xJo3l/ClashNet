import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero, HorizontalScroll, Contact } from './components/home';
import { Creators } from './components/Creators';
import { CustomCursor } from './components/ui/CustomCursor';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'creators'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#creators' ? 'creators' : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#creators') {
        setCurrentRoute('creators');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Expose lenis instance globally for smooth navigation
    (window as any).__lenis = lenis;

    return () => {
      (window as any).__lenis = null;
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-outfit selection:bg-rose-500 selection:text-white relative">
      {/* Global Interactive Custom Cursor */}
      <CustomCursor />

      {currentRoute === 'creators' ? (
        <Creators
          key="creators-clean"
          onNavigateHome={() => {
            window.location.hash = '#home';
            setCurrentRoute('home');
          }}
        />
      ) : (
        <>
          {/* Navigation */}
          <Navbar onNavigate={(page) => setCurrentRoute(page as 'home' | 'creators')} />

          {/* Main content */}
          <main>
            <Hero />
            <HorizontalScroll />

            {/* Contact area with white background under ClashNet */}
            <Contact />
          </main>

          {/* Dark Footer */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
