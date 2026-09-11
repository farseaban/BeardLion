/** @type {import('tailwindcss').Config} */
// 세 시안이 공유하는 중립 팔레트. 색은 구조 결정 뒤에 따로 정합니다.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        edge: '#d6d3d1', paper: '#f4f2ed', card: '#ffffff',
        ink: '#1c1917', muted: '#44403c', line: '#d6d3d1',
        accent: '#1d3552', onAccent: '#ffffff',
        soft: '#eef2f7', onSoft: '#16283f', warn: '#9f1239',
      },
      borderRadius: { box: '10px', pill: '10px' },
    },
  },
  plugins: [],
}
