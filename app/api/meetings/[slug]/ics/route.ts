import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { utcMidnightToIso } from '@/lib/dates'
import { buildIcs } from '@/lib/ics'
import { jsonError } from '@/lib/errors'

// 확정 일정 .ics 다운로드 (§5-5)
export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const meeting = await prisma.meeting.findUnique({ where: { slug } })
  if (!meeting) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')
  if (meeting.status !== 'fixed' || !meeting.fixedDate) {
    return jsonError(404, 'NOT_FIXED', '아직 확정된 날짜가 없어요.')
  }

  const dateIso = utcMidnightToIso(meeting.fixedDate)
  const ics = buildIcs({
    title: meeting.title,
    dateIso,
    uid: `${meeting.slug}@dangjangnana.local`,
  })

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="dangjangnana-${dateIso.replaceAll('-', '').slice(4)}.ics"`,
    },
  })
}
