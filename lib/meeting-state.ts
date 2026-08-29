// GET 핸들러와 서버 컴포넌트가 공유하는 상태 조립기
import { prisma } from './db'
import { todayKst, utcMidnightToIso } from './dates'
import { computeRanking } from './overlap'
import type { MeetingState, ParticipantView } from './types'

export type { MeetingState, ParticipantView } from './types'

export const CAPACITY = 3

export async function getMeetingState(
  slug: string,
  editToken?: string,
): Promise<MeetingState | null> {
  const meeting = await prisma.meeting.findUnique({
    where: { slug },
    include: {
      participants: {
        orderBy: { id: 'asc' },
        include: { availabilities: true },
      },
      systemMessages: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })
  if (!meeting) return null

  const todayIso = todayKst()
  const windowStartIso = utcMidnightToIso(meeting.windowStart)

  const participants: ParticipantView[] = meeting.participants.map((p) => ({
    id: p.id,
    name: p.name,
    responded: p.respondedAt !== null,
    dates: p.availabilities.map((a) => utcMidnightToIso(a.date)).sort(),
  }))

  const meRow = editToken ? meeting.participants.find((p) => p.editToken === editToken) : undefined
  const me = meRow ? participants.find((p) => p.id === meRow.id)! : null

  const fixer = meeting.fixedBy
    ? meeting.participants.find((p) => p.id === meeting.fixedBy)
    : undefined

  return {
    slug: meeting.slug,
    title: meeting.title,
    status: meeting.status === 'fixed' ? 'fixed' : 'collecting',
    windowStartIso,
    windowEndIso: utcMidnightToIso(meeting.windowEnd),
    todayIso,
    capacity: CAPACITY,
    fixed:
      meeting.status === 'fixed' && meeting.fixedDate
        ? {
            dateIso: utcMidnightToIso(meeting.fixedDate),
            byId: meeting.fixedBy ?? '',
            byName: fixer?.name ?? '',
          }
        : null,
    me,
    participants,
    ranking: computeRanking(participants, windowStartIso, todayIso),
    systemMessages: meeting.systemMessages.map((m) => ({
      body: m.body,
      createdAt: m.createdAt.toISOString(),
    })),
  }
}
