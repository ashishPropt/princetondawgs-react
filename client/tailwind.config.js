/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pd-orange': '#F55A00',
        'pd-dark':   '#1A1A2E',
        'pd-cream':  '#FFF8F2',
        'pd-green':  '#2ECC71',
        'pd-sand':   '#D4B896',
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        serif:   ['"DM Serif Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      }
    }
  },
  plugins: []
}
