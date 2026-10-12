import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero, HorizontalScroll, Contact } from './components/home';
import { Creators } from './components/Creators';
import { Events } from './components/Events';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'creators' | 'events'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#creators') return 'creators';
      if (window.location.hash === '#events') return 'events';
    }
    return 'home';
  });

  const scrollToPageTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#creators') {
        setCurrentRoute('creators');
        scrollToPageTop();
      } else if (hash === '#events') {
        setCurrentRoute('events');
        scrollToPageTop();
      } else if (hash === '#home' || !hash) {
        setCurrentRoute('home');
        scrollToPageTop();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    scrollToPageTop();
  }, [currentRoute]);
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
      {currentRoute === 'creators' ? (
        <Creators
          key="creators-clean"
          onNavigateHome={() => {
            window.location.hash = '#home';
            setCurrentRoute('home');
            scrollToPageTop();
          }}
          onNavigateEvents={() => {
            window.location.hash = '#events';
            setCurrentRoute('events');
            scrollToPageTop();
          }}
        />
      ) : currentRoute === 'events' ? (
        <Events
          key="events-clean"
          onNavigateHome={() => {
            window.location.hash = '#home';
            setCurrentRoute('home');
            scrollToPageTop();
          }}
          onNavigateCreators={() => {
            window.location.hash = '#creators';
            setCurrentRoute('creators');
            scrollToPageTop();
          }}
        />
      ) : (
        <>
          {/* Navigation */}
          <Navbar onNavigate={(page) => setCurrentRoute(page as 'home' | 'creators' | 'events')} />

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
