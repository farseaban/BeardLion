import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { cookieName } from '@/lib/cookies'
import { getMeetingState } from '@/lib/meeting-state'
import JoinForm from '@/components/JoinForm'

export const dynamic = 'force-dynamic'

// §5-2 참여
export default async function JoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const editToken = (await cookies()).get(cookieName(slug))?.value
  const state = await getMeetingState(slug, editToken)
  if (!state) notFound()
  if (state.me) redirect(`/m/${slug}/my`)

  return (
    <main>
      <header className="mb-6 mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-full">당장만나</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">{state.title}</h1>
        <p className="mt-2 text-sm text-ink-dim">
          닉네임만 입력하면 바로 참여돼요. 로그인 없음.
        </p>
      </header>
      <JoinForm slug={slug} isFull={state.participants.length >= state.capacity} />
    </main>
  )
}
