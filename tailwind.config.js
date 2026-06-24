/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#ecfbfa',
          100: '#c9f0ef',
          200: '#96e2dd',
          300: '#5ecdcc',
          400: '#3bb8bb',
          500: '#139fa4',
          600: '#0d857e',
          700: '#0a6d66',
          800: '#095758',
          900: '#08444a',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
