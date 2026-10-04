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
  const lastScrollY = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);

  // Hide the bar on scroll down (slides up off-screen), reveal it on scroll up.
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      // Always fully visible at the top of the page.
      if (currentY <= TOP_OFFSET) {
        scrollAccumulator.current = 0;
        setIsHidden(false);
        return;
      }

      // Ignore sub-pixel jitter; restart the accumulator when direction flips.
      if (Math.abs(delta) < 0.5) return;
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
    };

    // Lenis drives real window scrolling, so native scroll events fire every frame.
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[86px] z-50 font-montserrat select-none transition-transform duration-500 ease-out will-change-transform ${isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
    >
      {/* Subtle dark gradient overlay for text readability without a solid bar */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />

      {/* Main Navbar container */}
      <div className="relative w-full h-full px-6 md:px-10 flex items-center justify-between">
        {/* Left: Logo and Brand Name */}
        <div className="flex items-center min-w-[160px] z-10">
          <a
            href="#home"
            className="flex items-center space-x-1.5 group transition-transform duration-300 hover:scale-105"
            onClick={() => setActiveItem('HOME')}
          >
            <img
              src="/images/logo.png"
              alt="ClashNet Logo"
              className="h-9 md:h-11 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            />
            <span className="text-white font-montserrat font-bold text-base md:text-lg tracking-[0.2em] uppercase">
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
                    onClick={() => setActiveItem(item.name)}
                    className={`relative inline-block py-1 text-xs md:text-sm font-bold uppercase tracking-[0.22em] transition-all duration-300 ease-out transform ${isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white hover:-translate-y-[2px]'
                      }
                    after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-out
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
            className="relative px-6 py-2 rounded-full border border-white/40 hover:border-white/90 text-white text-xs md:text-sm font-bold uppercase tracking-[0.18em] transition-all duration-200 ease-out hover:bg-white/15 active:scale-95"
            onClick={() => {
              // Future auth modal trigger
            }}
          >
            LOGIN
          </button>

          {/* Hamburger button for mobile screens */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/90 hover:text-white focus:outline-none p-1.5 transition-colors"
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
        <div className="md:hidden relative bg-black/85 backdrop-blur-md border-b border-white/10 px-6 py-6 transition-all duration-300 animate-fadeIn">
          <ul className="flex flex-col space-y-5 text-center">
            {NAV_ITEMS.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`inline-block py-1 text-sm font-bold uppercase tracking-[0.22em] transition-all duration-200 ${isActive ? 'text-white border-b-2 border-white' : 'text-white/80 hover:text-white'
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
