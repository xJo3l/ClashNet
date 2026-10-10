import React, { useEffect, useRef } from 'react';

type VariableFontCursorProximityProps = {
  children: string;
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  fromFontVariationSettings?: string;
  radius?: number;
  toFontVariationSettings?: string;
};

/** Parse font variation settings string into a map of axis -> value */
function parseVariationSettings(settings: string): Record<string, number> {
  const map: Record<string, number> = {};
  const regex = /'([^']+)'\s+([\d.+-]+)/g;
  let match;
  while ((match = regex.exec(settings)) !== null) {
    map[match[1]] = parseFloat(match[2]);
  }
  return map;
}

/** Lerp between two values */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Adds a smooth, per-letter emphasis field around the pointer. */
export const VariableFontCursorProximity: React.FC<VariableFontCursorProximityProps> = ({
  children,
  className = '',
  containerRef,
  fromFontVariationSettings = "'wght' 100",
  radius = 80,
  toFontVariationSettings = "'wght' 900",
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const fromMap = parseVariationSettings(fromFontVariationSettings);
    const toMap = parseVariationSettings(toFontVariationSettings);
    const glyphs = Array.from(text.querySelectorAll<HTMLElement>('[data-glyph]'));
    let frameId: number | null = null;
    let isHovering = false;

    const defaultSettings = Object.keys(fromMap)
      .map((axis) => `'${axis}' ${(fromMap[axis] ?? 0).toFixed(2)}`)
      .join(', ');

    // ── Cached relative offsets inside text container: only recomputed on resize ──
    type GlyphOffset = { ox: number; oy: number };
    let cachedOffsets: GlyphOffset[] = [];
    let offsetsDirty = true;

    const buildOffsetCache = () => {
      const textRect = text.getBoundingClientRect();
      cachedOffsets = glyphs.map((glyph) => {
        const r = glyph.getBoundingClientRect();
        return {
          ox: r.left + r.width / 2 - textRect.left,
          oy: r.top + r.height / 2 - textRect.top,
        };
      });
      offsetsDirty = false;
    };

    const invalidateOffsets = () => {
      offsetsDirty = true;
    };

    const updateGlyphs = (clientX: number, clientY: number) => {
      if (offsetsDirty || cachedOffsets.length !== glyphs.length) buildOffsetCache();
      const textRect = text.getBoundingClientRect();

      glyphs.forEach((glyph, i) => {
        const offset = cachedOffsets[i];
        if (!offset) return;
        const cx = textRect.left + offset.ox;
        const cy = textRect.top + offset.oy;
        const distance = Math.hypot(clientX - cx, clientY - cy);

        if (distance > radius) {
          glyph.style.fontVariationSettings = defaultSettings;
          return;
        }

        const proximity = Math.max(0, 1 - distance / radius);
        const eased = proximity * proximity * (3 - 2 * proximity);

        const axes = Object.keys(fromMap);
        const interpolated = axes
          .map((axis) => {
            const from = fromMap[axis] ?? 0;
            const to = toMap[axis] ?? from;
            const value = lerp(from, to, eased);
            return `'${axis}' ${value.toFixed(2)}`;
          })
          .join(', ');

        glyph.style.fontVariationSettings = interpolated;
      });
    };

    const resetGlyphs = () => {
      glyphs.forEach((glyph) => {
        glyph.style.fontVariationSettings = defaultSettings;
      });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      isHovering = true;
      const { clientX, clientY } = event;

      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (isHovering) updateGlyphs(clientX, clientY);
      });
    };

    const onLeave = () => {
      isHovering = false;
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      resetGlyphs();
    };

    // Invalidate cache only on resize, not on scroll
    const ro = new ResizeObserver(invalidateOffsets);
    ro.observe(container);

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      ro.disconnect();
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, [containerRef, radius, fromFontVariationSettings, toFontVariationSettings]);

  return (
    <span ref={textRef} className={className}>
      {children.split(/(\s+)/).map((part, wordIndex) => (
        /\s+/.test(part) ? (
          <span aria-hidden="true" className="about-proximity-space" key={`space-${wordIndex}`}>
            {'\u00a0'.repeat(part.length)}
          </span>
        ) : (
          <span aria-hidden="true" className="about-proximity-word" key={`word-${wordIndex}`}>
            {Array.from(part).map((character, charIndex) => (
              <span
                data-glyph
                className="about-proximity-glyph"
                key={`${character}-${charIndex}`}
                style={{ display: 'inline-block', transition: 'font-variation-settings 0.1s ease' }}
              >
                {character}
              </span>
            ))}
          </span>
        )
      ))}
      <span className="sr-only">{children}</span>
    </span>
  );
};
