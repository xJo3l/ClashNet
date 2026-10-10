import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface Point {
  x: number;
  y: number;
}

const AMBER_PALETTE = ['#f59e0b', '#fbbf24', '#fde047', '#d97706', '#fef08a'];

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
    const mouse = { x: -100, y: -100, prevX: -100, prevY: -100, speed: 0 };
    let isVisible = false;
    let isHoveringInteractive = false;
    let isCardHovered = false;

    // Trailing nodes for fluid comet ribbon trail (longer trail for silky flow)
    const TRAIL_LENGTH = 20;
    const trail: Point[] = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }));

    // Floating spark particles
    const particles: Particle[] = [];

    const addSparks = (x: number, y: number, count: number, speedMult = 1, flowVx = 0, flowVy = 0) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 1.5 + 0.3) * speedMult;
        particles.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: flowVx * 0.12 + Math.cos(angle) * speed,
          vy: flowVy * 0.12 + Math.sin(angle) * speed - 0.15,
          size: Math.random() * 2.2 + 0.8,
          color: '#ffffff',
          alpha: 0.95,
          decay: Math.random() * 0.025 + 0.016,
        });
      }
    };

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

        // Ensure element and its parent containers are rendered and visible (e.g. not autoAlpha: 0)
        let isVis = true;
        let curr: HTMLElement | null = img;
        while (curr && curr !== document.body && curr !== document.documentElement) {
          const s = window.getComputedStyle(curr);
          if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) < 0.05) {
            isVis = false;
            break;
          }
          curr = curr.parentElement;
        }
        if (!isVis) continue;

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
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      mouse.speed = Math.hypot(dx, dy);

      const target = e.target as HTMLElement | null;
      if (target) {
        // Hide if over card with dedicated card cursor
        isCardHovered = !!target.closest('.horizontal-scroll_panel');

        // Check for clickable/interactive elements
        isHoveringInteractive = !!target.closest(
          'a, button, [role="button"], input, textarea, select, .cursor-pointer, [data-interactive]'
        );
      }

      // Check whether current point is over clouds or white backgrounds
      const isLight = checkIsOverWhiteOrCloud(mouse.x, mouse.y);
      targetTone = isLight ? 0 : 1;

      // Prevent initial streak when cursor first enters screen
      if (mouse.prevX === -100) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          trail[i].x = mouse.x;
          trail[i].y = mouse.y;
        }
      }

      // If moving and not over card, emit micro sparks drifting naturally in the wake
      if (!isCardHovered && mouse.speed > 2 && Math.random() > 0.3) {
        addSparks(mouse.x, mouse.y, 1, 0.6, -dx, -dy);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (isCardHovered) return;
      // Burst of sparks on click
      addSparks(e.clientX, e.clientY, 10, 2.0);
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    const onMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
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

      // Smoothly update trailing nodes (fluid liquid ribbon physics)
      if (isVisible && !isCardHovered) {
        // Soft, fluid follow for head node
        trail[0].x += (mouse.x - trail[0].x) * 0.46;
        trail[0].y += (mouse.y - trail[0].y) * 0.46;

        // Progressive fluid drag: tip moves smoothly, tail undulates with natural wave lag
        for (let i = 1; i < TRAIL_LENGTH; i++) {
          const leader = trail[i - 1];
          const follower = trail[i];
          const factor = 0.45 - (i / TRAIL_LENGTH) * 0.22;
          follower.x += (leader.x - follower.x) * factor;
          follower.y += (leader.y - follower.y) * factor;
        }

        // Draw silky smooth curved ribbon using midpoint quadratic Bezier splines
        const midPoints: Point[] = [];
        for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
          midPoints.push({
            x: (trail[i].x + trail[i + 1].x) * 0.5,
            y: (trail[i].y + trail[i + 1].y) * 0.5,
          });
        }

        for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
          const progress = 1 - i / (TRAIL_LENGTH - 1); // 1 at head, 0 at tail
          const lineWidth = Math.max(0.6, progress * 6.5);
          const alpha = Math.pow(progress, 0.85) * 0.78;

          const start = i === 0 ? trail[0] : midPoints[i - 1];
          const control = trail[i];
          const end = i === TRAIL_LENGTH - 2 ? trail[TRAIL_LENGTH - 1] : midPoints[i];

          // Outer glowing body
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
          ctx.strokeStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();

          // Luminous inner core
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
          ctx.strokeStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha * 0.95})`;
          ctx.lineWidth = lineWidth * 0.42;
          ctx.stroke();
        }

      }

      // Update and draw floating spark particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        ctx.shadowColor = `rgba(${gray}, ${gray}, ${gray}, 0.35)`;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
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
