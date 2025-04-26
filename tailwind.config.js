/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#25313D',
        customgreen: '#5CA2A6',
        customgreen2: '#225A58'
      },
      keyframes: {
        zoomInOut: {
          '0%, 100%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(1.5)' },
        },
      },
      animation: {
        zoomInOut: 'zoomInOut 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')]
}

