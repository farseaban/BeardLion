// KST(Asia/Seoul) 달력일을 "YYYY-MM-DD" 문자열로 다루는 유틸.
// DB 저장은 해당 달력일의 UTC 자정(Date), 표시는 항상 이 모듈을 거친다.

const KST_DAY_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'] as const

export function todayKst(now: Date = new Date()): string {
  return KST_DAY_FMT.format(now)
}

export function isoToUtcMidnight(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

export function utcMidnightToIso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function addDaysIso(iso: string, n: number): string {
  const d = isoToUtcMidnight(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return utcMidnightToIso(d)
}

// 0=일 … 6=토 (UTC 자정 인코딩이므로 getUTCDay가 곧 해당 달력일의 요일)
export function weekdayIndex(iso: string): number {
  return isoToUtcMidnight(iso).getUTCDay()
}

// "8/22(토)"
export function formatKo(iso: string): string {
  const d = isoToUtcMidnight(iso)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}(${WEEKDAYS_KO[d.getUTCDay()]})`
}

// windowStart부터 14일 연속 iso 배열
export function windowDates(windowStartIso: string): string[] {
  return Array.from({ length: 14 }, (_, i) => addDaysIso(windowStartIso, i))
}

export function isValidIsoDate(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(isoToUtcMidnight(v).getTime())
}
