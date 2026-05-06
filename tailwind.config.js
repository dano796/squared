/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050510',
        navy: '#0a0a1a',
        floor: '#1a2744',
        'floor-light': '#243460',
        block: '#3b82f6',
        'block-top': '#60a5fa',
        'block-side': '#1d4ed8',
        goal: '#a855f7',
        fragile: '#f59e0b',
        'switch-soft': '#22c55e',
        'switch-hard': '#ef4444',
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body: ['"Share Tech Mono"', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px 2px #a855f7' },
          '50%': { boxShadow: '0 0 25px 8px #a855f7' },
        },
        'fall': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(200px) scale(0.1)', opacity: '0' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        'star-pop': {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'tile-appear': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'celebrate': {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) rotate(-5deg)' },
          '75%': { transform: 'translateY(-20px) rotate(5deg)' },
          '100%': { transform: 'translateY(0) rotate(0deg)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'fall': 'fall 0.6s ease-in forwards',
        'shake': 'shake 0.4s ease-in-out',
        'star-pop': 'star-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'tile-appear': 'tile-appear 0.3s ease-out forwards',
        'celebrate': 'celebrate 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
}

