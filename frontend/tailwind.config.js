/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Serial Experiments Lain / Wired — clean cold blue.
        'bg-primary': '#070f1f',
        'bg-secondary': '#0c1830',
        'bg-tertiary': '#152844',
        'border-color': '#284f86',
        'text-primary': '#e7f4ff',
        'text-secondary': '#8096b8',
        'accent-green': '#33a6ff', // (formerly green) — now azure blue: primary / success / online
        'accent-red': '#ff526b', // danger
        'accent-orange': '#ffbf5b', // warning
        'accent-cyan': '#54e7ff', // primary active accent — the Wired signal
        'accent-violet': '#9d7bff', // secondary accent
        'accent-yellow': '#ffd86b',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
        sans: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '3px',
        md: '4px',
      },
      boxShadow: {
        // Active elements glow with a cold blue-cyan signal.
        'glow-green': '0 0 16px rgba(51, 166, 255, 0.34)',
        'glow-red': '0 0 16px rgba(255, 82, 107, 0.32)',
        'glow-cyan': '0 0 18px rgba(84, 231, 255, 0.38)',
        'glow-orange': '0 0 16px rgba(255, 191, 91, 0.30)',
        'glow-violet': '0 0 16px rgba(157, 123, 255, 0.34)',
        'glow-yellow': '0 0 16px rgba(255, 216, 107, 0.28)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
}
