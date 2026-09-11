/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 저장소 이름이 하위 경로가 됩니다. (예: /BeardLion/)
// 배포 워크플로가 VITE_BASE_PATH 환경변수로 넘겨 줍니다.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
