'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  slug: string
  isFull: boolean
}

// 참여 폼. 닉네임 중복(409 DUPLICATE_NAME) 시 승계 확인 화면으로 전환 (§4)
export default function JoinForm({ slug, isFull }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phase, setPhase] = useState<'input' | 'inherit' | 'full'>(isFull ? 'full' : 'input')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function join(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const res = await fetch(`/api/meetings/${slug}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      router.push(`/m/${slug}/my`)
      return
    }
    const data = await res.json().catch(() => null)
    const code = data?.error?.code
    if (code === 'DUPLICATE_NAME') {
      setPhase('inherit')
    } else if (code === 'CAPACITY_FULL') {
      setPhase('full')
    } else {
      setError(data?.error?.message ?? '참여하지 못했어요. 다시 시도해 주세요.')
    }
    setSubmitting(false)
  }

  async function claim() {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const res = await fetch(`/api/meetings/${slug}/participants/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      router.push(`/m/${slug}/my`)
      return
    }
    const data = await res.json().catch(() => null)
    setError(data?.error?.message ?? '이어받지 못했어요. 다시 시도해 주세요.')
    setSubmitting(false)
  }

  if (phase === 'full') {
    return (
      <section className="rounded-2xl border border-ink-line bg-ink-panel p-5">
        <h2 className="text-base font-bold">정원 초과예요</h2>
        <p className="mt-2 text-sm text-ink-dim">
          이 모임은 3명까지 참여할 수 있어요. 이미 참여한 적이 있다면 쓰던 닉네임으로
          이어받을 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => setPhase('input')}
          className="mt-4 min-h-[44px] w-full rounded-xl border border-ink-line text-sm font-medium text-ink-dim"
        >
          기존 닉네임으로 이어받기
        </button>
      </section>
    )
  }

  if (phase === 'inherit') {
    return (
      <section className="rounded-2xl border border-ink-line bg-ink-panel p-5">
        <h2 className="text-base font-bold">
          &lsquo;{name.trim()}&rsquo;(으)로 참여한 기록이 있어요
        </h2>
        <p className="mt-2 text-sm text-ink-dim">
          기존 입력을 이어받을까요? 본인이 아니라면 다른 닉네임으로 참여해 주세요.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPhase('input')
              setError(null)
            }}
            className="min-h-[44px] flex-1 rounded-xl border border-ink-line text-sm font-medium text-ink-dim"
          >
            다른 이름으로
          </button>
          <button
            type="button"
            onClick={claim}
            disabled={submitting}
            className="min-h-[44px] flex-1 rounded-xl bg-full text-sm font-bold text-ink-bg disabled:opacity-40"
          >
            {submitting ? '확인 중…' : '이어받기'}
          </button>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={join} className="space-y-4">
      <div>
        <label htmlFor="join-name" className="mb-1.5 block text-sm font-medium text-ink-dim">
          내 닉네임
        </label>
        <input
          id="join-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          required
          placeholder="예: 현우"
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
        {submitting ? '참여 중…' : '참여하기'}
      </button>
    </form>
  )
}
