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
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isTablet: '(min-width: 768px) and (max-width: 1023px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduceMotion, isMobile, isTablet } = context.conditions as {
            reduceMotion: boolean;
            isMobile: boolean;
            isTablet: boolean;
          };

          if (reduceMotion) return;

          // White-desert uses data-scroll-speed="-80%" for cloud-1 and "-10%" for cloud-2.
          // That means cloud-1 moves UP at 80% of scroll speed (very fast parallax),
          // and cloud-2 moves UP at 10% of scroll speed (gentle parallax).
          // With scrub over the hero section (200vh), we translate that into yPercent targets.

          // Cloud 1 (foreground, fast): rises from translateY(100%) to well above center
          const cloud1End = isMobile ? -60 : isTablet ? -70 : -80;
          // Cloud 2 (background, slow): rises from translateY(100%) gently
          const cloud2End = isMobile ? -5 : isTablet ? -8 : -10;
          // DISCOVER text: moves up gently
          const textEnd = isMobile ? -30 : isTablet ? -50 : -60;

          // ScrollTrigger scrub over the full 200vh hero section
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          });

          // "DISCOVER" text scrolls upward
          if (contentRef.current) {
            tl.to(
              contentRef.current,
              { yPercent: textEnd, ease: 'none', force3D: true },
              0
            );
          }

          // Cloud 2 (background cloud, slow rise like -10% scroll speed)
          // Starts at translateY(100%) via CSS, animates to slightly above resting position
          if (cloud2Ref.current) {
            tl.to(
              cloud2Ref.current,
              { yPercent: cloud2End, ease: 'none', force3D: true },
              0
            );
          }

          // Cloud 1 (foreground cloud, fast rise like -80% scroll speed)
          // Starts at translateY(100%) via CSS, animates way up
          if (cloud1Ref.current) {
            tl.to(
              cloud1Ref.current,
              { yPercent: cloud1End, ease: 'none', force3D: true },
              0
            );
          }
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full"
      style={{ height: '200vh' }}
    >
      {/* Background image: fixed to the first 100vh, stays still */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end items-center"
      >
        {/* Background layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-coc.webp')" }}
        >
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>

        {/* Hero text/content ("DISCOVER") */}
        <div
          ref={contentRef}
          className="relative z-10 mx-auto text-center leading-none select-none pointer-events-none flex justify-center items-end"
          style={{
            width: `${((1847 - 328) / 1919) * 100}%`,
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
              fillOpacity="0.90"
              className="font-bebas"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '240px',
                letterSpacing: '0.04em',
              }}
            >
              DISCOVER
            </text>
          </svg>
        </div>

        {/* Cloud layers — exactly like white-desert.com:
            position: absolute, top: 0, height: 100vh, translateY(100%)
            They sit just below the visible viewport and rise up on scroll */}

        {/* Cloud 2 (background cloud bank, slow parallax — like data-scroll-speed="-10%") */}
        <div
          ref={cloud2Ref}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none will-change-transform"
          style={{ transform: 'translateY(100%)' }}
        >
          <img
            src="/images/cloud-2-full.png"
            alt="Clouds overlay background"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
          {/* White extension fills everything below the cloud */}
          <div className="absolute top-full left-0 w-full h-[100vh] bg-white" />
        </div>

        {/* Cloud 1 (foreground cloud wisps, fast parallax — like data-scroll-speed="-80%") */}
        <div
          ref={cloud1Ref}
          className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none will-change-transform"
          style={{ transform: 'translateY(100%)' }}
        >
          <img
            src="/images/cloud-1-cropped.png"
            alt="Clouds overlay foreground"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
          {/* White extension fills everything below the cloud */}
          <div className="absolute top-full left-0 w-full h-[100vh] bg-white" />
        </div>
      </div>
    </section>
  );
};
