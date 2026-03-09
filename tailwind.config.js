/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dde9ff',
          200: '#bfd4ff',
          300: '#93b4ff',
          400: '#648cff',
          500: '#465fff',
          600: '#3641f5',
          700: '#2b31dd',
          800: '#252caf',
          900: '#252f85',
        },
      },
      boxShadow: {
        card: '0 6px 18px rgba(28, 39, 76, 0.08)',
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

