'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatKo, weekdayIndex, windowDates } from '@/lib/dates'
import ConfirmDialog from './ConfirmDialog'
import { useToast } from './Toast'

interface Props {
  slug: string
  windowStartIso: string
  todayIso: string
  initialDates: string[]
  alreadyResponded: boolean
}

// §5-3: 14일 칩 그리드. 탭 토글 + 800ms 디바운스 자동 저장.
// 완료 시 0개 선택이면 "이번 2주 다 안 됨" 확인 → allImpossible로 저장해
// 미응답과 구분되는 응답으로 기록한다 (§8-5).
export default function DateGrid({
  slug,
  windowStartIso,
  todayIso,
  initialDates,
  alreadyResponded,
}: Props) {
  const router = useRouter()
  const { toast, showToast } = useToast()
  const [selected, setSelected] = useState<Set<string>>(new Set(initialDates))
  const [confirmNone, setConfirmNone] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const chips = windowDates(windowStartIso).filter((d) => d >= todayIso)

  const save = useCallback(
    async (dates: string[], allImpossible = false) => {
      setSaving(true)
      const res = await fetch(`/api/meetings/${slug}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates, allImpossible }),
      })
      setSaving(false)
      if (res.status === 401) {
        router.push(`/m/${slug}/join`)
        return false
      }
      if (!res.ok) {
        showToast('저장하지 못했어요. 다시 시도해 주세요.')
        return false
      }
      return true
    },
    [slug, router, showToast],
  )

  function toggle(date: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(date)) next.delete(date)
      else next.add(date)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => save([...next]), 800)
      return next
    })
  }

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  async function onDone() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (selected.size === 0 && !alreadyResponded) {
      setConfirmNone(true)
      return
    }
    if (await save([...selected])) router.push(`/m/${slug}`)
  }

  async function onConfirmNone() {
    setConfirmNone(false)
    if (await save([], true)) router.push(`/m/${slug}`)
  }

  return (
    <div>
      <div role="group" aria-label="가능한 날짜 선택" className="grid grid-cols-2 gap-2">
        {chips.map((date) => {
          const on = selected.has(date)
          const wd = weekdayIndex(date)
          const wdColor = wd === 0 ? 'text-danger' : wd === 6 ? 'text-sat' : 'text-ink-dim'
          return (
            <button
              key={date}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(date)}
              className={`flex min-h-[52px] items-center justify-between rounded-xl border px-4 text-left transition-colors ${
                on
                  ? 'border-full-line bg-full-soft'
                  : 'border-ink-line bg-ink-panel'
              }`}
            >
              <span className={`text-base font-bold ${on ? 'text-full' : ''}`}>
                {formatKo(date).replace(/\(.+\)/, '')}
                <span className={`ml-1 text-sm font-medium ${on ? 'text-full' : wdColor}`}>
                  {formatKo(date).match(/\(.+\)/)?.[0]}
                </span>
              </span>
              <span className={`text-xs font-bold ${on ? 'text-full' : 'text-ink-dim/50'}`}>
                {on ? '가능' : ''}
              </span>
            </button>
          )
        })}
      </div>

      <div className="sticky bottom-0 mt-6 bg-gradient-to-t from-ink-bg via-ink-bg to-transparent pb-2 pt-4">
        <p className="mb-2 text-center text-xs text-ink-dim" aria-live="polite">
          {selected.size > 0 ? `${selected.size}일 선택됨` : '선택한 날짜 없음'}
          {saving ? ' · 저장 중…' : ''}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="min-h-[48px] w-full rounded-xl bg-full text-base font-bold text-ink-bg"
        >
          완료
        </button>
      </div>

      <ConfirmDialog
        open={confirmNone}
        title="이번 2주 다 안 됨으로 기록할까요?"
        body="선택한 날짜가 없어요. 이렇게 저장하면 친구들에게 ‘전부 불가’로 표시돼요."
        confirmLabel="네, 다 안 돼요"
        cancelLabel="다시 고를게요"
        danger
        onConfirm={onConfirmNone}
        onCancel={() => setConfirmNone(false)}
      />
      {toast}
    </div>
  )
}
