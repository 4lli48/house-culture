export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Muted Gold — primary accent
        gold: {
          50:  '#FDFBF5',
          100: '#FAF4E3',
          200: '#F3E4C0',
          300: '#E8CC91',
          400: '#D9AF5C',
          500: '#C5943A', // Primary gold
          600: '#A87A2E',
          700: '#845E22',
          800: '#62451A',
          900: '#3F2D10',
          950: '#221805',
        },
        // Warm Ivory — backgrounds
        ivory: {
          50:  '#FEFEFE',
          100: '#FDFCFA',
          200: '#FAF8F4',
          300: '#F5F1EB',
          400: '#EDE7DC',
          500: '#E2D8C8',
          600: '#C9BBAA',
          700: '#A89482',
          800: '#7F6E5D',
          900: '#574C41',
        },
        // Deep Navy — dark surfaces
        navy: {
          50:  '#F2F4F8',
          100: '#E2E7F0',
          200: '#BCC8DC',
          300: '#8FA1BC',
          400: '#5E7399',
          500: '#3A527A',
          600: '#253A5E',
          700: '#172844',
          800: '#0F1C30',
          900: '#0A1220',
          950: '#060C15',
        },
        // Semantic
        primary: {
          50:  '#FAF4E3',
          100: '#F3E4C0',
          500: '#C5943A',
          600: '#A87A2E',
          900: '#0A1220',
        },
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        sans:   ['Inter', '"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      boxShadow: {
        'card':      '0 1px 3px 0 rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.06)',
        'card-md':   '0 4px 24px -4px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.04)',
        'card-dark': '0 4px 24px -4px rgba(0,0,0,0.40)',
        'gold':      '0 2px 12px -2px rgba(197,148,58,0.30)',
        'gold-lg':   '0 4px 24px -4px rgba(197,148,58,0.45)',
        'inset':     'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'ivory-gradient': 'linear-gradient(135deg, #FDFCFA 0%, #F5F1EB 100%)',
        'navy-gradient':  'linear-gradient(135deg, #0A1220 0%, #172844 100%)',
        'gold-gradient':  'linear-gradient(135deg, #C5943A 0%, #A87A2E 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-up':       'fade-up 0.35s ease-out both',
        'fade-in':       'fade-in 0.25s ease-out both',
        'slide-down':    'slide-down 0.25s ease-out both',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'shimmer':       'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
