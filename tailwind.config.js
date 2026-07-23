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
          dark: '#0B1130',    // Indigo 900 base dark
          primary: '#2546F0', // Blue 600 action primary
          accent: '#34E0D8',  // Cyan 400 signature accent
          success: '#1FC98D', // Success / progress done
          warning: '#F5A524', // Warning / timer
          danger: '#F44368',  // Danger / errors
          surface: '#F6F7FB', // Light surface
          body: '#4A4F6B',    // Gray 700 body text
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'soft': '18px',
      },
    },
  },
  plugins: [],
}