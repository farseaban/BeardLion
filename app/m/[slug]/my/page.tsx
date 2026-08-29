import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { cookieName } from '@/lib/cookies'
import { getMeetingState } from '@/lib/meeting-state'
import DateGrid from '@/components/DateGrid'

export const dynamic = 'force-dynamic'

// §5-3 날짜 입력
export default async function MyDatesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const editToken = (await cookies()).get(cookieName(slug))?.value
  const state = await getMeetingState(slug, editToken)
  if (!state) notFound()
  if (!state.me) redirect(`/m/${slug}/join`)

  return (
    <main>
      <header className="mb-5 mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-full">{state.title}</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">되는 날만 탭하세요</h1>
        <p className="mt-2 text-sm text-ink-dim">
          {state.me.name}님, 앞으로 2주 중 가능한 날짜를 골라 주세요. 자동 저장돼요.
        </p>
      </header>
      <DateGrid
        slug={slug}
        windowStartIso={state.windowStartIso}
        todayIso={state.todayIso}
        initialDates={state.me.dates}
        alreadyResponded={state.me.responded}
      />
    </main>
  )
}
