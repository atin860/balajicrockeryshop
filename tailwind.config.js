/** @type {import('tailwindcss').Config} */
// Design tokens for Shri Balaji Dona Pattal Store.
// Colors, fonts, radii and shadows defined here are the single source of truth
// for the whole UI — components should use these names, not raw hex values.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Page width & gutters are defined by .container-page in src/index.css.
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C62828', // festive red — buttons & highlights only
          dark: '#A31F1F',
          light: '#FDECEC',
        },
        accent: {
          DEFAULT: '#F9A825', // marigold yellow
          dark: '#E08E00',
          light: '#FFF3D6',
        },
        eco: {
          DEFAULT: '#2E7D32', // leaf green for eco products
          dark: '#1F5F23',
          light: '#E8F5E9',
        },
        whatsapp: {
          DEFAULT: '#25D366', // brand green — icon-only floating button
          dark: '#1DA851',
          deep: '#15803D', // text buttons: white text passes WCAG AA (5:1)
          deeper: '#116A32',
        },
        cream: {
          DEFAULT: '#FFFBF5', // page background
          alt: '#FFF4E6', // alternate section background
        },
        line: '#F0E6DA', // card borders
        ink: {
          DEFAULT: '#1F1F1F', // body text
          muted: '#6B6B6B',
        },
      },
      fontFamily: {
        // Devanagari font is listed in every stack so Hindi glyphs always render nicely.
        heading: ['Poppins', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px', // max content width (padding included)
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(31, 31, 31, 0.06), 0 1px 3px rgba(31, 31, 31, 0.04)',
        card: '0 8px 30px -8px rgba(31, 31, 31, 0.10)',
        lift: '0 18px 40px -12px rgba(31, 31, 31, 0.18)',
        nav: '0 4px 20px -6px rgba(31, 31, 31, 0.10)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        // Expanding ring behind the floating WhatsApp button (transform + opacity only = smooth & cheap)
        'wa-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%, 100%': { transform: 'scale(1.55)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'wa-ring': 'wa-ring 2.4s ease-out infinite',
        float: 'float 5s ease-in-out infinite',
        'slow-zoom': 'slow-zoom 12s ease-out forwards',
      },
    },
  },
  plugins: [],
};
