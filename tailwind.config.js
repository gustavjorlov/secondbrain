/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Enable dark mode based on system preferences
  theme: {
    extend: {
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeSlideIn: 'fadeSlideIn 0.3s ease-out forwards'
      }
    },
  },
  plugins: [
    typography,
  ],
}
