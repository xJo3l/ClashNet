import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse state
    const mouse = { x: -100, y: -100, prevX: -100 };
    let isVisible = false;
    let isCardHovered = false;

    // Simple trailing comet nodes (8 nodes for a sleek, lightweight trail)
    const TRAIL_LENGTH = 8;
    const trail: Point[] = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }));

    let animationFrameId: number;

    // Tone interpolation: 1 = pure white (dark scenes), 0 = pure black (clouds / white backgrounds)
    let currentTone = 1;
    let targetTone = 1;

    const checkIsOverWhiteOrCloud = (x: number, y: number): boolean => {
      // Out of bounds defaults to white
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        return false;
      }

      // 1. Footer is dark (#090a0f) -> Always white cursor
      const footerEl = document.querySelector('footer');
      if (footerEl) {
        const fRect = footerEl.getBoundingClientRect();
        if (y >= fRect.top && y <= fRect.bottom && x >= fRect.left && x <= fRect.right) {
          return false;
        }
      }

      // 2. Check Creators page (#creators, [data-page="creators"], or route) -> Black cursor
      const creatorsEl = document.getElementById('creators') || document.querySelector('[data-page="creators"]');
      if (creatorsEl || window.location.hash === '#creators') {
        return true;
      }

      // 2. Check Contact section (#contact) -> Black cursor
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const cRect = contactEl.getBoundingClientRect();
        if (cRect.bottom > 0 && cRect.top < window.innerHeight) {
          if (y >= cRect.top && y <= cRect.bottom && x >= cRect.left && x <= cRect.right) {
            return true;
          }
        }
      }

      // 3. Check About section (#about) -> Black cursor
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        const aRect = aboutEl.getBoundingClientRect();
        if (aRect.bottom > 0 && aRect.top < window.innerHeight) {
          if (y >= aRect.top + 30 && y <= aRect.bottom && x >= aRect.left && x <= aRect.right) {
            return true;
          }
        }
      }

      // 4. Check Cloud overlays & rising cloud transitions -> Black cursor
      const cloudImgs = document.querySelectorAll<HTMLImageElement>('img[src*="cloud"]');
      for (let i = 0; i < cloudImgs.length; i++) {
        const img = cloudImgs[i];

        // Quickly check if element is visually rendered without costly getComputedStyle in loop
        if (img.offsetParent === null) continue;
        const parent = img.parentElement;
        if (parent && (parent.style.visibility === 'hidden' || parent.style.opacity === '0')) continue;

        const rect = img.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;

        // The cloud billows start ~40px below the image top edge and extend through the white backing layer below
        if (y >= rect.top + 40 && y <= rect.bottom + 400 && x >= rect.left && x <= rect.right) {
          return true;
        }
      }

      // Default: White cursor for Hero mountains, dark cards, clifftop tower, footer, etc.
      return false;
    };

    const onMouseMove = (e: MouseEvent) => {
      isVisible = true;
      mouse.prevX = mouse.x;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target) {
        // Hide if over card with dedicated card cursor
        isCardHovered = !!target.closest('.horizontal-scroll_panel');
      }

      // Prevent initial streak when cursor first enters screen
      if (mouse.prevX === -100) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trail[i].x = mouse.x;
          trail[i].y = mouse.y;
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    const onMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update tone during scroll / animations in real time
      if (isVisible && mouse.x >= 0 && mouse.y >= 0) {
        const isLight = checkIsOverWhiteOrCloud(mouse.x, mouse.y);
        targetTone = isLight ? 0 : 1;
      }

      // Smoothly interpolate tone: 1 = pure white, 0 = pure black
      currentTone += (targetTone - currentTone) * 0.18;
      const gray = Math.round(currentTone * 255);

      // Simple, smooth trailing comet tail
      if (isVisible && !isCardHovered && mouse.x >= 0) {
        // Head follows mouse directly with gentle easing
        trail[0].x += (mouse.x - trail[0].x) * 0.6;
        trail[0].y += (mouse.y - trail[0].y) * 0.6;

        // Trailing nodes follow with smooth progressive lag
        for (let i = 1; i < TRAIL_LENGTH; i++) {
          trail[i].x += (trail[i - 1].x - trail[i].x) * 0.45;
          trail[i].y += (trail[i - 1].y - trail[i].y) * 0.45;
        }

        // Draw clean, smooth tapered line
        for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
          const p1 = trail[i];
          const p2 = trail[i + 1];
          const progress = 1 - i / (TRAIL_LENGTH - 1);
          const lineWidth = Math.max(0.8, progress * 4.5);
          const alpha = progress * 0.75;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hidden md:block pointer-events-none fixed inset-0 z-[9999] select-none"
      style={{ transform: 'translateZ(0)' }}
    />
  );
};

export default CustomCursor;
