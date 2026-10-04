import React, { useEffect, useState } from 'react';

export const CloudsOverlay: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      setScrollY(window.scrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax offsets inspired by white-desert.com (multi-speed depth)
  // Layer 1 (foreground cloud): moves aggressively as you scroll
  const layer1Y = -scrollY * 0.75;
  // Layer 2 (background cloud): moves at a slower rate
  const layer2Y = -scrollY * 0.22;

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none z-20 overflow-visible h-[50vh] sm:h-[65vh] lg:h-[80vh]">
      {/* Background Cloud Layer (cloud-2-full.png) */}
      <div
        className="clouds-overlay_wrap absolute inset-x-0 bottom-0 w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, calc(45% + ${layer2Y}px), 0)`,
        }}
      >
        <div className="w-full h-full animate-cloud-slow">
          <img
            src="/images/cloud-2-full.png"
            alt="Clouds overlay background"
            className="w-full h-full object-cover object-bottom select-none pointer-events-none"
            draggable={false}
          />
        </div>
        {/* Solid white extension below so scrolling never exposes a gap */}
        <div className="w-full h-[150vh] bg-white absolute top-full left-0 pointer-events-none" />
      </div>

      {/* Foreground Cloud Layer (cloud-1-cropped.png) */}
      <div
        className="clouds-overlay_wrap absolute inset-x-0 bottom-0 w-full h-full will-change-transform"
        style={{
          transform: `translate3d(0, calc(55% + ${layer1Y}px), 0)`,
        }}
      >
        <div className="w-full h-full animate-cloud-fast">
          <img
            src="/images/cloud-1-cropped.png"
            alt="Clouds overlay foreground"
            className="w-full h-full object-cover object-bottom select-none pointer-events-none"
            draggable={false}
          />
        </div>
        {/* Solid white extension below */}
        <div className="w-full h-[150vh] bg-white absolute top-full left-0 pointer-events-none" />
      </div>
    </div>
  );
};
