import React, { useRef } from 'react';
import { VariableFontCursorProximity } from '../ui/variable-font-cursor-proximity';

export const About: React.FC = () => {
  const aboutDesktopRef = useRef<HTMLDivElement>(null);
  return (
    <section
      id="about"
      className="relative w-full min-h-screen text-[#182337] selection:bg-rose-500 selection:text-white flex items-center justify-center overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.8) 20%, #ffffff 35%, #ffffff 100%)',
      }}
    >
      {/* Main About content container */}
      <div className="relative w-full py-12 md:py-16 my-auto z-10">
        {/* Desktop Layout: balanced width to prevent hover line wrap while maintaining editorial proportions */}
        <div
          ref={aboutDesktopRef}
          data-sc-in
          data-sc-stagger="70"
          className="relative z-10 hidden lg:flex flex-col items-start gap-8 pr-4"
          style={{
            marginLeft: `${(644 / 1919) * 100}%`,
            width: `${((1680 - 644) / 1919) * 100}%`,
          }}
        >
          {/* Small label: ClashNet on the right side of the 644px grid line */}
          <div className="about-label relative inline-flex items-center justify-center px-6 py-2 select-none -ml-4">
            {/* Hand-drawn sketchy elliptical loop SVG */}
            <svg
              viewBox="0 0 190 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -inset-x-8 -inset-y-3 w-[calc(100%+4rem)] h-[calc(100%+1.5rem)] pointer-events-none overflow-visible"
            >
              {/* Entry sketch line from left */}
              <path
                d="M2 42 C 28 42, 54 39, 82 34"
                stroke="#94a3b8"
                strokeWidth="0.85"
                strokeLinecap="round"
              />
              {/* Main tilted ellipse loop */}
              <ellipse
                cx="102"
                cy="30"
                rx="78"
                ry="21"
                transform="rotate(-11 102 30)"
                stroke="#94a3b8"
                strokeWidth="0.85"
              />
              {/* Secondary overlapping orbit trace */}
              <path
                d="M26 20 C 40 8, 142 10, 172 26 C 182 32, 164 46, 126 49 C 84 52, 34 42, 25 31"
                stroke="#94a3b8"
                strokeWidth="0.75"
              />
            </svg>

            <span className="relative z-10 font-cormorant italic font-normal text-lg xl:text-xl text-black tracking-wider">
              ClashNet
            </span>
          </div>

          {/* Main Statement: spans from 644px to 1591px in luxury Italiana editorial serif */}
          <h2 className="about-statement font-editorial font-normal text-[#182337] uppercase tracking-[0.012em] leading-[0.96] text-[2.85rem] lg:text-[3.1rem] xl:text-[3.65rem] 2xl:text-[4.2rem]">
            {/* Indented first line matching the editorial reference */}
            <span className="inline-block w-[14%] xl:w-[18%]" />
            <VariableFontCursorProximity
              className="about-proximity"
              containerRef={aboutDesktopRef}
              fromFontVariationSettings="'wght' 300"
              radius={150}
              toFontVariationSettings="'wght' 700"
            >
              A PLACE FOR CLASHERS TO DISCOVER WHAT’S NEW, FOLLOW THE META, FIND THE BEST BASES, AND STAY CONNECTED TO THE COMMUNITY.
            </VariableFontCursorProximity>
          </h2>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden w-full px-6 sm:px-12 md:px-16 flex flex-col items-start gap-8" data-sc-in data-sc-stagger="70">
          {/* Label with sketch loop */}
          <div className="about-label relative inline-flex items-center justify-center px-6 py-2 select-none self-start">
            <svg
              viewBox="0 0 190 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -inset-x-8 -inset-y-3 w-[calc(100%+4rem)] h-[calc(100%+1.5rem)] pointer-events-none overflow-visible"
            >
              <path
                d="M2 42 C 28 42, 54 39, 82 34"
                stroke="#94a3b8"
                strokeWidth="0.85"
                strokeLinecap="round"
              />
              <ellipse
                cx="102"
                cy="30"
                rx="78"
                ry="21"
                transform="rotate(-11 102 30)"
                stroke="#94a3b8"
                strokeWidth="0.85"
              />
              <path
                d="M26 20 C 40 8, 142 10, 172 26 C 182 32, 164 46, 126 49 C 84 52, 34 42, 25 31"
                stroke="#94a3b8"
                strokeWidth="0.75"
              />
            </svg>
            <span className="relative z-10 font-cormorant italic font-normal text-lg text-black tracking-wider">
              ClashNet
            </span>
          </div>

          {/* Statement */}
          <h2 className="about-statement about-mobile-statement font-editorial font-normal text-[#182337] uppercase tracking-[0.012em] leading-[0.98] text-3xl sm:text-4xl md:text-5xl max-w-3xl">
            <span className="inline-block w-[14%] sm:w-[18%]" />
            A PLACE FOR CLASHERS TO DISCOVER WHAT’S NEW, FOLLOW THE META, FIND THE BEST BASES, AND STAY CONNECTED TO THE COMMUNITY.
          </h2>
        </div>
      </div>
    </section>
  );
};
