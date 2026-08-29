'use client'

import { formatKo } from '@/lib/dates'

interface Props {
  slug: string
  dateIso: string
  byName: string
  canCancel: boolean
  onShare: () => void
  onCancel: () => void
}

// §5-5 확정 배너 — 랭킹 상단을 치환한다
export default function FixedBanner({ slug, dateIso, byName, canCancel, onShare, onCancel }: Props) {
  return (
    <section
      aria-label="확정된 날짜"
      className="rounded-3xl border border-full-line bg-full-soft p-6 text-center"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-full">확정</p>
      <p className="mt-2 text-4xl font-black tracking-tight">{formatKo(dateIso)}</p>
      <p className="mt-2 text-xs text-ink-dim">{byName}님이 확정했어요</p>
      <div className="mt-5 flex gap-2">
        <a
          href={`/api/meetings/${slug}/ics`}
          download
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-full-line text-sm font-bold text-full"
        >
          .ics 다운로드
        </a>
        <button
          type="button"
          onClick={onShare}
          className="min-h-[44px] flex-1 rounded-xl bg-full text-sm font-bold text-ink-bg"
        >
          공유하기
        </button>
      </div>
      {canCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 min-h-[44px] w-full rounded-xl text-xs font-medium text-ink-dim underline underline-offset-2"
        >
          확정 취소 (확정한 사람만)
        </button>
      )}
    </section>
  )
}
