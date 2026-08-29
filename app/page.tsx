'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// §5-1 모임 생성
export default function CreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, name }),
    })
    if (res.ok) {
      const { slug } = await res.json()
      router.push(`/m/${slug}`)
      return
    }
    const data = await res.json().catch(() => null)
    setError(data?.error?.message ?? '만들지 못했어요. 잠시 후 다시 시도해 주세요.')
    setSubmitting(false)
  }

  return (
    <main>
      <header className="mb-8 mt-6">
        <h1 className="text-3xl font-black tracking-tight">당장만나</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-dim">
          링크를 단톡방에 던지세요.
          <br />
          앱 설치 없이 바로 참여됩니다.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink-dim">
            모임 이름 <span className="text-xs">(선택)</span>
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            placeholder="당장만나"
            className="min-h-[44px] w-full rounded-xl border border-ink-line bg-ink-panel px-4 text-base outline-none placeholder:text-ink-dim/60 focus:border-full"
          />
        </div>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-dim">
            내 닉네임 <span className="text-xs text-danger">(필수)</span>
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            required
            placeholder="예: 지수"
            className="min-h-[44px] w-full rounded-xl border border-ink-line bg-ink-panel px-4 text-base outline-none placeholder:text-ink-dim/60 focus:border-full"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || name.trim().length === 0}
          className="min-h-[48px] w-full rounded-xl bg-full text-base font-bold text-ink-bg disabled:opacity-40"
        >
          {submitting ? '만드는 중…' : '모임 만들고 링크 받기'}
        </button>
      </form>

      <section className="mt-10 rounded-2xl border border-ink-line bg-ink-panel p-4">
        <h2 className="text-sm font-bold text-ink-dim">이렇게 굴러가요</h2>
        <ol className="mt-2 space-y-1.5 text-sm text-ink-dim">
          <li>1. 링크 공유 → 친구들이 닉네임만 입력하고 참여</li>
          <li>2. 각자 되는 날짜를 탭 (앞으로 14일)</li>
          <li>
            3. <span className="font-bold text-full">전원 겹침</span>은 바로 픽스,{' '}
            <span className="font-bold text-duo">2명 겹침</span>은 찔러보기
          </li>
        </ol>
      </section>
    </main>
  )
}
