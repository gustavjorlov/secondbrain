/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Enable dark mode based on system preferences
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
}
