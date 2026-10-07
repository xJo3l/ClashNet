import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeatureCard {
  id: string;
  name: string;
  tag: string;
  subtitle: string;
  image: string;
  actionText?: string;
  isComingSoon?: boolean;
}

const CARDS: FeatureCard[] = [
  {
    id: 'events',
    name: 'EVENTS',
    tag: 'ESPORTS & CWL',
    subtitle:
      'Live tournament coverage, CWL brackets, and competitive clash war leagues with real-time match tracking and world championship standings.',
    image: '/images/card-events.jpg',
    actionText: 'View Events',
  },
  {
    id: 'creators',
    name: 'CREATORS',
    tag: 'COMMANDERS',
    subtitle:
      "Discover creator boost codes, exclusive base links, live streams, and tactical attack breakdowns from the world's best Clash commanders.",
    image: '/images/card-creators.jpg',
    actionText: 'Meet Creators',
  },
  {
    id: 'tools',
    name: 'TOOLS',
    tag: 'WAR MATRIX',
    subtitle:
      'Next-gen base builder analyzers, war attack path planning matrix, and hero equipment upgrade planners — releasing soon.',
    image: '/images/card-tools.jpg',
    actionText: 'Coming Soon',
    isComingSoon: true,
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
const SECTION_HEIGHT = "620vh";

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

  // Static full-screen background image behind a.jpg (no movement, no shadows)
  const nextImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    // Preload & pre-decode images into GPU VRAM to prevent on-the-fly texture allocation hitch
    const preImg = new Image();
    preImg.src = '/images/a.jpg';
    if (preImg.decode) preImg.decode().catch(() => { });

    const preImg2 = new Image();
    preImg2.src = '/images/Clash_of_Clans_July_2023_Loading_Screen_Goblin_Season_part_2.png';
    if (preImg2.decode) preImg2.decode().catch(() => { });

    const ctx = gsap.context(() => {
      // ── Initial States ──────────────────────────────────────────────
      gsap.set(slitsContainerRef.current, { x: 0, autoAlpha: 1, transformOrigin: 'center center', force3D: true });
      slitElementsRef.current.forEach((el, i) => {
        if (el && SLITS[i]) gsap.set(el, { clipPath: SLITS[i].initial, force3D: true });
      });

      // Next image stays stationary behind a.jpg; initially hidden so mountain scene is visible
      if (nextImageRef.current) {
        gsap.set(nextImageRef.current, { autoAlpha: 0, force3D: true });
      }

      // Track starts completely off-screen to the right
      gsap.set(track, { x: '100vw', force3D: true });
      if (polarTextRef.current) {
        gsap.set(polarTextRef.current, { y: () => window.innerHeight * 0.88, force3D: true });
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

      // MORE TO DISCOVER text starts rising as section enters the viewport (top 75%)
      // and cleanly exits the top edge at the exact moment slit transition begins (+1.95 innerHeight)
      if (polarTextRef.current) {
        gsap.fromTo(
          polarTextRef.current,
          { y: () => window.innerHeight * 0.88 },
          {
            y: () => -window.innerHeight * 0.36,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: outer,
              start: 'top 75%',
              end: () => `+=${window.innerHeight * 1.95}`,
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
      const TRACK_END = 0.92;

      // ══════════════════════════════════════════════════════════════════
      // ── Transition & Speed Controls (Adjust manually here) ────────────
      // ══════════════════════════════════════════════════════════════════

      // 1. START POINT: When the background transition begins (adjust multiplier e.g. 0.45, 0.47, 0.55):
      const REVEAL_START = cardTriggerPoint + (TRACK_END - cardTriggerPoint) * 0.47;

      // 2. Base duration for a.jpg to cross the screen (100vw):
      const totalTrackDist = track.scrollWidth + window.innerWidth * 1.1;
      const bgDuration = (window.innerWidth / totalTrackDist) * (TRACK_END - cardTriggerPoint);

      // 3. BOOST POSITION: When speed increase triggers (0.50 = middle of screen, 0.40 = earlier, 0.60 = later):
      const BOOST_POSITION = 0.50;
      const SPEED_BOOST_TIME = REVEAL_START + bgDuration * BOOST_POSITION;

      // 4. SPEED BOOST FACTOR:
      // Controls how much the card speeds up from BOOST_POSITION:
      // 1.25 - 1.4 = smooth, controlled speed-up (recommended)
      // 1.5 - 1.8 = faster speed-up
      const SPEED_BOOST = 1.50;

      // Calculation of durations to ensure seamless, continuous movement without stopping:
      const trackNormalSpeed = totalTrackDist / (TRACK_END - cardTriggerPoint);
      const stage1Duration = SPEED_BOOST_TIME - cardTriggerPoint;
      const stage1Distance = trackNormalSpeed * stage1Duration;
      const stage2RemainingDistance = totalTrackDist - stage1Distance;
      const stage2Duration = stage2RemainingDistance / (trackNormalSpeed * SPEED_BOOST);
      const midPointX = window.innerWidth - stage1Distance;

      // Stage 1 (cardTriggerPoint -> SPEED_BOOST_TIME): steady speed matching the background
      tl.fromTo(
        track,
        { x: () => window.innerWidth },
        {
          x: () => midPointX,
          ease: 'none',
          duration: stage1Duration,
          force3D: true,
        },
        cardTriggerPoint
      );

      // Stage 2 (SPEED_BOOST_TIME -> exit): directly transitions into boosted speed (NO zero-velocity freeze)
      tl.fromTo(
        track,
        { x: () => midPointX },
        {
          x: () => -(track.scrollWidth + window.innerWidth * 0.1),
          ease: 'none', // linear boosted speed so the card never stops or delays
          duration: stage2Duration,
          force3D: true,
        },
        SPEED_BOOST_TIME
      );

      // Background transition: slides from 0 to -100vw, completing after cards have left
      if (nextImageRef.current) {
        tl.set(nextImageRef.current, { autoAlpha: 1 }, REVEAL_START);
      }

      if (slitsContainerRef.current) {
        tl.to(
          slitsContainerRef.current,
          {
            x: () => -window.innerWidth,
            ease: 'none',
            duration: bgDuration,
            force3D: true,
          },
          REVEAL_START
        );
      }

      const horizontalTrackTween = tl
        .getChildren(false, true, false)
        .find((tween) => tween.targets().includes(track))!;

      // Layered panel reveals for cards
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
            start: 'left 95%',
            end: 'right 5%',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        panelTl.fromTo(
          photo,
          { clipPath: 'inset(0 14% 0 0)', scale: 1.035 },
          { clipPath: 'inset(0 0% 0 0)', scale: 1, ease: 'none', duration: 0.58 },
          0
        );
        panelTl.fromTo(
          content,
          { y: 12 },
          {
            y: 0,
            ease: 'power1.out',
            duration: 0.2,
            stagger: 0.04,
          },
          0.08
        );
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
              className="absolute top-[8%] right-[3%] max-w-[280px] md:max-w-[340px]
                         min-[1280px]:left-[72.5%] min-[1280px]:right-auto min-[1280px]:top-[10%]
                         min-[1280px]:w-[18%] min-[1280px]:max-w-none text-white
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

        {/* ── Layer Next Image: Goblin Season Full Screen Image (stays stationary behind a.jpg, no shadows) ── */}
        <div
          ref={nextImageRef}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{ zIndex: 15, visibility: 'hidden' }}
        >
          <img
            src="/images/Clash_of_Clans_July_2023_Loading_Screen_Goblin_Season_part_2.png"
            alt="Goblin Season Loading Screen"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />
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
          {CARDS.map((card, index) => (
            <div
              key={card.id}
              id={card.id}
              ref={(el) => { panelRefs.current[index] = el; }}
              className="horizontal-scroll_panel relative flex-shrink-0 overflow-hidden rounded-sm
                         shadow-[0_24px_60px_rgba(0,0,0,0.55)]
                         flex flex-col justify-between
                         p-8 md:p-10 text-white group opacity-100"
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
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover object-center will-change-transform opacity-100"
                    draggable={false}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none" />
              </div>

              {/* Top: name + subtitle */}
              <div className="relative z-10">
                <p
                  data-panel-label
                  className="font-montserrat font-semibold text-[9px] md:text-[10px] uppercase tracking-[0.24em] text-amber-400 mb-3"
                >
                  CLASHNET&nbsp; / &nbsp;0{index + 1}
                </p>
                <h3
                  data-panel-heading
                  className="font-cormorant font-normal uppercase text-white tracking-[0.05em] leading-none mb-3
                             text-4xl md:text-5xl lg:text-6xl drop-shadow-md"
                >
                  {card.name}
                </h3>
                <p data-panel-copy className="font-outfit text-[11px] md:text-xs text-white/90 leading-relaxed max-w-[90%]">
                  {card.subtitle}
                </p>
              </div>

              {/* Middle: CTA / Status */}
              <div data-panel-action className="relative z-10 self-start">
                {card.isComingSoon ? (
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 backdrop-blur-sm font-montserrat font-bold text-[10px] tracking-[0.22em] uppercase text-amber-300">
                    Coming Soon
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </span>
                ) : (
                  <a
                    href={`#${card.id}`}
                    className="inline-flex items-center gap-2 font-montserrat font-bold text-[11px] tracking-[0.22em]
                               uppercase text-white hover:text-amber-300 transition-colors duration-200"
                  >
                    {card.actionText || 'Learn More'}
                    <span className="text-amber-400 text-sm font-normal">+</span>
                  </a>
                )}
              </div>

              {/* Bottom: tag + counter */}
              <div data-panel-footer className="relative z-10 flex items-end justify-between border-t border-white/20 pt-4">
                <span className="font-montserrat text-[9px] md:text-[10px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                  {card.tag}
                </span>
                <span className="font-montserrat text-[9px] md:text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  0{index + 1}&nbsp;/&nbsp;0{CARDS.length}
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

