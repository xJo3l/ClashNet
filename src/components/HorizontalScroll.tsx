import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CampCard {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  coordinates: string;
}

const CAMPS: CampCard[] = [
  {
    id: 'whichaway',
    name: 'WHICHAWAY',
    subtitle:
      'Our original camp, newly reimagined. Rare exposed rock and freshwater lakes — this is a side of the Clash world seldom seen.',
    image:
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1600&q=85',
    coordinates: "[ 70° 48' 00\" S, 11° 23' 00\" E ]",
  },
  {
    id: 'echo',
    name: 'ECHO',
    subtitle:
      'Inspired by champions, used by veterans. As close as you can get to the top of the ladder.',
    image:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=85',
    coordinates: "[ 71° 32' 47\" S, 8° 50' 11\" E ]",
  },
  {
    id: 'wolfs-fang',
    name: "WOLF'S FANG",
    subtitle:
      'Set against dramatic formations rising from the battlefield. For those seeking the ultimate challenge.',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=85',
    coordinates: "[ 71° 31' 36\" S, 8° 48' 00\" E ]",
  },
];

// ── SLIT REVEAL CONFIGURATION ─────────────────────────────────────────
// Exactly 3 openings based on the 1919px grid, opening exclusively to the LEFT:
// 1. Far Left:  0px to 644px (33.56% width)
// 2. Middle:    644px to 1275px (32.88% width)
// 3. Far Right: 1275px to 100% (33.56% width)
const SLITS = [
  { initial: 'inset(0% 66.44% 0% 33.56%)', final: 'inset(0% 66.44% 0% 0%)', duration: 0.32 },
  { initial: 'inset(0% 33.56% 0% 66.44%)', final: 'inset(0% 33.56% 0% 33.56%)', duration: 0.31 },
  { initial: 'inset(0% 0% 0% 100%)', final: 'inset(0% 0% 0% 66.44%)', duration: 0.32 },
];

// Section Height Runway (controls overall scroll pacing)
const SECTION_HEIGHT = "580vh";

export const HorizontalScroll: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Layers
  const mountainRef = useRef<HTMLDivElement>(null);
  const mountainImageRef = useRef<HTMLImageElement>(null);
  const mountainTitleRef = useRef<HTMLHeadingElement>(null);
  const polarTextRef = useRef<HTMLDivElement>(null);
  
  // Slit Reveal
  const slitsContainerRef = useRef<HTMLDivElement>(null);
  const slitElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Cards
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    // Preload & pre-decode a.jpg into GPU VRAM to prevent on-the-fly texture allocation hitch
    const preImg = new Image();
    preImg.src = '/images/a.jpg';
    if (preImg.decode) {
      preImg.decode().catch(() => {});
    }

    const ctx = gsap.context(() => {
      // ── Initial States ──────────────────────────────────────────────
      gsap.set(slitsContainerRef.current, { autoAlpha: 1, transformOrigin: 'center center', force3D: true });
      slitElementsRef.current.forEach((el, i) => {
        if (el && SLITS[i]) gsap.set(el, { clipPath: SLITS[i].initial, force3D: true });
      });

      // Track starts completely off-screen to the right
      gsap.set(track, { x: '100vw', force3D: true });
      if (polarTextRef.current) {
        gsap.set(polarTextRef.current, { y: () => window.innerHeight * 0.92, force3D: true });
      }

      // Expand the opening scene as the section rises into the viewport
      if (mountainRef.current) {
        gsap.fromTo(
          mountainRef.current,
          { scaleX: 0.96, scaleY: 0.96 },
          {
            scaleX: () => window.innerWidth / (window.innerWidth * 0.92),
            scaleY: () => window.innerHeight / (window.innerHeight - window.innerWidth * 0.06),
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: outer,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // WHAT'S NEW title shrinks from 1.24 down to 0.55 starting as it enters the viewport (top bottom)
      // and finishing exactly when the text exits and slit transition begins (+2.2 innerHeight)
      if (mountainTitleRef.current) {
        gsap.fromTo(
          mountainTitleRef.current,
          { scale: 1.24, autoAlpha: 1 },
          {
            scale: () => (window.innerWidth >= 1280 ? 0.55 : 1),
            autoAlpha: 1,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: outer,
              start: 'top bottom',
              end: () => `+=${window.innerHeight * 2.2}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // ── Main Master Timeline (Single ScrollTrigger for zero-hitch execution) ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // Opening scene subtle depth drift
      if (mountainImageRef.current) {
        tl.fromTo(
          mountainImageRef.current,
          { scale: 1.02 },
          { scale: 1, ease: 'none', duration: 0.25, force3D: true },
          0
        );
      }

      // 0.00 – 0.25: "MORE TO DISCOVER" smoothly rises all the way up and cleanly exits top of viewport
      if (polarTextRef.current) {
        tl.fromTo(
          polarTextRef.current,
          { y: () => window.innerHeight * 0.92 },
          { y: () => -window.innerHeight * 0.36, ease: 'none', duration: 0.25, force3D: true },
          0
        );
      }

      // 0.25 – 0.57: Slits continuously expand leftward at constant speed IMMEDIATELY as text exits
      const OPENING_START = 0.25;
      const OPENING_DURATION = 0.32;
      SLITS.forEach((slit, i) => {
        const el = slitElementsRef.current[i];
        if (!el) return;
        tl.fromTo(
          el,
          { clipPath: slit.initial },
          { clipPath: slit.final, ease: 'none', duration: slit.duration },
          OPENING_START
        );
      });

      // As the far right slit crosses ~1400px (progress ~0.508), the card track slides in
      const cardTriggerPoint = OPENING_START + OPENING_DURATION * 0.806;
      tl.to(
        track,
        {
          x: () => {
            const totalW = track.scrollWidth;
            const vw = window.innerWidth;
            // End position: last card right edge aligns with right viewport edge (minus margin)
            return -(totalW - vw + vw * 0.08);
          },
          ease: 'none',
          duration: 1.0 - cardTriggerPoint,
          force3D: true,
        },
        cardTriggerPoint
      );
      const horizontalTrackTween = tl
        .getChildren(false, true, false)
        .find((tween) => tween.targets().includes(track))!;

      // Layered panel reveals follow the existing horizontal track tween.
      // The track's x, duration, start point, and ScrollTrigger remain unchanged.
      panelRefs.current.forEach((panel, index) => {
        const photo = photoRefs.current[index];
        if (!panel || !photo) return;

        const label = panel.querySelector<HTMLElement>('[data-panel-label]');
        const heading = panel.querySelector<HTMLElement>('[data-panel-heading]');
        const supportingText = panel.querySelector<HTMLElement>('[data-panel-copy]');
        const action = panel.querySelector<HTMLElement>('[data-panel-action]');
        const footer = panel.querySelector<HTMLElement>('[data-panel-footer]');
        const content = [label, heading, supportingText, action, footer].filter(
          (element): element is HTMLElement => Boolean(element)
        );

        const panelTl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTrackTween,
            start: 'left 92%',
            end: 'right 8%',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        panelTl.fromTo(
          photo,
          { clipPath: 'inset(0 14% 0 0)', scale: 1.035, opacity: 0.8 },
          { clipPath: 'inset(0 0% 0 0)', scale: 1, opacity: 1, ease: 'none', duration: 0.58 },
          0
        );
        panelTl.fromTo(
          content,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.2,
            stagger: 0.055,
          },
          0.08
        );
        panelTl.to(
          content,
          {
            autoAlpha: 0,
            y: -8,
            ease: 'power1.in',
            duration: 0.18,
            stagger: 0.025,
          },
          0.78
        );
        panelTl.to(photo, { opacity: 0.72, ease: 'none', duration: 0.2 }, 0.8);
      });

      // Inner image parallax (images move slightly less than the card = depth effect)
      imgRefs.current.forEach((imgWrap) => {
        if (!imgWrap) return;
        tl.fromTo(
          imgWrap,
          { xPercent: -8 },
          { xPercent: 8, ease: 'none', duration: 0.6 },
          0.40
        );
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={outerRef}
      id="whats-new"
      aria-label="What's New"
      className="relative w-full"
      style={{ height: SECTION_HEIGHT }}
    >
      {/* ── Sticky Viewport ──────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: '#ffffff' }}
      >
        {/* ── Layer A: Mountain Hero (frames 1 & 2) ──────────────────── */}
        <div
          ref={mountainRef}
          className="absolute inset-0 z-10 will-change-transform"
          style={{ padding: '3vw 4vw' }}
        >
          <div className="relative w-full h-full overflow-hidden bg-white">
            <img
              ref={mountainImageRef}
              src="/images/whats-new-background.jpg"
              alt="Mountain landscape"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* "WHAT'S NEW" centered title */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
              <h2
                ref={mountainTitleRef}
                className="font-cormorant font-normal uppercase text-white tracking-[0.09em] leading-none
                           text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[6.5vw]
                           drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
              >
                WHAT’S NEW
              </h2>
            </div>

            {/* Editorial text block */}
            <div
              ref={polarTextRef}
              className="absolute top-[8%] right-[3%] max-w-[280px] md:max-w-[340px] min-[1280px]:left-[70.5%]
                         min-[1280px]:right-auto min-[1280px]:top-[10%] min-[1280px]:w-[19.5%] min-[1280px]:max-w-none text-white
                         drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            >
              <p className="font-montserrat font-bold text-[10px] md:text-[11px] uppercase tracking-[0.28em] mb-2 text-white">
                MORE TO DISCOVER
              </p>
              <p className="font-outfit text-[11px] md:text-xs text-white/85 leading-relaxed">
                New features, powerful tools, and fresh experiences are constantly being added to make ClashNet your home for everything Clash. Stay up to date, discover new ways to play, and explore everything the community has to offer. Have an idea for a new feature or a suggestion to make ClashNet better? Get in touch and help shape what comes next.
              </p>
            </div>
          </div>
        </div>

        {/* ── Layer B: Multi-Column Slit Reveal (a.jpg) ────────────── */}
        <div
          ref={slitsContainerRef}
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          {SLITS.map((slit, i) => (
            <div
              key={i}
              ref={(el) => { slitElementsRef.current[i] = el; }}
              className="absolute inset-0 w-full h-full overflow-hidden will-change-[clip-path]"
              style={{
                clipPath: slit.initial,
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src="/images/a.jpg"
                alt="Revealed background"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                style={{ transform: 'translateZ(0)' }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ── Layer D: Horizontal Card Track (frames 4 & 5) ──────────── */}
        {/*
          The sticky wrapper has overflow:hidden so anything outside the viewport is clipped.
          Track starts at x=100vw (fully off-screen right), slides left as scroll progresses.
        */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full z-30 flex items-center will-change-transform"
          style={{
            transform: 'translate3d(100vw, 0, 0)',
            paddingLeft: '8vw',
            paddingRight: '8vw',
            gap: '4vw',
            display: 'flex',
          }}
        >
          {CAMPS.map((camp, index) => (
            <div
              key={camp.id}
              ref={(el) => { panelRefs.current[index] = el; }}
              className="horizontal-scroll_panel relative flex-shrink-0 overflow-hidden rounded-sm
                         shadow-[0_24px_60px_rgba(0,0,0,0.55)]
                         flex flex-col justify-between
                         p-8 md:p-10 text-white group"
              style={{
                width: 'clamp(340px, 42vw, 660px)',
                height: 'clamp(420px, 72vh, 720px)',
              }}
            >
              {/* Background image with parallax wrapper */}
              <div className="horizontal-scroll_clip-wrap absolute inset-0 overflow-hidden">
                <div
                  ref={(el) => { imgRefs.current[index] = el; }}
                  className="horizontal-scroll_img-wrap absolute will-change-transform"
                  style={{ inset: '-10% -15%', width: 'calc(100% + 30%)', height: 'calc(100% + 20%)' }}
                >
                  <img
                    ref={(el) => { photoRefs.current[index] = el; }}
                    src={camp.image}
                    alt={camp.name}
                    className="w-full h-full object-cover object-center will-change-transform"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/50 pointer-events-none" />
              </div>

              {/* Top: name + subtitle */}
              <div className="relative z-10">
                <p
                  data-panel-label
                  className="font-montserrat font-semibold text-[9px] md:text-[10px] uppercase tracking-[0.24em] text-white/70 mb-3"
                >
                  REMOTE CAMP&nbsp; / &nbsp;0{index + 1}
                </p>
                <h3
                  data-panel-heading
                  className="font-cormorant font-normal uppercase text-white tracking-[0.05em] leading-none mb-3
                             text-4xl md:text-5xl lg:text-6xl drop-shadow-md"
                >
                  {camp.name}
                </h3>
                <p data-panel-copy className="font-outfit text-[11px] md:text-xs text-white/85 leading-relaxed max-w-[85%]">
                  {camp.subtitle}
                </p>
              </div>

              {/* Middle: Learn More CTA */}
              <div data-panel-action className="relative z-10 self-start">
                <a
                  href={`#${camp.id}`}
                  className="inline-flex items-center gap-2 font-montserrat font-bold text-[11px] tracking-[0.22em]
                             uppercase text-white hover:text-amber-300 transition-colors duration-200"
                >
                  Learn More
                  <span className="text-amber-400 text-sm font-normal">+</span>
                </a>
              </div>

              {/* Bottom: coordinates + counter */}
              <div data-panel-footer className="relative z-10 flex items-end justify-between border-t border-white/20 pt-4">
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.18em] text-white/70 uppercase">
                  {camp.coordinates}
                </span>
                <span className="font-montserrat text-[9px] md:text-[10px] font-semibold tracking-widest text-amber-400 uppercase">
                  0{index + 1}&nbsp;/&nbsp;0{CAMPS.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
