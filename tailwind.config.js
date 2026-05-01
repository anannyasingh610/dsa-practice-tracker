/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#8ca8ff',
          500: '#667eea',
          600: '#5568d3',
          700: '#4451b5',
          800: '#343d93',
          900: '#2a3175',
        },
        secondary: {
          500: '#764ba2',
          600: '#633d8a',
        }
      },
    },
  },
  plugins: [],
}
