import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { formatKo, isValidIsoDate, isoToUtcMidnight } from '@/lib/dates'
import { cookieName } from '@/lib/cookies'
import { jsonError } from '@/lib/errors'
import { getMeetingState } from '@/lib/meeting-state'

async function resolveMe(slug: string, editToken: string | undefined) {
  if (!editToken) return null
  const meeting = await prisma.meeting.findUnique({
    where: { slug },
    include: { participants: { where: { editToken } } },
  })
  if (!meeting) return undefined // 모임 없음
  return meeting.participants[0] ? { meeting, me: meeting.participants[0] } : null
}

// 픽스 (§5-5). 권한은 참여자 전원.
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const resolved = await resolveMe(slug, req.cookies.get(cookieName(slug))?.value)
  if (resolved === undefined) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')
  if (!resolved) return jsonError(401, 'NO_IDENTITY', '참여자만 확정할 수 있어요.')
  const { meeting, me } = resolved

  let body: { date?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'INVALID_BODY', '요청 형식이 잘못됐어요.')
  }
  if (!isValidIsoDate(body.date)) return jsonError(400, 'INVALID_BODY', '날짜 형식이 잘못됐어요.')
  const dateIso = body.date

  // 현재 시점 기준으로 전원 겹침인지 서버가 재검증 (낡은 화면에서의 픽스 방지)
  const state = await getMeetingState(slug)
  if (!state) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')
  if (!state.ranking.fullOverlap.some((r) => r.date === dateIso)) {
    return jsonError(400, 'NOT_FULL_OVERLAP', '지금은 전원 가능한 날짜가 아니에요. 화면을 새로고침해 주세요.')
  }

  // 동시 픽스 레이스: status 가드가 걸린 단일 UPDATE — 진 쪽은 count 0
  const { count } = await prisma.meeting.updateMany({
    where: { id: meeting.id, status: 'collecting' },
    data: { status: 'fixed', fixedDate: isoToUtcMidnight(dateIso), fixedBy: me.id },
  })
  if (count === 0) return jsonError(409, 'ALREADY_FIXED', '이미 다른 날짜로 확정됐어요.')

  return NextResponse.json({ ok: true })
}

// 확정 취소 — 확정자 본인만 (§5-5). 취소는 시스템 라인으로 전원에게 보인다.
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const resolved = await resolveMe(slug, req.cookies.get(cookieName(slug))?.value)
  if (resolved === undefined) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')
  if (!resolved) return jsonError(401, 'NO_IDENTITY', '참여자만 취소할 수 있어요.')
  const { meeting, me } = resolved

  if (meeting.status !== 'fixed' || !meeting.fixedDate) {
    return jsonError(409, 'NOT_FIXED', '확정된 날짜가 없어요.')
  }
  if (meeting.fixedBy !== me.id) {
    return jsonError(403, 'NOT_FIXER', '확정한 사람만 취소할 수 있어요.')
  }

  const dateLabel = formatKo(meeting.fixedDate.toISOString().slice(0, 10))
  await prisma.$transaction([
    prisma.meeting.update({
      where: { id: meeting.id },
      data: { status: 'collecting', fixedDate: null, fixedBy: null },
    }),
    prisma.systemMessage.create({
      data: { meetingId: meeting.id, body: `${me.name}님이 ${dateLabel} 확정을 취소했어요` },
    }),
  ])

  return NextResponse.json({ ok: true })
}
