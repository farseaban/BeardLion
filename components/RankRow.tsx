'use client'

import { formatKo } from '@/lib/dates'
import type { RankedDate } from '@/lib/overlap'

interface Props {
  row: RankedDate
  variant: 'full' | 'duo'
  nameOf: (id: string) => string
  nonResponderNames: string[]
  actionLabel: string
  actionDisabled?: boolean
  onAction: () => void
}

// 랭킹 한 행. 색상에 의존하지 않도록 "n/n 겹침" 텍스트 배지를 항상 병기 (§7 접근성)
export default function RankRow({
  row,
  variant,
  nameOf,
  nonResponderNames,
  actionLabel,
  actionDisabled = false,
  onAction,
}: Props) {
  const isFull = variant === 'full'
  const badge = `${row.count}/${row.responderTotal} 겹침`
  const nudgeSuffix =
    nonResponderNames.length > 0 ? ` · ${nonResponderNames.join(', ')} 미응답` : ''

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
        isFull ? 'border-full-line bg-full-soft' : 'border-duo-line bg-duo-soft'
      }`}
    >
      <div className="min-w-0">
        <p className="text-lg font-black tracking-tight">{formatKo(row.date)}</p>
        <p className={`mt-0.5 text-xs font-bold ${isFull ? 'text-full' : 'text-duo'}`}>
          {badge}
          <span className="font-medium text-ink-dim">{nudgeSuffix}</span>
        </p>
        {!isFull && row.unavailableResponderIds.length > 0 && (
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            {row.unavailableResponderIds.map((id) => (
              <span
                key={id}
                className="rounded-full border border-ink-line px-2 py-0.5 text-xs text-danger line-through"
              >
                {nameOf(id)}
              </span>
            ))}
            <span className="text-xs text-ink-dim">불가</span>
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={actionDisabled}
        className={`min-h-[44px] shrink-0 rounded-xl px-4 text-sm font-bold text-ink-bg disabled:opacity-40 ${
          isFull ? 'bg-full' : 'bg-duo'
        }`}
      >
        {actionLabel}
      </button>
    </li>
  )
}
