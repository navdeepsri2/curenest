/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#eef2f6',
          100: '#d0d8e5',
          200: '#a3b4ce',
          500: '#23344e',
          600: '#1a283e',
          700: '#141e2f',
          800: '#0e1521',
          900: '#080c13',
        },
        navy: '#23344e',
        neutralLight: '#e7e7e5',
        charcoal: '#2d2d2d',
        pitch: '#0a0a0a',
        cream: '#f9f9f8',
        ink: '#2d2d2d',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(35, 52, 78, 0.08)',
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
