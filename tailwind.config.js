/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease forwards',
        'slide-in':   'slideIn 0.3s ease forwards',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
      boxShadow: {
        card:  '0 2px 16px rgba(15,23,42,0.06)',
        'card-hover': '0 8px 32px rgba(15,23,42,0.10)',
        modal: '0 24px 64px rgba(15,23,42,0.15)',
      },
    },
  },
  plugins: [],
}
