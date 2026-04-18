/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /** App primary = terracotta (replaces old blue brand) */
        brand: {
          50: '#FAF0EE',
          100: '#F0D8D3',
          200: '#E2B8AF',
          300: '#D4988A',
          400: '#C47565',
          500: '#B85C4A',
          600: '#A34E3E',
          700: '#8B4335',
          800: '#6D352A',
          900: '#4A2520',
          950: '#2E1A15',
        },
        matte: {
          cream: '#F7F3EC',
          'cream-dark': '#EFE8DC',
          paper: '#FBF9F5',
          terracotta: '#B85C4A',
          'terracotta-hover': '#A34E3E',
          'terracotta-muted': '#C47565',
          sage: '#6B7F5E',
          'sage-muted': '#8A9B7E',
          'sage-dark': '#556648',
          mustard: '#C4A35A',
          'mustard-soft': '#D9C48A',
          charcoal: '#3D3A36',
          'charcoal-soft': '#5C5854',
          border: '#E0D8CE',
          'border-strong': '#C9BFB2',
          'success-bg': '#E8EDE3',
          'error-bg': '#F3E6E3',
          error: '#8B4335',
          night: '#2C2A27',
          'night-card': '#363330',
          'night-border': '#4A4743',
          'night-elevated': '#403D39',
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        landing: ['Newsreader', 'Georgia', 'serif'],
      },
      boxShadow: {
        /** Matte only — low contrast */
        card: '0 1px 3px rgba(61, 58, 54, 0.06)',
        'card-dark': '0 1px 3px rgba(0, 0, 0, 0.2)',
        matte: '0 1px 3px rgba(61, 58, 54, 0.06)',
        'matte-md': '0 2px 8px rgba(61, 58, 54, 0.08)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
