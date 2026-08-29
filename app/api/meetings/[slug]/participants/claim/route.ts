import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookieName, cookieOptions } from '@/lib/cookies'
import { jsonError } from '@/lib/errors'
import { validateName } from '@/lib/validate'

// 쿠키 유실 후 같은 닉네임 재입장 → 기존 레코드 승계 (§4).
// 기존 editToken을 그대로 쿠키에 재발급한다 (구 기기의 쿠키도 계속 유효).
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

  const meeting = await prisma.meeting.findUnique({ where: { slug }, select: { id: true } })
  if (!meeting) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')

  const participant = await prisma.participant.findUnique({
    where: { meetingId_name: { meetingId: meeting.id, name } },
  })
  if (!participant) return jsonError(404, 'NO_SUCH_NAME', '해당 닉네임의 참여 기록이 없어요.')

  const res = NextResponse.json({ participantId: participant.id })
  res.cookies.set(cookieName(slug), participant.editToken, cookieOptions())
  return res
}
