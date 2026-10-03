import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      className="relative min-h-screen w-full bg-cover bg-center overflow-hidden flex flex-col justify-end items-center"
      style={{ backgroundImage: "url('/images/hero-coc.webp')" }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Big text bottom middle, constrained between 328px and 1591px grid lines */}
      <div
        className="relative z-10 mx-auto text-center leading-none select-none pointer-events-none flex justify-center items-end"
        style={{
          width: `${((1647 - 328) / 1919) * 100}%`,
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
            className="font-bebas"
            style={{
              fontSize: '240px',
              letterSpacing: '0.04em',
            }}
          >
            DISCOVER
          </text>
        </svg>
      </div>
    </section>
  );
};

