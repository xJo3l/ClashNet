import React, { useEffect, useRef, useState } from 'react';
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
    image: '/images/card-events.webp',
    actionText: 'View Events',
  },
  {
    id: 'creators',
    name: 'CREATORS',
    tag: 'COMMANDERS',
    subtitle:
      "Discover creator boost codes, exclusive base links, live streams, and tactical attack breakdowns from the world's best Clash commanders.",
    image: '/images/card-creators.webp',
    actionText: 'Meet Creators',
  },
  {
    id: 'tools',
    name: 'TOOLS',
    tag: 'WAR MATRIX',
    subtitle:
      'Next-gen base builder analyzers, war attack path planning matrix, and hero equipment upgrade planners — releasing soon.',
    image: '/images/card-tools.webp',
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
  { initial: 'inset(0% 66.44% 0% 33.56%)', final: 'inset(0% 66.2% 0% 0%)', duration: 0.32 },
  { initial: 'inset(0% 33.56% 0% 66.44%)', final: 'inset(0% 33.3% 0% 33.3%)', duration: 0.31 },
  { initial: 'inset(0% 0% 0% 100%)', final: 'inset(0% 0% 0% 66.2%)', duration: 0.32 },
];

// Scroll pacing runway:
// Physical runway for opening slit reveal & horizontal cards (735vh distance)
// Plus 100vh for natural vertical scroll down to ClashNet (1:1 speed)
// Plus 65vh for crisp cloud rise over ClashNet (matching Hero's 60vh runway)
// Total scrollable distance = 735 + 100 + 65 = 900vh
// Plus 100vh initial sticky viewport = 1000vh total height
const OPENING_AND_CARDS_RUNWAY_VH = 735;
const CLASHNET_SCROLL_RUNWAY_VH = 100;
const CLOUD_TRANSITION_RUNWAY_VH = 65;
const SECTION_HEIGHT = `${OPENING_AND_CARDS_RUNWAY_VH + CLASHNET_SCROLL_RUNWAY_VH + CLOUD_TRANSITION_RUNWAY_VH + 100}vh`;

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
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Static full-screen white background behind card_background.webp
  const nextImageRef = useRef<HTMLDivElement>(null);

  // Memories entrance animation ref (left text + photo collage)
  const memoriesLayerRef = useRef<HTMLDivElement>(null);

  // Vertical scroll canvas ref (holds Memories on Screen 1 and ClashNet on Screen 2)
  const verticalCanvasRef = useRef<HTMLDivElement>(null);

  // ClashNet title ref (drifts upward during scroll)
  const clashnetTitleRef = useRef<HTMLHeadingElement>(null);

  // ClashNet cloud transition refs (rises synchronously with ClashNet title upward drift)
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);

  // Custom Cursor for Feature Cards
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const isHoveringCardRef = useRef(false);
  const lastMousePosRef = useRef({ x: -100, y: -100 });

  const handleCardLeave = () => {
    isHoveringCardRef.current = false;
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }
  };

  const handleCardEnter = (actionText?: string) => {
    isHoveringCardRef.current = true;
    setCursorText(actionText || 'View Events');
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.25,
        ease: 'back.out(1.5)',
        overwrite: 'auto',
      });
    }
  };

  const checkHoverState = () => {
    if (!isHoveringCardRef.current) return;
    const el = document.elementFromPoint(lastMousePosRef.current.x, lastMousePosRef.current.y);
    if (!el || !el.closest('.horizontal-scroll_panel')) {
      handleCardLeave();
    }
  };

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      autoAlpha: 0,
      force3D: true,
    });

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleScroll = () => {
      checkHoverState();
    };

    const handleMouseLeaveWindow = () => {
      handleCardLeave();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    // Preload & pre-decode images into GPU VRAM to prevent on-the-fly texture allocation hitch
    const preImg = new Image();
    preImg.src = '/images/card_background.webp';
    if (preImg.decode) preImg.decode().catch(() => { });

    const finalBgImg = new Image();
    finalBgImg.src = '/images/memory_background.webp';
    if (finalBgImg.decode) finalBgImg.decode().catch(() => { });

    // Pre-decode all card images so they don't hitch the GPU when sliding into the viewport
    CARDS.forEach((card) => {
      const cImg = new Image();
      cImg.src = card.image;
      if (cImg.decode) cImg.decode().catch(() => { });
    });

    const ctx = gsap.context(() => {
      // ── Initial States ──────────────────────────────────────────────
      gsap.set(slitsContainerRef.current, { x: 0, autoAlpha: 1, transformOrigin: 'center center', force3D: true });
      slitElementsRef.current.forEach((el, i) => {
        if (el && SLITS[i]) gsap.set(el, { clipPath: SLITS[i].initial, force3D: true });
      });

      // White background stays behind card_background.webp; initially hidden so mountain scene is visible
      if (nextImageRef.current) {
        gsap.set(nextImageRef.current, { opacity: 0 });
      }

      // Vertical canvas starts at top
      if (verticalCanvasRef.current) {
        gsap.set(verticalCanvasRef.current, { y: 0, force3D: true });
      }

      // Initialize ClashNet title state (0 blur, 0 yPercent) matching Hero's DISCOVER
      if (clashnetTitleRef.current) {
        gsap.set(clashnetTitleRef.current, { yPercent: 0, y: 0, filter: 'blur(0px)', force3D: true });
      }

      // Initialize clouds completely off-screen below the viewport (ZERO clouds visible at start, matching Hero)
      gsap.set([cloud1Ref.current, cloud2Ref.current], { autoAlpha: 0, yPercent: 100, y: 0, force3D: true });

      // Memories layer starts off-screen to the right inside the vertical canvas
      if (memoriesLayerRef.current) {
        gsap.set(memoriesLayerRef.current, { x: () => window.innerWidth, autoAlpha: 0, force3D: true });
      }

      // Track starts completely off-screen to the right
      gsap.set(track, { x: '100vw', force3D: true });
      if (polarTextRef.current) {
        gsap.set(polarTextRef.current, { y: () => window.innerHeight * 0.88, force3D: true });
      }

      // Expand the opening scene as the section rises into the viewport;
      // transitions smoothly using GPU-accelerated scale once it reaches top top.
      if (mountainRef.current) {
        gsap.fromTo(
          mountainRef.current,
          {
            scale: 0.94,
          },
          {
            scale: 1,
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
          scrub: true,
          invalidateOnRefresh: true,
          onLeave: () => handleCardLeave(),
          onLeaveBack: () => handleCardLeave(),
        },
      });

      // ── Slit Reveal Trigger & Timing Controls ────────────────────────
      // SLIT_START_FACTOR: Controls when the slit reveal begins.
      // Decrease this number to trigger earlier (e.g. 0.14, 0.18); increase to delay (default was 0.25):
      const SLIT_START_FACTOR = 0.22;

      // Ratio to preserve exact physical pixel pacing of opening and cards:
      const totalScrollableDistance = OPENING_AND_CARDS_RUNWAY_VH + CLASHNET_SCROLL_RUNWAY_VH + CLOUD_TRANSITION_RUNWAY_VH;
      const SCROLL_SCALE = 1050 / totalScrollableDistance;

      const OPENING_RATIO = (315 / 1156) * SCROLL_SCALE;
      const OPENING_START = OPENING_RATIO * (SLIT_START_FACTOR / 0.508);
      const OPENING_DURATION = OPENING_RATIO * (0.32 / 0.508);

      // Opening scene subtle depth drift
      if (mountainImageRef.current) {
        tl.fromTo(
          mountainImageRef.current,
          { scale: 1.03 },
          { scale: 1.01, ease: 'none', duration: OPENING_START, force3D: true },
          0
        );
      }

      // Slits expand leftward at constant speed immediately as text exits
      SLITS.forEach((slit, i) => {
        const el = slitElementsRef.current[i];
        if (!el) return;
        tl.fromTo(
          el,
          { clipPath: slit.initial },
          { clipPath: slit.final, ease: 'none', duration: OPENING_DURATION },
          OPENING_START
        );
      });

      // As the far right slit crosses ~1400px, the card track slides in
      const cardTriggerPoint = OPENING_START + OPENING_DURATION * 0.806;
      const TRACK_END = 0.70 * SCROLL_SCALE;

      // ══════════════════════════════════════════════════════════════════
      // ── Transition & Speed Controls (Adjust manually here) ────────────
      // ══════════════════════════════════════════════════════════════════

      // Measure Tools card position inside track; calibrated to sit behind around 75% of the Tools card:
      const toolsCard = track.querySelector('#tools') as HTMLElement;
      const toolsTargetOffset = toolsCard
        ? (toolsCard.offsetLeft + toolsCard.offsetWidth * 0.75)
        : (window.innerWidth * 0.96);

      // Mathematical relationship:
      // REVEAL_START triggers so the background wipe boundary stays fixed behind ~75% of the Tools card:
      const k = toolsTargetOffset / window.innerWidth;
      const REVEAL_START = (cardTriggerPoint + k * TRACK_END) / (1 + k);

      // Duration for card_background.webp to cross the screen:
      const bgDuration = TRACK_END - REVEAL_START;

      // Exact 1:1 speed matching between Tools card and the background image:
      const bgSpeed = window.innerWidth / bgDuration;

      // BOOST POSITION: Tools and background image speed is the SAME for 70% of time:
      const BOOST_POSITION = 0.70;
      const SPEED_BOOST_TIME = REVEAL_START + bgDuration * BOOST_POSITION;

      // Stage 1 (cardTriggerPoint -> SPEED_BOOST_TIME): Tools and background travel at identical speed, locked together
      const stage1Duration = SPEED_BOOST_TIME - cardTriggerPoint;
      const stage1Distance = bgSpeed * stage1Duration;
      const midPointX = window.innerWidth - stage1Distance;

      // Stage 2 (Remaining 30% of time): Tools accelerates and goes first
      const totalTrackDist = track.scrollWidth + window.innerWidth * 1.1;
      const stage2RemainingDistance = Math.max(totalTrackDist - stage1Distance, track.scrollWidth * 0.25);
      const stage2Duration = Math.max(bgDuration * (1.0 - BOOST_POSITION), 0.01);

      // Stage 1: Steady speed 1:1 synchronized with the background image (fixed with Tools)
      tl.fromTo(
        track,
        { x: () => window.innerWidth },
        {
          x: () => midPointX,
          ease: 'none',
          duration: stage1Duration,
          force3D: true,
          immediateRender: false,
        },
        cardTriggerPoint
      );

      // Stage 2 (SPEED_BOOST_TIME -> exit): Rest 30% of time, Tools accelerates and clears first
      tl.to(
        track,
        {
          x: () => -(track.scrollWidth + window.innerWidth * 0.1),
          ease: 'none',
          duration: stage2Duration,
          force3D: true,
        },
        SPEED_BOOST_TIME
      );

      // Activate pure white background behind card_background.webp ahead of the wipe
      if (nextImageRef.current) {
        tl.set(nextImageRef.current, { opacity: 1 }, REVEAL_START - 0.05);
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

      // ── Quote Entrance (glides from right to left as card background finishes closing) ──
      // Triggers when the card section is about 75% closed, arriving in the middle as the card background is completely gone:
      const MEMORIES_START = REVEAL_START + bgDuration * 0.50;
      const memoriesEntranceDuration = TRACK_END - MEMORIES_START;

      if (memoriesLayerRef.current) {
        tl.set(memoriesLayerRef.current, { autoAlpha: 1 }, MEMORIES_START);
        tl.fromTo(
          memoriesLayerRef.current,
          { x: () => window.innerWidth },
          {
            x: 0,
            ease: 'none',
            duration: memoriesEntranceDuration,
            force3D: true,
          },
          MEMORIES_START
        );
      }

      // ── Natural vertical scroll down to ClashNet (1:1 speed matching website scroll) ──
      // Starts immediately as soon as the Memories section and images take their place (stop moving):
      const VERTICAL_SCROLL_START = MEMORIES_START + memoriesEntranceDuration;
      const VERTICAL_SCROLL_DURATION = CLASHNET_SCROLL_RUNWAY_VH / totalScrollableDistance;
      const TIMELINE_END = 1.0;

      if (verticalCanvasRef.current) {
        tl.fromTo(
          verticalCanvasRef.current,
          { y: 0 },
          {
            y: () => -window.innerHeight,
            ease: 'none',
            duration: VERTICAL_SCROLL_DURATION,
            force3D: true,
          },
          VERTICAL_SCROLL_START
        );
        tl.set({}, {}, TIMELINE_END);
      }

      // ClashNet title & clouds transition matching Hero's DISCOVER exactly
      const clashnetArrival = VERTICAL_SCROLL_START + VERTICAL_SCROLL_DURATION;
      const transitionDuration = TIMELINE_END - clashnetArrival;

      // "CLASHNET" title: drifts upward as clouds rise, with subtle softening matching Hero's DISCOVER
      if (clashnetTitleRef.current) {
        tl.fromTo(
          clashnetTitleRef.current,
          { yPercent: 0, opacity: 0.28, filter: 'blur(0px)' },
          {
            yPercent: -90,
            opacity: 0.25,
            filter: 'blur(5px)',
            ease: 'power1.out',
            duration: transitionDuration,
            force3D: true,
          },
          clashnetArrival
        );
      }

      // Cloud layers reveal and rise over ClashNet matching Hero cloud speeds
      tl.set([cloud1Ref.current, cloud2Ref.current], { autoAlpha: 1 }, clashnetArrival);

      // Cloud 2: dense organic cloud bank rises up to fill the viewport (stops at yPercent 0 so clouds STAY visible)
      if (cloud2Ref.current) {
        tl.fromTo(
          cloud2Ref.current,
          { yPercent: 100, y: 0 },
          {
            yPercent: 0,
            y: 0,
            ease: 'none',
            duration: transitionDuration,
            force3D: true,
          },
          clashnetArrival
        );
      }

      // Cloud 1: foreground wisps rise faster for multi-layered 3D depth
      if (cloud1Ref.current) {
        tl.fromTo(
          cloud1Ref.current,
          { yPercent: 100, y: 0 },
          {
            yPercent: -15,
            y: 0,
            ease: 'none',
            duration: transitionDuration,
            force3D: true,
          },
          clashnetArrival
        );
      }



      // Inner image parallax (images move slightly less than the card = depth effect)
      imgRefs.current.forEach((imgWrap) => {
        if (!imgWrap) return;
        tl.fromTo(
          imgWrap,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            duration: TRACK_END - cardTriggerPoint,
            immediateRender: false,
          },
          cardTriggerPoint
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
      onMouseLeave={handleCardLeave}
      className="relative w-full"
      style={{ height: SECTION_HEIGHT }}
    >
      {/* ── Custom Floating Cursor on Card Hover ──────────────────── */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100]
                   hidden md:inline-flex items-center gap-1.5
                   text-white font-montserrat font-bold text-[11px] tracking-[0.22em] uppercase
                   drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] select-none will-change-transform"
      >
        <span>{cursorText}</span>
        {cursorText === 'Coming Soon' ? (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        ) : (
          <span className="text-amber-400 text-sm font-normal leading-none">+</span>
        )}
      </div>

      {/* ── Sticky Viewport ──────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-white"
        style={{ background: '#ffffff' }}
      >
        {/* ── Layer A: Mountain Hero (frames 1 & 2) ──────────────────── */}
        <div
          ref={mountainRef}
          className="absolute inset-0 z-10 will-change-transform"
        >
          <div className="relative w-full h-full overflow-hidden">
            <img
              ref={mountainImageRef}
              src="/images/whats-new-background.webp"
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

        {/* ── Final Page: Memory Background (revealed behind card_background.webp) ── */}
        <div
          ref={nextImageRef}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{ zIndex: 15, opacity: 0 }}
        >
          {/* Background image */}
          <img
            src="/images/memory_background.webp"
            alt="Memory background"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />

          {/* Subtle cinematic vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* ── Layer B: Multi-Column Slit Reveal (card_background.webp) ────────────── */}
        <div
          ref={slitsContainerRef}
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {SLITS.map((slit, i) => (
            <div
              key={i}
              ref={(el) => { slitElementsRef.current[i] = el; }}
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{
                clipPath: slit.initial,
                transform: 'translate3d(0,0,0)',
                willChange: 'clip-path',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src="/images/card_background.webp"
                alt="Revealed background"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                style={{ transform: 'translate3d(0,0,0)' }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ── Layer C: Vertical Scroll Canvas (Memories -> ClashNet on single background) ── */}
        <div
          ref={verticalCanvasRef}
          className="absolute inset-0 w-full h-[200vh] pointer-events-none will-change-transform"
          style={{ zIndex: 25, transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Screen 1 (top: 0): Community Quote */}
          <div
            ref={memoriesLayerRef}
            className="absolute top-0 left-0 w-full h-screen pointer-events-none overflow-hidden flex items-center justify-center px-6 sm:px-12 md:px-20 lg:px-32 will-change-transform"
            style={{ transform: 'translate3d(100vw, 0, 0)', opacity: 0 }}
          >
            <div className="relative max-w-4xl mx-auto text-center pointer-events-auto select-none">
              {/* Decorative quotation mark */}
              <div className="font-cormorant text-amber-400/40 text-7xl sm:text-8xl md:text-9xl leading-none select-none mb-2">
                “
              </div>

              {/* Quote Statement */}
              <blockquote className="font-cormorant italic font-normal text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.3] tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] -mt-8 sm:-mt-10 mb-6">
                “Don't be like a Queen who keeps hitting walls and fails to discover what's new in the community. Discover new creators and events and make memories that last long after the battle ends.”
              </blockquote>

              {/* Sub-label */}
              <div className="inline-flex items-center gap-3">
                <span className="w-8 sm:w-12 h-[1px] bg-white/30" />
                <span className="font-montserrat font-bold text-[10px] sm:text-xs text-white/70 tracking-[0.28em] uppercase">
                  ClashNet Community
                </span>
                <span className="w-8 sm:w-12 h-[1px] bg-white/30" />
              </div>
            </div>
          </div>

          {/* Screen 2 (top: 100vh): Big CLASHNET Title with transparent see-through styling */}
          <div
            className="absolute top-[100vh] left-0 w-full h-screen pointer-events-none overflow-hidden flex items-center justify-center select-none"
          >
            <h2
              ref={clashnetTitleRef}
              className="font-bebas font-normal uppercase text-white/[0.28] tracking-[0.03em] leading-none text-center select-none
                         text-[18vw] sm:text-[19vw] md:text-[20vw] lg:text-[21vw] w-full will-change-[transform,filter]"
            >
              CLASHNET
            </h2>
          </div>
        </div>

        {/* ── Layer C2: ClashNet Cloud Transition Layers (synchronized with ClashNet title) ── */}
        {/* Cloud 2 (main dense cloud bank with organic billowy silhouettes matching Hero) */}
        <div
          ref={cloud2Ref}
          data-clashnet-cloud="2"
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
          style={{ zIndex: 28 }}
        >
          {/* Smooth white backing gradient behind the clouds matching Hero */}
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

          {/* White extension below clouds seamlessly continuing pure white into Contact matching Hero */}
          <div className="absolute top-[calc(100%-2px)] left-0 w-full h-[60vh] bg-white pointer-events-none" />
        </div>

        {/* Cloud 1 (foreground cloud wisps with parallax depth matching Hero) */}
        <div
          ref={cloud1Ref}
          data-clashnet-cloud="1"
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
          style={{
            zIndex: 29,
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
              id={`card-${card.id}`}
              data-card-id={card.id}
              onMouseEnter={() => handleCardEnter(card.actionText)}
              onMouseLeave={handleCardLeave}
              onClick={() => {
                if (!card.isComingSoon) {
                  const lenis = (window as any).__lenis;
                  if (lenis) lenis.scrollTo(0, { immediate: true });
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  window.location.hash = card.id;
                }
              }}
              className="horizontal-scroll_panel relative flex-shrink-0 overflow-hidden rounded-xl
                         border border-white/30
                         shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_0_12px_rgba(255,255,255,0.06)]
                         flex flex-col justify-between
                         p-7 md:p-8 text-white group opacity-100
                         md:cursor-none md:[&_*]:cursor-none"
              style={{
                width: 'clamp(310px, 36vw, 560px)',
                height: 'clamp(390px, 63vh, 620px)',
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

              {/* Middle: Status badge (if Coming Soon) */}
              {card.isComingSoon && (
                <div data-panel-action className="relative z-10 self-start">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-400/40 font-montserrat font-bold text-[10px] tracking-[0.22em] uppercase text-amber-300">
                    Coming Soon
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </span>
                </div>
              )}

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

