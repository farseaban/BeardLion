import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isValidIsoDate, isoToUtcMidnight, todayKst, utcMidnightToIso, windowDates } from '@/lib/dates'
import { cookieName } from '@/lib/cookies'
import { jsonError } from '@/lib/errors'

// 내 가능일 전체 교체 (§5-3). allImpossible=true는 "이번 2주 다 안 됨" 선언 —
// 날짜 0개여도 respondedAt을 기록해 미응답과 구분한다 (§8-5).
export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const editToken = req.cookies.get(cookieName(slug))?.value
  if (!editToken) return jsonError(401, 'NO_IDENTITY', '참여 정보가 없어요. 다시 참여해 주세요.')

  let body: { dates?: unknown; allImpossible?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'INVALID_BODY', '요청 형식이 잘못됐어요.')
  }
  if (!Array.isArray(body.dates) || !body.dates.every(isValidIsoDate)) {
    return jsonError(400, 'INVALID_BODY', '날짜 형식이 잘못됐어요.')
  }
  const dates = [...new Set(body.dates as string[])]
  const allImpossible = body.allImpossible === true

  const meeting = await prisma.meeting.findUnique({
    where: { slug },
    include: { participants: { where: { editToken } } },
  })
  if (!meeting) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')
  const me = meeting.participants[0]
  if (!me) return jsonError(401, 'NO_IDENTITY', '참여 정보가 없어요. 다시 참여해 주세요.')

  // 창 안 & 오늘(KST) 이후만 허용 (§6, §8-8)
  const today = todayKst()
  const valid = new Set(windowDates(utcMidnightToIso(meeting.windowStart)).filter((d) => d >= today))
  if (!dates.every((d) => valid.has(d))) {
    return jsonError(400, 'DATE_OUT_OF_WINDOW', '선택할 수 없는 날짜가 포함돼 있어요.')
  }

  const respondedAt =
    me.respondedAt ?? (dates.length > 0 || allImpossible ? new Date() : null)

  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { participantId: me.id } }),
    prisma.availability.createMany({
      data: dates.map((d) => ({ participantId: me.id, date: isoToUtcMidnight(d) })),
    }),
    prisma.participant.update({ where: { id: me.id }, data: { respondedAt } }),
  ])

  return NextResponse.json({ respondedAt: respondedAt?.toISOString() ?? null })
}
