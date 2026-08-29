import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateEditToken } from '@/lib/tokens'
import { cookieName, cookieOptions } from '@/lib/cookies'
import { jsonError } from '@/lib/errors'
import { CAPACITY } from '@/lib/meeting-state'
import { validateName } from '@/lib/validate'

// 참여 (§5-2): 정원 3명, 닉네임 중복 시 승계 플로우로 안내
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  let body: { name?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'INVALID_BODY', '요청 형식이 잘못됐어요.')
  }
  const name = validateName(body.name)
  if (!name) return jsonError(400, 'INVALID_NAME', '닉네임은 1~12자로 입력해 주세요.')

  const meeting = await prisma.meeting.findUnique({
    where: { slug },
    include: { participants: { select: { id: true, name: true } } },
  })
  if (!meeting) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')

  if (meeting.participants.some((p) => p.name === name)) {
    // 쿠키 유실 재입장 가능성 — 클라이언트가 승계 확인 화면을 띄운다 (§4)
    return jsonError(409, 'DUPLICATE_NAME', '이미 같은 닉네임으로 참여한 기록이 있어요.')
  }
  if (meeting.participants.length >= CAPACITY) {
    return jsonError(409, 'CAPACITY_FULL', '정원 초과예요. 이 모임은 3명까지 참여할 수 있어요.')
  }

  const editToken = generateEditToken()
  try {
    // 정원 검사와 생성 사이 레이스는 아래 재검증 트랜잭션으로 방지
    const participant = await prisma.$transaction(async (tx) => {
      const count = await tx.participant.count({ where: { meetingId: meeting.id } })
      if (count >= CAPACITY) throw new Error('CAPACITY_FULL')
      return tx.participant.create({
        data: { meetingId: meeting.id, name, editToken },
      })
    })
    const res = NextResponse.json({ participantId: participant.id }, { status: 201 })
    res.cookies.set(cookieName(slug), editToken, cookieOptions())
    return res
  } catch (e) {
    if (e instanceof Error && e.message === 'CAPACITY_FULL') {
      return jsonError(409, 'CAPACITY_FULL', '정원 초과예요. 이 모임은 3명까지 참여할 수 있어요.')
    }
    // @@unique([meetingId, name]) 동시 참여 레이스
    return jsonError(409, 'DUPLICATE_NAME', '이미 같은 닉네임으로 참여한 기록이 있어요.')
  }
}
