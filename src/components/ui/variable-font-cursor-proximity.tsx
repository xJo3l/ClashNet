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
    let frame = 0;
    let pointer = { x: -10000, y: -10000 };

    const render = () => {
      glyphs.forEach((glyph) => {
        const rect = glyph.getBoundingClientRect();
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - distance / radius);
        const eased = proximity * proximity * (3 - 2 * proximity);

        // Build interpolated font-variation-settings
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
      frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') pointer = { x: event.clientX, y: event.clientY };
    };
    const onLeave = () => { pointer = { x: -10000, y: -10000 }; };

    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
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
