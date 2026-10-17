import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Initialize clouds completely off-screen below the viewport (ZERO clouds visible at start)
      gsap.set([cloud1Ref.current, cloud2Ref.current], {
        yPercent: 100,
        y: 0,
        force3D: true,
      });

      // ScrollTrigger timeline over the 160vh hero section (crisp 60vh runway, no dead white screen)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // "DISCOVER" text: scrolls upward as the clouds rise and gently softens with a subtle blur instead of being too blurry
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { yPercent: 0, opacity: 0.92, filter: 'blur(0px)' },
          {
            yPercent: -90,
            opacity: 0.88,
            filter: 'blur(5px)',
            ease: 'power1.out',
            duration: 1,
            force3D: true,
          },
          0
        );
      }

      // Cloud 2: dense organic cloud bank rises up to fill the viewport (stops at yPercent 0 so clouds STAY visible)
      if (cloud2Ref.current) {
        tl.fromTo(
          cloud2Ref.current,
          { yPercent: 100 },
          { yPercent: 0, ease: 'none', force3D: true, duration: 1 },
          0
        );
      }

      // Cloud 1: foreground wisps rise faster for multi-layered 3D depth
      if (cloud1Ref.current) {
        tl.fromTo(
          cloud1Ref.current,
          { yPercent: 100 },
          { yPercent: -15, ease: 'none', force3D: true, duration: 1 },
          0
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full"
      style={{ height: '160vh' }}
    >
      {/* Sticky 100vh viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end items-center">
        {/* Background layer: stationary Clash of Clans artwork */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center select-none"
          style={{ backgroundImage: "url('/images/hero-coc.webp')" }}
        >
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>

        {/* Hero text/content ("DISCOVER") */}
        <div
          ref={contentRef}
          className="relative z-10 mx-auto text-center leading-none select-none pointer-events-none flex justify-center items-end pb-12 sm:pb-16 md:pb-20"
          style={{
            width: `${((1847 - 328) / 1919) * 100}%`,
            willChange: 'transform, filter, opacity',
          }}
        >
          <svg
            viewBox="0 0 1263 210"
            className="w-full h-auto drop-shadow-2xl overflow-visible"
          >
            <text
              x="50%"
              y="190"
              textAnchor="middle"
              fill="white"
              fillOpacity="0.92"
              className="font-bebas"
              style={{
                fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
                fontSize: '240px',
                letterSpacing: '0.04em',
              }}
            >
              DISCOVER
            </text>
          </svg>
        </div>

        {/* Cloud layers: start completely below viewport (yPercent: 100), rise up organically */}

        {/* Cloud 2 (main dense cloud bank) */}
        <div
          ref={cloud2Ref}
          data-hero-cloud="2"
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none will-change-transform"
        >
          {/* Smooth white backing gradient behind the clouds */}
          <div
            className="absolute inset-x-0 bottom-0 w-full h-[85%] pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, #ffffff 0%, #ffffff 45%, rgba(255, 255, 255, 0.95) 65%, rgba(255, 255, 255, 0.5) 80%, transparent 100%)',
            }}
          />

          <img
            src="/images/cloud-2-full.webp"
            alt="Clouds overlay background"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />

          {/* White base extension below the cloud image to seamlessly connect into the next section */}
          <div className="absolute top-[calc(100%-2px)] left-0 w-full h-[60vh] bg-white pointer-events-none" />
        </div>

        {/* Cloud 1 (foreground cloud wisps, faster parallax) */}
        <div
          ref={cloud1Ref}
          data-hero-cloud="1"
          className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none will-change-transform"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
          }}
        >
          <img
            src="/images/cloud-1-cropped.webp"
            alt="Clouds overlay foreground"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};
