/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 종이 바탕. 채도를 낮춰 눈부심을 줄입니다.
        paper: '#f4f2ed',
        // 본문 글자. 흰 카드 위에서 대비 15:1 이상입니다.
        ink: '#1c1917',
        // 강조색 하나만 씁니다. 짙은 남색.
        navy: {
          50: '#eef2f7',
          100: '#dfe7f0',
          200: '#c3d0e1',
          600: '#33547d',
          700: '#26456b',
          800: '#1d3552',
          900: '#16283f',
        },
      },
    },
  },
  plugins: [],
}
