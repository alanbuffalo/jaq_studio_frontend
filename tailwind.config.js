/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#f4f1eb',
        brand: {
          50: '#f7efee',
          100: '#efdfde',
          200: '#dfbfbd',
          300: '#cf9f9c',
          400: '#c28e8b',
          500: '#b9817f',
          600: '#9f6765',
          700: '#835352',
          800: '#684342',
          900: '#4d3232',
        },
      },
      boxShadow: {
        card: '0 24px 56px rgba(23, 32, 51, 0.08)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
