'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useMeetingPoll } from '@/hooks/useMeetingPoll'
import { buildFixed, buildHurry, buildInvite, buildNudge } from '@/lib/share'
import { shareText } from '@/lib/client-share'
import { formatKo } from '@/lib/dates'
import type { MeetingState } from '@/lib/types'
import type { RankedDate } from '@/lib/overlap'
import ConfirmDialog from './ConfirmDialog'
import FixedBanner from './FixedBanner'
import NudgeCard from './NudgeCard'
import RankRow from './RankRow'
import { useToast } from './Toast'

// §5-4 랭킹 화면
export default function RankingScreen({ initialState }: { initialState: MeetingState }) {
  const { state, refetch } = useMeetingPoll(initialState.slug, initialState)
  const { toast, showToast } = useToast()
  const [fixTarget, setFixTarget] = useState<string | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)

  const nameOf = useMemo(() => {
    const map = new Map(state.participants.map((p) => [p.id, p.name]))
    return (id: string) => map.get(id) ?? '?'
  }, [state.participants])

  const nonResponderNames = state.ranking.nonResponderIds.map(nameOf)
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/m/${state.slug}` : `/m/${state.slug}`
  const allResponded = state.ranking.nonResponderIds.length === 0
  const showEmptyState =
    allResponded && state.participants.length >= 2 && state.ranking.fullOverlap.length === 0

  async function doShare(text: string) {
    const result = await shareText(text)
    if (result === 'copied') showToast('복사했어요. 단톡방에 붙여넣기!')
    else if (result === 'failed') showToast('공유하지 못했어요.')
  }

  // §5-6 찔러보기: 보는 사람 본인은 "나"로, 맨 앞으로
  function nudge(row: RankedDate) {
    const missing = row.unavailableResponderIds.map(nameOf).join(', ')
    const available = row.availableIds
      .map((id) => (state.me && id === state.me.id ? '나' : nameOf(id)))
      .sort((a, b) => (a === '나' ? -1 : b === '나' ? 1 : 0))
    doShare(buildNudge({ dateIso: row.date, availableNames: available, missingName: missing, link: inviteLink }))
  }

  function hurry(name: string) {
    doShare(buildHurry({ missingName: name, link: `${inviteLink}/my` }))
  }

  async function confirmFix() {
    if (!fixTarget) return
    const dateIso = fixTarget
    setFixTarget(null)
    const res = await fetch(`/api/meetings/${state.slug}/fix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateIso }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      showToast(data?.error?.message ?? '확정하지 못했어요.')
    }
    refetch()
  }

  async function confirmCancel() {
    setCancelOpen(false)
    const res = await fetch(`/api/meetings/${state.slug}/fix`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      showToast(data?.error?.message ?? '취소하지 못했어요.')
    }
    refetch()
  }

  return (
    <main>
      <header className="mb-5 mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-full">당장만나</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight">{state.title}</h1>
          {state.me && (
            <Link
              href={`/m/${state.slug}/my`}
              className="flex min-h-[44px] shrink-0 items-center rounded-xl border border-ink-line px-3 text-xs font-medium text-ink-dim"
            >
              내 날짜 수정
            </Link>
          )}
        </div>
        <p className="mt-2 text-xs text-ink-dim">
          참여자{' '}
          {state.participants.map((p, i) => (
            <span key={p.id}>
              {i > 0 && ' · '}
              <span className={p.responded ? '' : 'text-warn'}>
                {p.name}
                {p.responded ? '' : '(미응답)'}
              </span>
            </span>
          ))}{' '}
          ({state.participants.length}/{state.capacity}명)
        </p>
      </header>

      <div className="space-y-4">
        {!state.me && (
          <Link
            href={`/m/${state.slug}/join`}
            className="flex min-h-[48px] items-center justify-center rounded-2xl bg-full text-base font-bold text-ink-bg"
          >
            나도 참여하기
          </Link>
        )}

        {state.fixed ? (
          <FixedBanner
            slug={state.slug}
            dateIso={state.fixed.dateIso}
            byName={state.fixed.byName}
            canCancel={state.me?.id === state.fixed.byId}
            onShare={() =>
              doShare(buildFixed({ dateIso: state.fixed!.dateIso, title: state.title, link: inviteLink }))
            }
            onCancel={() => setCancelOpen(true)}
          />
        ) : (
          <>
            {state.me && state.participants.length < state.capacity && (
              <section className="rounded-2xl border border-ink-line bg-ink-panel p-4">
                <p className="text-sm font-bold">아직 {state.capacity - state.participants.length}명 더 올 수 있어요</p>
                <p className="mt-1 text-xs text-ink-dim">링크를 단톡방에 던지세요. 앱 설치 없이 바로 참여됩니다.</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(`${inviteLink}/join`)
                        showToast('초대 링크를 복사했어요!')
                      } catch {
                        showToast('복사하지 못했어요.')
                      }
                    }}
                    className="min-h-[44px] flex-1 rounded-xl border border-ink-line text-sm font-bold text-ink-text"
                  >
                    링크 복사
                  </button>
                  <button
                    type="button"
                    onClick={() => doShare(buildInvite({ title: state.title, link: `${inviteLink}/join` }))}
                    className="min-h-[44px] flex-1 rounded-xl bg-duo text-sm font-bold text-ink-bg"
                  >
                    공유하기
                  </button>
                </div>
              </section>
            )}

            {nonResponderNames.length > 0 && (
              <NudgeCard names={nonResponderNames} onHurry={hurry} />
            )}

            {state.ranking.fullOverlap.length > 0 && (
              <section aria-labelledby="full-heading">
                <h2 id="full-heading" className="mb-2 text-sm font-bold text-full">
                  전원 가능 {!allResponded && <span className="font-medium text-ink-dim">(응답자 기준)</span>}
                </h2>
                <ul className="space-y-2">
                  {state.ranking.fullOverlap.map((row) => (
                    <RankRow
                      key={row.date}
                      row={row}
                      variant="full"
                      nameOf={nameOf}
                      nonResponderNames={nonResponderNames}
                      actionLabel="픽스"
                      actionDisabled={!state.me}
                      onAction={() => setFixTarget(row.date)}
                    />
                  ))}
                </ul>
              </section>
            )}

            {showEmptyState && (
              <section className="rounded-2xl border border-ink-line bg-ink-panel p-5 text-center">
                <p className="text-sm font-bold">완전히 겹치는 날이 없어요</p>
                <p className="mt-1 text-xs text-ink-dim">
                  2명 겹침에서 한 명을 설득해 보세요.
                </p>
                {state.ranking.duoOverlap.length > 0 && (
                  <a
                    href="#duo-heading"
                    className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-duo px-4 text-sm font-bold text-ink-bg"
                  >
                    2명 겹침 보러 가기
                  </a>
                )}
              </section>
            )}

            {state.ranking.duoOverlap.length > 0 && (
              <section aria-labelledby="duo-heading">
                <h2 id="duo-heading" className="mb-2 scroll-mt-4 text-sm font-bold text-duo">
                  2명 겹침 {!allResponded && <span className="font-medium text-ink-dim">(응답자 기준)</span>}
                </h2>
                <ul className="space-y-2">
                  {state.ranking.duoOverlap.map((row) => (
                    <RankRow
                      key={row.date}
                      row={row}
                      variant="duo"
                      nameOf={nameOf}
                      nonResponderNames={nonResponderNames}
                      actionLabel="찔러보기"
                      onAction={() => nudge(row)}
                    />
                  ))}
                </ul>
              </section>
            )}

            {state.ranking.fullOverlap.length === 0 &&
              state.ranking.duoOverlap.length === 0 &&
              !showEmptyState && (
                <p className="rounded-2xl border border-ink-line bg-ink-panel p-5 text-center text-sm text-ink-dim">
                  아직 겹치는 날이 없어요. 날짜를 입력하면 여기서 랭킹이 올라와요.
                </p>
              )}
          </>
        )}

        {state.systemMessages.length > 0 && (
          <section aria-label="알림 기록" className="space-y-1 pt-2">
            {state.systemMessages.map((m, i) => (
              <p key={i} className="text-xs text-ink-dim/70">
                {m.body}
              </p>
            ))}
          </section>
        )}
      </div>

      <ConfirmDialog
        open={fixTarget !== null}
        title={fixTarget ? `${formatKo(fixTarget)}로 확정할까요?` : ''}
        body="확정 후엔 전원 화면에 고정됩니다."
        confirmLabel="픽스!"
        cancelLabel="아직이요"
        onConfirm={confirmFix}
        onCancel={() => setFixTarget(null)}
      />
      <ConfirmDialog
        open={cancelOpen}
        title="확정을 취소할까요?"
        body="취소 기록이 참여자 전원에게 표시돼요."
        confirmLabel="확정 취소"
        cancelLabel="유지하기"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelOpen(false)}
      />
      {toast}
    </main>
  )
}
