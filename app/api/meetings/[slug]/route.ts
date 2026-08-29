import { NextRequest, NextResponse } from 'next/server'
import { getMeetingState } from '@/lib/meeting-state'
import { cookieName } from '@/lib/cookies'
import { jsonError } from '@/lib/errors'

// 전체 상태 조회 — 랭킹 화면 10초 폴링 엔드포인트 (§7)
export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const editToken = req.cookies.get(cookieName(slug))?.value
  const state = await getMeetingState(slug, editToken)
  if (!state) return jsonError(404, 'NOT_FOUND', '모임을 찾을 수 없어요.')
  return NextResponse.json(state, { headers: { 'Cache-Control': 'no-store' } })
}
