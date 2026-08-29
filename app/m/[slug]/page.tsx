import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { cookieName } from '@/lib/cookies'
import { getMeetingState } from '@/lib/meeting-state'
import RankingScreen from '@/components/RankingScreen'

export const dynamic = 'force-dynamic'

// §5-4 랭킹 화면 — 제품의 본체
export default async function RankingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const editToken = (await cookies()).get(cookieName(slug))?.value
  const state = await getMeetingState(slug, editToken)
  if (!state) notFound()

  return <RankingScreen initialState={state} />
}
