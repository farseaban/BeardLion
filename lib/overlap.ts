// 겹침 랭킹 계산 (사양 §6) — 순수 함수, DB·시계 의존 없음.
import { windowDates } from './dates.ts'

export interface RankingParticipant {
  id: string
  name: string
  responded: boolean // respondedAt != null ("전부 불가" 선언 포함)
  dates: string[] // "YYYY-MM-DD"
}

export interface RankedDate {
  date: string
  count: number // 이 날짜를 선택한 응답자 수
  responderTotal: number // 분모 = 전체 응답자 수
  availableIds: string[]
  unavailableResponderIds: string[] // 응답했지만 이 날짜는 불가한 사람
}

export interface Ranking {
  responderIds: string[]
  nonResponderIds: string[]
  fullOverlap: RankedDate[] // count === responderTotal && count >= 2, 날짜 오름차순
  duoOverlap: RankedDate[] // count === 2 && count < responderTotal, 날짜 오름차순
}

export function computeRanking(
  participants: RankingParticipant[],
  windowStartIso: string,
  todayIso: string,
): Ranking {
  const responders = participants.filter((p) => p.responded)
  const responderIds = responders.map((p) => p.id)
  const nonResponderIds = participants.filter((p) => !p.responded).map((p) => p.id)
  const responderTotal = responders.length

  const candidates = windowDates(windowStartIso).filter((d) => d >= todayIso)

  const ranked: RankedDate[] = candidates.map((date) => {
    const availableIds = responders.filter((p) => p.dates.includes(date)).map((p) => p.id)
    return {
      date,
      count: availableIds.length,
      responderTotal,
      availableIds,
      unavailableResponderIds: responderIds.filter((id) => !availableIds.includes(id)),
    }
  })

  // 미응답자는 분모에서 제외 (§6). 0개 선택 응답자는 분모에 남아
  // "전부 불가"와 "미응답"이 구분된다 (§8-5).
  return {
    responderIds,
    nonResponderIds,
    fullOverlap: ranked.filter((r) => r.count >= 2 && r.count === responderTotal),
    duoOverlap: ranked.filter((r) => r.count === 2 && r.count < responderTotal),
  }
}
