/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:         '#0e0e14',
        surface:    '#17171f',
        'surface-2':'#202030',
        border:     '#2a2a3c',
        'text-main':'#e6e4f0',
        'text-muted':'#7070a0',
        accent:     '#6b7cf8',
        'accent-2': '#a28ef8',
        success:    '#5aaf7a',
        warning:    '#c9963a',
        danger:     '#d85a5a',
        floor:      '#1c2d4a',
        'floor-light':'#223256',
        block:      '#4f68e6',
        goal:       '#7c6ef5',
        fragile:    '#c9963a',
        'switch-soft':'#5aaf7a',
        'switch-hard':'#d85a5a',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'star-pop': {
          '0%':   { transform: 'scale(0) rotate(-20deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.2) rotate(8deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'fall': {
          '0%':   { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(200px) scale(0.1)', opacity: '0' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        'celebrate': {
          '0%':   { transform: 'translateY(0) rotate(0deg)' },
          '25%':  { transform: 'translateY(-16px) rotate(-4deg)' },
          '75%':  { transform: 'translateY(-16px) rotate(4deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
      },
      animation: {
        'float':     'float 3s ease-in-out infinite',
        'star-pop':  'star-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'fall':      'fall 0.6s ease-in forwards',
        'shake':     'shake 0.4s ease-in-out',
        'blink':     'blink 1.6s ease-in-out infinite',
        'celebrate': 'celebrate 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}
