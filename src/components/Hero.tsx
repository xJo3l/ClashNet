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

          // Parallax speeds:
          // Cloud 1 (foreground wisps, faster parallax rise)
          const cloud1End = isMobile ? -120 : isTablet ? -135 : -150;
          // Cloud 2 (main dense cloud bank, rises to top of screen and blankets viewport in white)
          const cloud2End = isMobile ? -100 : -105;
          // DISCOVER text: drifts gently upward as clouds rise
          const textEnd = isMobile ? -50 : isTablet ? -70 : -85;

          // Explicitly initialize cloud positions off-screen below the viewport
          gsap.set([cloud1Ref.current, cloud2Ref.current], {
            yPercent: 100,
            y: 0,
            force3D: true,
          });

          // ScrollTrigger scrub over the full 300vh hero section (giving 200vh of scroll runway)
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          });

          // "DISCOVER" text scrolls upward gently
          if (contentRef.current) {
            tl.fromTo(
              contentRef.current,
              { yPercent: 0, y: 0 },
              { yPercent: textEnd, y: 0, ease: 'none', force3D: true, duration: 0.95 },
              0
            );
          }

          // Cloud 2 (background cloud bank): rises from bottom until clouds reach top of screen
          // and solid white base fills the entire viewport (matching Image 2)
          if (cloud2Ref.current) {
            tl.fromTo(
              cloud2Ref.current,
              { yPercent: 100, y: 0 },
              { yPercent: cloud2End, y: 0, ease: 'none', force3D: true, duration: 0.95 },
              0
            );
          }

          // Cloud 1 (foreground cloud wisps): rises faster across the screen for 3D parallax depth
          if (cloud1Ref.current) {
            tl.fromTo(
              cloud1Ref.current,
              { yPercent: 100, y: 0 },
              { yPercent: cloud1End, y: 0, ease: 'none', force3D: true, duration: 0.95 },
              0
            );
          }

          // Timeline pad so 0.95-1.0 is pure white buffer before page transitions into About section
          tl.set({}, {}, 1);
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full"
      style={{ height: '300vh' }}
    >
      {/* Background image: stays completely still in sticky viewport */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end items-center"
      >
        {/* Background layer: completely stationary */}
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

        {/* Cloud layers:
            Start below visible viewport via gsap.set,
            rise upward over the still hero image until the clouds reach the top of the screen */}

        {/* Cloud 2 (main dense cloud bank + white extension) */}
        <div
          ref={cloud2Ref}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none will-change-transform"
        >
          <img
            src="/images/cloud-2-full.png"
            alt="Clouds overlay background"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
          {/* White extension fills everything below the cloud */}
          <div className="absolute top-full left-0 w-full h-[200vh] bg-white" />
        </div>

        {/* Cloud 1 (foreground cloud wisps, faster parallax) */}
        <div
          ref={cloud1Ref}
          className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none will-change-transform"
        >
          <img
            src="/images/cloud-1-cropped.png"
            alt="Clouds overlay foreground"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
          {/* White extension fills everything below the cloud */}
          <div className="absolute top-full left-0 w-full h-[200vh] bg-white" />
        </div>
      </div>
    </section>
  );
};
