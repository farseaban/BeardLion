// 서버·클라이언트 공용 타입 (prisma 의존 없음 — 클라이언트 번들 안전)
import type { Ranking } from './overlap.ts'

export interface ParticipantView {
  id: string
  name: string
  responded: boolean
  dates: string[]
}

export interface MeetingState {
  slug: string
  title: string
  status: 'collecting' | 'fixed'
  windowStartIso: string
  windowEndIso: string
  todayIso: string
  capacity: number
  fixed: { dateIso: string; byId: string; byName: string } | null
  me: { id: string; name: string; responded: boolean; dates: string[] } | null
  participants: ParticipantView[]
  ranking: Ranking
  systemMessages: { body: string; createdAt: string }[]
}
