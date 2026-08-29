import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '당장만나',
  description: '친구들과 겹치는 날을 찾아 바로 약속을 확정하세요.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0F14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto min-h-dvh w-full max-w-[430px] px-4 pb-10 pt-6">
          {children}
        </div>
      </body>
    </html>
  )
}
