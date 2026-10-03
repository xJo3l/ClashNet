/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clash: {
          bg: '#0b0813',
          card: '#150f24',
          accent: '#ff4757',
          gold: '#ffb142',
          purple: '#70a1ff',
          glow: 'rgba(255, 71, 87, 0.25)'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
