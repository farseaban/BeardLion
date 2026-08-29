'use client'

// §5-4-4: 미응답자 넛지 카드 — 목록 최상단 고정
interface Props {
  names: string[]
  onHurry: (name: string) => void
}

export default function NudgeCard({ names, onHurry }: Props) {
  return (
    <section
      aria-label="미응답자 알림"
      className="rounded-2xl border border-warn/40 bg-warn/10 p-4"
    >
      <p className="text-sm font-bold text-warn">
        {names.join(', ')}
        {names.length > 1 ? '가(이) 아직 입력 안 했어요' : '가 아직 입력 안 했어요'}
      </p>
      <p className="mt-1 text-xs text-ink-dim">
        아래 랭킹은 응답자 기준이에요. 재촉해서 판을 완성하세요.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {names.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onHurry(name)}
            className="min-h-[44px] rounded-xl bg-warn px-4 text-sm font-bold text-ink-bg"
          >
            {name} 재촉하기
          </button>
        ))}
      </div>
    </section>
  )
}
