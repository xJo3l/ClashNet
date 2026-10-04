import React from 'react';

/**
 * Full-page vertical grid overlay
 * Preserves proportional structure matching the 1919px reference viewport:
 * 13px (0.68%), 65px (3.39%), 328px (17.09%), 644px (33.56%), 
 * 960px (50.0%), 1275px (66.44%), 1591px (82.91%), 1855px (96.61%), 1907px (99.32%)
 * Content columns (~316px each at 1919px): 328-644, 644-960, 960-1275, 1275-1591
 */
const VERTICAL_LINE_PERCENTAGES = [
  (13 / 1919) * 100,    // ~0.677%
  (65 / 1919) * 100,    // ~3.387%
  (328 / 1919) * 100,   // ~17.092%
  (644 / 1919) * 100,   // ~33.559%
  (960 / 1919) * 100,   // ~50.026%
  (1275 / 1919) * 100,  // ~66.441%
  (1591 / 1919) * 100,  // ~82.908%
  (1855 / 1919) * 100,  // ~96.665%
  (1907 / 1919) * 100,  // ~99.375%
];

export const GridOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[60] w-full h-full overflow-hidden"
    >
      {VERTICAL_LINE_PERCENTAGES.map((percent, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0 w-[1px] bg-neutral-400/40"
          style={{ left: `${percent}%` }}
        />
      ))}
    </div>
  );
};
