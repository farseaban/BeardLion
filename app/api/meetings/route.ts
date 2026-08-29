import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addDaysIso, isoToUtcMidnight, todayKst } from '@/lib/dates'
import { generateEditToken, generateSlug } from '@/lib/tokens'
import { cookieName, cookieOptions } from '@/lib/cookies'
import { jsonError } from '@/lib/errors'
import { validateName } from '@/lib/validate'

// 모임 생성 (§5-1): 생성자가 첫 참여자가 된다
export async function POST(req: NextRequest) {
  let body: { title?: unknown; name?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'INVALID_BODY', '요청 형식이 잘못됐어요.')
  }

  const name = validateName(body.name)
  if (!name) return jsonError(400, 'INVALID_NAME', '닉네임은 1~12자로 입력해 주세요.')

  const title =
    typeof body.title === 'string' && body.title.trim().length > 0
      ? body.title.trim().slice(0, 30)
      : '당장만나'

  // 창: 생성일(KST) 다음날부터 14일 (§4)
  const windowStartIso = addDaysIso(todayKst(), 1)
  const windowEndIso = addDaysIso(windowStartIso, 13)
  const editToken = generateEditToken()

  const meeting = await prisma.meeting.create({
    data: {
      slug: generateSlug(),
      title,
      windowStart: isoToUtcMidnight(windowStartIso),
      windowEnd: isoToUtcMidnight(windowEndIso),
      participants: { create: { name, editToken } },
    },
  })

  const res = NextResponse.json({ slug: meeting.slug }, { status: 201 })
  res.cookies.set(cookieName(meeting.slug), editToken, cookieOptions())
  return res
}
