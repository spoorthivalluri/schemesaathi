/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c2d9ea',
          500: '#1e40af',
          700: '#1d2c4d',
          800: '#141e33',
          900: '#0b1329',
          950: '#060a17'
        },
        matched: {
          light: '#ecfdf5',
          border: '#6ee7b7',
          DEFAULT: '#059669',
          dark: '#065f46'
        },
        unmet: {
          light: '#fff1f2',
          border: '#fda4af',
          DEFAULT: '#e11d48',
          dark: '#9f1239'
        },
        pending: {
          light: '#fffbeb',
          border: '#fcd34d',
          DEFAULT: '#d97706',
          dark: '#92400e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
