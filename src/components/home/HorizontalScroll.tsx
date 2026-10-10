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

interface MemoryItem {
  id: number;
  image: string;
  className: string;
  alt: string;
}

const MEMORY_GALLERY: MemoryItem[] = [
  // top-left -> event (higher, tilted out)
  {
    id: 1,
    image: 'https://yt3.ggpht.com/vdbD_yhCOrZpa_M1FrsYZ0ke9wIclz3F6n5L_N4rnLYMQVji4FPdfErKQx7WsP1Y66737bm-6u9i=s640-c-fcrop64=1,00000000ffff9fff-rw-nd-v1',
    className: 'top-[11%] left-[43%] w-[140px] md:w-[170px] lg:w-[205px] -rotate-[14deg] z-10 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Tournament clash',
  },
  // top-middle -> creator (dipped down towards center)
  {
    id: 2,
    image: 'https://yt3.ggpht.com/ZPNgmBDptzkU8TsYnb9Z5GBLCg2E5IFzRiqC3ntst2VPkHAULxsBqFCndhadT5H9zaq0_EyiPRwX=s640-c-fcrop64=1,38000000c7ffffff-rw-nd-v1',
    className: 'top-[18%] left-[58%] w-[160px] md:w-[195px] lg:w-[235px] rotate-[13deg] z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Creator showcase',
  },
  // top-right -> hero (lifted higher right)
  {
    id: 3,
    image: 'https://yt3.ggpht.com/Zv5Yc-MJ8YsvbPcQ8NkjbooMVFo6lE_AgCL7jEsmvcff7a5KUltco45Ipquw1rQnoHX5fKv_8_nevw=s640-c-fcrop64=1,0000199affffe666-rw-nd-v1',
    className: 'top-[12%] left-[74%] w-[175px] md:w-[210px] lg:w-[255px] -rotate-[9deg] z-10 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Hero clash',
  },
  // center -> hero community battle (anchors the collage, balanced size)
  {
    id: 4,
    image: 'https://yt3.ggpht.com/qvuhoQsq_FR_EYp_F-V-bWcM7sguNjzFxMjTTcvYuzXDJ4FykGmWQz5zqq2UnCIXk2HpfrSqpafyJg=s640-c-fcrop64=1,000025a6ffffda5a-rw-nd-v1',
    className: 'top-[34%] left-[54%] w-[235px] md:w-[285px] lg:w-[340px] -rotate-[3deg] z-30 shadow-[0_22px_50px_rgba(0,0,0,0.85)]',
    alt: 'Main community battle',
  },
  // left-middle -> strategy (pushed down-left)
  {
    id: 5,
    image: 'https://yt3.ggpht.com/U2aYi7vZYSaqSHpjZc0lGOuFCk0VAePvcHWAQ_yNOBL7W5vMYA5WyrsbWbPNdDXSC4nO2YyADpC2=s640-c-fcrop64=1,00001c29ffffc6d3-rw-nd-v1',
    className: 'top-[41%] left-[40%] w-[145px] md:w-[175px] lg:w-[215px] rotate-[11deg] z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'War matrix strategy',
  },
  // right-middle -> village peaks (tucked higher-right)
  {
    id: 6,
    image: 'https://yt3.ggpht.com/aRDkxY-CiRt0P3R_-DI0tphLbI6yiPL9hRAsj5MxV721kgZn0UwCkISZzkp_3d6oDvw8Hi6Zm9h-9Q=s640-c-fcrop64=1,00003000ffffcfff-rw-nd-v1',
    className: 'top-[29%] left-[73%] w-[155px] md:w-[185px] lg:w-[225px] -rotate-[14deg] z-10 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Village peaks',
  },
  // bottom-left -> community
  {
    id: 7,
    image: 'https://yt3.ggpht.com/d_S3to15h8x86D5dDKPbI9SYdA6xZo18TbUiWeAzg5GgIjYLxVtWt2N4n0wy5zYsCzmzSvTqgoDLRSo=s640-c-fcrop64=1,0000199affffe666-rw-nd-v1',
    className: 'top-[60%] left-[42%] w-[155px] md:w-[185px] lg:w-[225px] -rotate-[12deg] z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Community memories',
  },
  // bottom-middle -> clan wars (placed cleanly at the bottom without overlapping center card)
  {
    id: 8,
    image: 'https://i.redd.it/k4y8dmsvnq2c1.jpg',
    className: 'top-[71%] left-[57%] w-[170px] md:w-[200px] lg:w-[245px] rotate-[8deg] z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Clan wars memory',
  },
  // bottom-right -> victory (kicked out to bottom-right)
  {
    id: 9,
    image: 'https://yt3.ggpht.com/hU_EnKy0Ijd_3giN1jqa-Y8F66oWc7lvlaESpz88Aix7V7N6PC7dUnEx03mlHYfR4NzoaSdYgiLf=s640-c-fcrop64=1,00000000ffffffff-rw-nd-v1',
    className: 'top-[59%] left-[73%] w-[180px] md:w-[215px] lg:w-[260px] rotate-[15deg] z-20 shadow-[0_12px_28px_rgba(0,0,0,0.6)]',
    alt: 'Final victory',
  },
];

// ── Background Depth Layer Cards (Reduced to 4) ──
const BACKGROUND_MEMORY_GALLERY: MemoryItem[] = [
  {
    id: 101,
    image: 'https://yt3.ggpht.com/vq49TcZ5AAKQKRlUxNx7W0eZnUeMRlMwnoRKASxkoynlN17KZwT-bai6Vne9SwKeveSJEVfxSLmC=s632-c-fcrop64=1,2aab0000d555ffff-rw-nd-v1',
    className: 'top-[7%] left-[54%] w-[125px] md:w-[150px] lg:w-[175px] -rotate-[16deg] z-0 opacity-40 scale-95 shadow-md',
    alt: 'Background war matrix',
  },
  {
    id: 104,
    image: '/images/whats-new-background.jpg',
    className: 'top-[22%] left-[82%] w-[130px] md:w-[155px] lg:w-[185px] rotate-[18deg] z-0 opacity-35 scale-90 shadow-md',
    alt: 'Background scenery',
  },
  {
    id: 106,
    image: '/images/card-creators.jpg',
    className: 'top-[75%] left-[44%] w-[125px] md:w-[150px] lg:w-[175px] rotate-[14deg] z-0 opacity-35 scale-90 shadow-md',
    alt: 'Background clan memories',
  },
  {
    id: 107,
    image: '/images/hero-coc.webp',
    className: 'top-[61%] left-[78%] w-[135px] md:w-[160px] lg:w-[185px] -rotate-[12deg] z-0 opacity-35 scale-90 shadow-md',
    alt: 'Background hero battle',
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
// OPENING_RUNWAY_VH: Physical runway for intro & slit reveal (keeps it at current speed)
// CARD_RUNWAY_VH: Physical runway for horizontal card scroll (increase = cards move slower)
const OPENING_RUNWAY_VH = 315;
const CARD_RUNWAY_VH = 720;
const SECTION_HEIGHT = `${OPENING_RUNWAY_VH + CARD_RUNWAY_VH}vh`;

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

  // Static full-screen white background behind a.jpg
  const nextImageRef = useRef<HTMLDivElement>(null);

  // Memories entrance animation ref (left text + photo collage)
  const memoriesLayerRef = useRef<HTMLDivElement>(null);

  // Vertical scroll canvas ref (holds Memories on Screen 1 and ClashNet on Screen 2)
  const verticalCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    // Preload & pre-decode images into GPU VRAM to prevent on-the-fly texture allocation hitch
    const preImg = new Image();
    preImg.src = '/images/a.jpg';
    if (preImg.decode) preImg.decode().catch(() => { });

    const finalBgImg = new Image();
    finalBgImg.src = '/images/Clifftop Tower Beneath a Golden Sky.png';
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

      // White background stays behind a.jpg; initially hidden so mountain scene is visible
      if (nextImageRef.current) {
        gsap.set(nextImageRef.current, { opacity: 0 });
      }

      // Vertical canvas starts at top
      if (verticalCanvasRef.current) {
        gsap.set(verticalCanvasRef.current, { y: 0, force3D: true });
      }

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
      // transitions smoothly from padded frame to true 100% full-screen once it reaches top top.
      if (mountainRef.current) {
        gsap.fromTo(
          mountainRef.current,
          {
            paddingTop: '3vw',
            paddingBottom: '3vw',
            paddingLeft: '4vw',
            paddingRight: '4vw',
            scale: 0.96,
          },
          {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
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
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // ── Slit Reveal Trigger & Timing Controls ────────────────────────
      // SLIT_START_FACTOR: Controls when the slit reveal begins.
      // Decrease this number to trigger earlier (e.g. 0.14, 0.18); increase to delay (default was 0.25):
      const SLIT_START_FACTOR = 0.22;

      const OPENING_RATIO = OPENING_RUNWAY_VH / (OPENING_RUNWAY_VH + CARD_RUNWAY_VH);
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
      const TRACK_END = 0.70;

      // ══════════════════════════════════════════════════════════════════
      // ── Transition & Speed Controls (Adjust manually here) ────────────
      // ══════════════════════════════════════════════════════════════════

      // 1. START POINT: When the background transition begins (adjust multiplier e.g. 0.45, 0.47, 0.55):
      const REVEAL_START = cardTriggerPoint + (TRACK_END - cardTriggerPoint) * 0.47;

      // 2. Duration for a.jpg to cross the screen:
      const bgDuration = TRACK_END - REVEAL_START;

      // 3. BOOST POSITION: When speed increase triggers (0.50 = middle of screen, 0.40 = earlier, 0.60 = later):
      const BOOST_POSITION = 0.50;
      const SPEED_BOOST_TIME = REVEAL_START + bgDuration * BOOST_POSITION;

      // 4. SPEED BOOST FACTOR:
      // Controls how much the card speeds up from BOOST_POSITION (linear, never stops):
      const SPEED_BOOST = 1.50;

      // Calculation of durations to ensure seamless, continuous movement without stopping:
      const totalTrackDist = track.scrollWidth + window.innerWidth * 1.1;
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
          immediateRender: false,
        },
        cardTriggerPoint
      );

      // Stage 2 (SPEED_BOOST_TIME -> exit): directly transitions into boosted speed (NO zero-velocity freeze)
      tl.to(
        track,
        {
          x: () => -(track.scrollWidth + window.innerWidth * 0.1),
          ease: 'none', // linear boosted speed so the card never stops or delays
          duration: stage2Duration,
          force3D: true,
        },
        SPEED_BOOST_TIME
      );

      // Activate pure white background behind a.jpg ahead of the wipe
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

      // ── Memories Gallery entrance (glides from right to left after Tools card) ──
      // Starts when background wipe is halfway (SPEED_BOOST_TIME) and finishes at TRACK_END:
      const MEMORIES_START = SPEED_BOOST_TIME;
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

      // ── Natural vertical scroll down to ClashNet (single continuous background) ──
      const VERTICAL_SCROLL_START = 0.77;
      const VERTICAL_SCROLL_DURATION = 0.20; // 0.77 -> 0.97

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
      className="relative w-full"
      style={{ height: SECTION_HEIGHT }}
    >
      {/* ── Sticky Viewport ──────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-white"
        style={{ background: '#ffffff' }}
      >
        {/* ── Layer A: Mountain Hero (frames 1 & 2) ──────────────────── */}
        <div
          ref={mountainRef}
          className="absolute inset-0 z-10 will-change-[padding,transform]"
        >
          <div className="relative w-full h-full overflow-hidden">
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

        {/* ── Final Page: Clifftop Tower Background (revealed behind a.jpg) ── */}
        <div
          ref={nextImageRef}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{ zIndex: 15, opacity: 0 }}
        >
          {/* Background image */}
          <img
            src="/images/Clifftop Tower Beneath a Golden Sky.png"
            alt="Clifftop Tower Beneath a Golden Sky"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />

          {/* Subtle cinematic vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
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

        {/* ── Layer C: Vertical Scroll Canvas (Memories -> ClashNet on single background) ── */}
        <div
          ref={verticalCanvasRef}
          className="absolute inset-0 w-full h-[200vh] pointer-events-none will-change-transform"
          style={{ zIndex: 25, transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Screen 1 (top: 0): Memories Editorial & Collage Gallery */}
          <div
            ref={memoriesLayerRef}
            className="absolute top-0 left-0 w-full h-screen pointer-events-none overflow-hidden will-change-transform"
            style={{ transform: 'translate3d(100vw, 0, 0)', opacity: 0 }}
          >
            {/* Left Column: Editorial Info & Typography */}
            <div
              className="absolute left-[6%] md:left-[7%] lg:left-[8%] top-1/2 -translate-y-1/2 max-w-[480px] z-20 pointer-events-auto"
            >
              <h2 className="font-cormorant font-normal uppercase text-white tracking-[0.04em] leading-[0.92] text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_6px_28px_rgba(0,0,0,0.9)] mb-6">
                MEMORIES
              </h2>
              <p className="font-outfit text-sm sm:text-base md:text-lg text-white/85 leading-relaxed max-w-[440px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                Connect with fellow creators, find your community, compete in tournaments, and make memories that last long after the battle ends.
              </p>
            </div>

            {/* Right / Center: Floating Image Collage */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Depth Background Layer (4 cards) */}
              <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none select-none">
                {BACKGROUND_MEMORY_GALLERY.map((item) => (
                  <div
                    key={item.id}
                    className={`absolute rounded-md overflow-hidden ${item.className}`}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-auto block select-none pointer-events-none rounded-md"
                      draggable={false}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>

              {/* Foreground Sharp Interactive Cards */}
              <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
                {MEMORY_GALLERY.map((item) => (
                  <div
                    key={item.id}
                    className={`absolute rounded-md overflow-hidden transition-all duration-300 
                                hover:scale-105 hover:z-40 hover:shadow-2xl 
                                pointer-events-auto cursor-pointer ${item.className}`}
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/images/card-events.jpg';
                      }}
                      className="w-full h-auto block select-none pointer-events-none rounded-md"
                      draggable={false}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile / Tablet compact gallery strip */}
              <div className="lg:hidden absolute bottom-6 right-6 left-6 z-10 flex gap-3 overflow-x-auto no-scrollbar py-2 pointer-events-auto">
                {MEMORY_GALLERY.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-36 sm:w-48 rounded-md overflow-hidden shadow-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-auto block rounded-md"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Screen 2 (top: 100vh): Big CLASHNET Title with transparent see-through styling */}
          <div
            className="absolute top-[100vh] left-0 w-full h-screen pointer-events-none overflow-hidden flex items-center justify-center select-none"
          >
            <h2
              className="font-bebas font-normal uppercase text-white/[0.28] tracking-[0.03em] leading-none text-center select-none
                         text-[18vw] sm:text-[19vw] md:text-[20vw] lg:text-[21vw] w-full"
            >
              CLASHNET
            </h2>
          </div>
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
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-400/40 font-montserrat font-bold text-[10px] tracking-[0.22em] uppercase text-amber-300">
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

