import React, { useEffect, useRef, useState } from 'react';

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'HOME', href: '#home' },
  { name: 'CREATORS', href: '#creators' },
  { name: 'EVENTS', href: '#events' },
  { name: 'TOOLS', href: '#tools' },
];

/** How far (px) the user must scroll in one direction before the bar toggles. */
const TOGGLE_DISTANCE = 40;

/** The bar always stays visible while the page is this close to the very top. */
const TOP_OFFSET = 12;

export const Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isAboutSection, setIsAboutSection] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);

  // Hide the bar on scroll down (slides up off-screen), reveal it on scroll up.
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const checkTheme = () => {
      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        if (footerRect.top <= 86) {
          setIsAboutSection(false);
          return;
        }
      }

      const contactEl = document.getElementById('contact') || document.getElementById('text-section');
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect();
        if (contactRect.top <= 86) {
          setIsAboutSection(true);
          return;
        }
      }

      const aboutEl = document.getElementById('about');
      const whatsNewEl = document.getElementById('whats-new') || document.getElementById('camps');

      if (aboutEl) {
        const aboutRect = aboutEl.getBoundingClientRect();
        const whatsNewRect = whatsNewEl ? whatsNewEl.getBoundingClientRect() : null;

        // Navbar is black/dark theme ONLY while scrolling through the white About section.
        // Once What's New (whats-new / camps) reaches the top, navbar switches back to full white.
        const isPastAboutTop = aboutRect.top <= 120;
        const isPastWhatsNewTop = whatsNewRect ? whatsNewRect.top <= 86 : false;

        setIsAboutSection(isPastAboutTop && !isPastWhatsNewTop);
      }
    };

    let ticking = false;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      // Always fully visible at the top of the page.
      if (currentY <= TOP_OFFSET) {
        scrollAccumulator.current = 0;
        setIsHidden(false);
      } else if (Math.abs(delta) >= 0.5) {
        if (Math.sign(delta) !== Math.sign(scrollAccumulator.current)) {
          scrollAccumulator.current = 0;
        }
        scrollAccumulator.current += delta;

        if (scrollAccumulator.current > TOGGLE_DISTANCE) {
          scrollAccumulator.current = 0;
          setIsMobileMenuOpen(false);
          setIsHidden(true);
        } else if (scrollAccumulator.current < -TOGGLE_DISTANCE) {
          scrollAccumulator.current = 0;
          setIsHidden(false);
        }
      }

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          checkTheme();
          ticking = false;
        });
      }
    };

    checkTheme();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveItem('HOME');
    setIsMobileMenuOpen(false);
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string, name: string) => {
    if (href === '#home' || name === 'HOME') {
      handleScrollToTop(e);
      return;
    }
    setActiveItem(name);
    setIsMobileMenuOpen(false);
    const lenis = (window as any).__lenis;
    const target = document.querySelector(href);
    if (target) {
      if (e) e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[86px] z-50 font-montserrat select-none transition-transform duration-500 ease-out will-change-transform ${isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
    >
      {/* Subtle dark gradient overlay - hidden completely when entering About section */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none transition-opacity duration-300 ${isAboutSection ? 'opacity-0' : 'opacity-100'
          }`}
      />

      {/* Main Navbar container */}
      <div className="relative w-full h-full px-6 md:px-10 flex items-center justify-between">
        {/* Left: Logo and Brand Name */}
        <div className="flex items-center min-w-[160px] z-10">
          <a
            href="#home"
            className="flex items-center space-x-2 group transition-transform duration-300 hover:scale-105"
            onClick={handleScrollToTop}
          >
            <img
              src="/images/logo.png"
              alt="ClashNet Logo"
              className={`h-9 md:h-11 w-auto object-contain transition-all duration-300 ${isAboutSection
                ? 'brightness-0'
                : 'brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
                }`}
            />
            <span
              className={`font-montserrat font-bold text-base md:text-lg tracking-[0.2em] uppercase transition-colors duration-300 ${isAboutSection ? 'text-black' : 'text-white'
                }`}
            >
              clashnet
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <ul className="flex items-center space-x-12">
            {NAV_ITEMS.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] transition-all duration-300 ease-out transform ${isAboutSection
                      ? isActive
                        ? 'text-black'
                        : 'text-black/70 hover:text-black hover:-translate-y-[2px]'
                      : isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white hover:-translate-y-[2px]'
                      }
                    after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:transition-all after:duration-300 after:ease-out
                    ${isAboutSection ? 'after:bg-black' : 'after:bg-white'}
                    ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                    `}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Login button & Mobile toggle */}
        <div className="flex items-center justify-end space-x-4 min-w-[160px] z-10">
          <button
            className={`relative px-6 py-2 rounded-full border text-xs md:text-sm font-bold uppercase tracking-[0.18em] transition-all duration-200 ease-out active:scale-95 ${isAboutSection
              ? 'border-black/30 hover:border-black text-black hover:bg-black/5'
              : 'border-white/40 hover:border-white/90 text-white hover:bg-white/15'
              }`}
            onClick={() => {
              // Future auth modal trigger
            }}
          >
            LOGIN
          </button>

          {/* Hamburger button for mobile screens */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden focus:outline-none p-1.5 transition-colors duration-300 ${isAboutSection ? 'text-black' : 'text-white/90 hover:text-white'
              }`}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden relative px-6 py-6 transition-all duration-300 animate-fadeIn ${isAboutSection
            ? 'bg-white/95 backdrop-blur-md border-b border-black/10'
            : 'bg-black/85 backdrop-blur-md border-b border-white/10'
            }`}
        >
          <ul className="flex flex-col space-y-5 text-center">
            {NAV_ITEMS.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] transition-all duration-200 ${isAboutSection
                      ? isActive
                        ? 'text-black border-b-2 border-black'
                        : 'text-black/70 hover:text-black'
                      : isActive
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/80 hover:text-white'
                      }`}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};
