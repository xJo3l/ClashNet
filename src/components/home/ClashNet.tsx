import React from 'react';

export const ClashNet: React.FC = () => {
  return (
    <section
      id="clashnet-section"
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center bg-black select-none"
    >
      {/* Background Clifftop Image */}
      <img
        src="/images/Clifftop Tower Beneath a Golden Sky.png"
        alt="Clifftop Tower Beneath a Golden Sky"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        draggable={false}
      />

      {/* Subtle cinematic vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30 pointer-events-none" />

      {/* Centered Big CLASHNET Typography matching reference */}
      <h2
        className="relative z-10 font-bebas font-normal uppercase text-white/75 tracking-[0.02em] leading-none text-center drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]
                   text-[18vw] sm:text-[19vw] md:text-[20vw] lg:text-[21vw] w-full"
      >
        CLASHNET
      </h2>

      {/* Reference Sparkle Star (bottom right) */}
      <div className="absolute bottom-[10%] right-[7%] md:bottom-[12%] md:right-[8%] pointer-events-none select-none z-10">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 md:w-9 md:h-9 text-white/50 drop-shadow-[0_0_16px_rgba(255,255,255,0.45)]"
        >
          <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" />
        </svg>
      </div>
    </section>
  );
};

export default ClashNet;
