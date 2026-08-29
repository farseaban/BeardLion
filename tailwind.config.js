/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: '#0B0F14',
          panel: '#161C24',
          line: '#242E3A',
          text: '#E7ECF2',
          dim: '#95A1B0',
        },
        full: {
          DEFAULT: '#34D399',
          soft: 'rgba(52,211,153,.12)',
          line: 'rgba(52,211,153,.35)',
        },
        duo: {
          DEFAULT: '#5EA2F7',
          soft: 'rgba(94,162,247,.12)',
          line: 'rgba(94,162,247,.35)',
        },
        warn: '#F5B44C',
        danger: '#F87171',
        sat: '#7DB2F9',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
