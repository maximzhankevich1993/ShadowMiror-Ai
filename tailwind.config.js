/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050509',
        'obsidian-glass': '#0A0A12',
        aura: '#A855F7',
        cyber: '#2DD4BF',
        mystic: '#E2E8F0',
      },
      boxShadow: {
        'aura-glow': '0 0 30px 5px rgba(168, 85, 247, 0.15)',
        'cyber-glow': '0 0 20px 2px rgba(45, 212, 191, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}