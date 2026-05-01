/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#FF4500',
        'brand-2': '#FF6B35',
        bg: '#080809',
        'bg-2': '#0E0E10',
        'bg-3': '#151517',
        'bg-4': '#1C1C1F',
        'bg-5': '#232327',
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
