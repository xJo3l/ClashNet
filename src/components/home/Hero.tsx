import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic initial arrival for DISCOVER title with upward wipe reveal
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, scale: 1.04, y: 24, clipPath: 'inset(100% 0 0 0)' },
          {
            opacity: 0.92,
            scale: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.1,
            ease: 'power3.out',
            onComplete: () => {
              if (contentRef.current) {
                gsap.set(contentRef.current, { clearProps: 'clipPath' });
              }
            },
          }
        );
      }

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

      // Background layer dimensional scale & subtle lag parallax (hero-depth standard)
      if (bgRef.current) {
        tl.fromTo(
          bgRef.current,
          { scale: 1.04, yPercent: 0 },
          { scale: 1.0, yPercent: -5, ease: 'none', force3D: true, duration: 1 },
          0
        );
      }

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

  // Subtle spring-damped pointer response for dimensional depth (scroll-craft hero-depth §35)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = ((e.clientY - rect.top) / window.innerHeight - 0.5) * 2;
    if (bgRef.current) {
      gsap.to(bgRef.current, { x: xNorm * 7, y: yNorm * 4, duration: 0.9, ease: 'power2.out' });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, { x: -xNorm * 3, duration: 0.9, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    if (bgRef.current) {
      gsap.to(bgRef.current, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, { x: 0, duration: 1, ease: 'power2.out' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full"
      style={{ height: '160vh' }}
    >
      {/* Sticky 100vh viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end items-center">
        {/* Background layer: stationary Clash of Clans artwork with subtle depth */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center select-none will-change-transform"
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
