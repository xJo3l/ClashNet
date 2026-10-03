# White Desert Website Clone - Project Status & Documentation

## Overview
An identical clone of the luxury expedition website **[White Desert Antarctica](https://white-desert.com/)**, replicating its aesthetic, typography, assets, animations, interactive components, and responsive design.

---

## Architecture & Tech Stack
- **Framework**: Vite (Vanilla ES Modules) with high-performance bundling and instant HMR.
- **Styling**: Handcrafted Vanilla CSS design system incorporating all original design tokens, responsive grid overlays, glassmorphism filters, and tailored luxury color palette.
- **Typography**: 11 authentic downloaded local font files (`Cardinal Classic Long`, `Inter Tight`, and `Oswald`) served locally from `/fonts/`.
- **Media Assets**:
  - Full HD ambient Antarctica loop background video (`/videos/hero.mp4`) with Cloudflare Stream fallback.
  - 26 high-resolution Sanity CDN photos & cloud texture overlays (`cloud-1-cropped.png`, `cloud-2-full.png`, `cloud-gradient.png`) stored locally in `/images/`.
  - Official certification & award badges (IAATO, Carbon Neutral, Conde Nast, Global Vision Awards, TripAdvisor, 20 Years).

---

## Interactive Features & Animations

### 1. Liquid Glass & Nav Pills
- **Displacement Map & Specular Glare**: Dynamic SVG filters (`feTurbulence`, `feDisplacementMap`, and `feGaussianBlur`) on navigation buttons with specular glare that follows cursor movement.
- **Smooth Navigation**: "Experience", "Operation", and "About" buttons scroll to relevant page sections.

### 2. Grand Hero Section
- **Autoplay Ambient Video**: Antarctic ice cavern video with dark-to-light gradient overlay.
- **Multi-layer Cloud Parallax**: Foreground and background cloud textures drift at varied parallax scroll speeds (`data-scroll-speed`).
- **Grand Title Display**: "ANTARCTICA" large condensed typography with fade-and-scale scroll effect.
- **Fullscreen "Watch Film" Player**: Video modal pops up on clicking "Watch Film", with playback controls and ESC dismissal.

### 3. "The Last Continent" & Scribble Underline
- **Scroll-triggered SVG Scribble**: Hand-drawn signature underline beneath the title that animates into place using `stroke-dashoffset`.
- **Typography Reveal**: Narrative statement reveals with scroll-linked fade and vertical drift.

### 4. "Our Season" Mountain Parallax
- **Deep Interior Nunatak Peak**: Background mountain photograph with parallax scroll effect.
- **Floating Offset Card**: Polar summer season details (Cape Town to interior, 12 guests per camp, 100+ on-ice support staff).

### 5. "Our Trips" Card-Flick Interactive Accordion
- 5 Luxury Itineraries:
  1. **Baby Penguins & Blue Tunnels** ($75,250)
  2. **South Pole & Penguins** ($115,500)
  3. **South Pole & Blue Rivers** ($115,500)
  4. **The Long Stay** ($110,500)
  5. **Antarctica in a Day** ($16,500)
- **Interactive Expansion**: Hovering or clicking smoothly expands card width, reveals early season badges, pricing, and excerpt.
- **Detailed Itinerary Slide-over Drawer**: Clicking any card opens a slide-over panel with hero photo, itinerary days breakdown, camp specifications, and direct booking CTA.
- **SPA URL Routing**: Dynamic URLs (e.g. `/itineraries/south-pole-emperor-penguins`) supported via HTML5 History API.

### 6. "Our Camps" Showcase
- **Whichaway Camp**: Redesigned luxury polar pods, heated suites, freshwater lake views, and polar sauna.
- **Echo Camp**: Space-age retro-futuristic sky pods inspired by space exploration.
- **Explorer Camp**: Mobile luxury expedition base for deep nunatak traverses.

### 7. Flight Route (CPT -> WFR)
- **Cape Town to Wolf's Fang Runway**: Real coordinates (33° 58' 17" S, 18° 36' 13" E to 71° 31' S, 08° 48' E).
- **Animated Flight Line**: Glowing trajectory across the Southern Ocean with pulsating radar beacons.
- **Expedition Metrics**: 05:30 hrs flight time, 4,220 km distance, -5°C polar summer temperature.

### 8. "How It Works" 5-Step Process
- Step-by-step roadmap: Consultation, Confirmation, Planning, On-Boarding, Safety Briefing.

### 9. Luxury Modals & Forms
- **Dates & Rates Modal**: Season departure calendar, camp accommodations, availability, and pricing.
- **Expedition Enquiry Form**: Booking form with itinerary selector, guest count, and dates.

### 10. Atmospheric Polar Audio (Web Audio API)
- Real-time synthesized Antarctic polar breeze with low-pass resonance and subtle wind modulation.
- Toggled on/off via the bottom-left "Sound Off" / "Sound On" animated wave pill.

### 11. Custom Luxury Cursor
- Trailing cursor dot and lerping outer ring with magnetic expansion and `mix-blend-mode: difference`.

---

## Local Development
- **Dev Server**: `npm run dev` (Runs at `http://localhost:5173/`)
- **Production Build**: `npm run build` (Verified: bundles in under 1 second with 0 errors)
