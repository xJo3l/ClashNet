import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { About } from './About';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

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
          const textEnd = isMobile ? -50 : isTablet ? -70 : -385;

          // Explicitly initialize cloud and about positions off-screen below the viewport
          gsap.set([cloud1Ref.current, cloud2Ref.current, aboutRef.current], {
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

          // "DISCOVER" text: scrolls upward and blurs as it reaches the middle
          if (contentRef.current) {
            tl.fromTo(
              contentRef.current,
              { yPercent: 0, y: 0 },
              { yPercent: textEnd, y: 0, ease: 'none', force3D: true, duration: 0.95 },
              0
            );

            // Reaches blur around middle of scroll (0.5), then blurs more as it enters clouds
            tl.fromTo(
              contentRef.current,
              { filter: 'blur(0px)' },
              { filter: 'blur(8px)', ease: 'power1.inOut', duration: 0.5 },
              0
            );
            tl.to(
              contentRef.current,
              { filter: 'blur(14px)', ease: 'none', duration: 0.45 },
              0.5
            );
          }

          // Cloud 2: dense cloud bank rises up
          if (cloud2Ref.current) {
            tl.fromTo(
              cloud2Ref.current,
              { yPercent: 100, y: 0 },
              { yPercent: cloud2End, y: 0, ease: 'none', force3D: true, duration: 0.95 },
              0
            );
          }

          // About section: rises from bottom into full screen view (same as Contact approach)
          if (aboutRef.current) {
            tl.fromTo(
              aboutRef.current,
              { yPercent: 100, y: 0 },
              { yPercent: 0, y: 0, ease: 'none', force3D: true, duration: 0.95 },
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
      id="home"
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
            willChange: 'transform, filter',
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
                fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
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

        {/* Cloud 2 (main dense cloud bank + About section) */}
        <div
          ref={cloud2Ref}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none will-change-transform"
        >
          {/* Smooth, dense white backing gradient to completely blend away dark background */}
          <div
            className="absolute inset-x-0 bottom-0 w-full h-[85%] pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, #ffffff 0%, #ffffff 55%, rgba(255, 255, 255, 0.95) 70%, rgba(255, 255, 255, 0.6) 82%, transparent 100%)',
            }}
          />

          <img
            src="/images/cloud-2-full.png"
            alt="Clouds overlay background"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
          {/* White extension below the clouds */}
          <div className="absolute top-[calc(100%-3px)] left-0 w-full h-[200vh] bg-white pointer-events-none" />
        </div>

        {/* Cloud 1 (foreground cloud wisps, faster parallax) */}
        <div
          ref={cloud1Ref}
          className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none will-change-transform"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
            maskImage: 'linear-gradient(to bottom, black 70%, transparent 98%)',
          }}
        >
          <img
            src="/images/cloud-1-cropped.png"
            alt="Clouds overlay foreground"
            className="absolute top-0 left-0 w-full h-full object-cover object-top select-none pointer-events-none"
            style={{ transform: 'translateZ(0)' }}
            draggable={false}
          />
        </div>

        {/* About section - z-40 (IN FRONT of all clouds) */}
        <div
          ref={aboutRef}
          className="absolute top-0 left-0 w-full h-full z-40 pointer-events-auto will-change-transform"
        >
          <About />
        </div>
      </div>
    </section>
  );
};
