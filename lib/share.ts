// 공유 문안 빌더 (사양 §5-6). 서버는 발송하지 않는다 — 클라이언트에서 Web Share/클립보드로만 사용.
import { formatKo } from './dates.ts'

// "8/8(토) 나·지수는 가능! 현우만 되면 확정이야 → {링크}"
export function buildNudge(params: {
  dateIso: string
  availableNames: string[] // 보는 사람 본인은 호출 전에 "나"로 치환
  missingName: string
  link: string
}): string {
  const names = params.availableNames.join('·')
  return `${formatKo(params.dateIso)} ${names}는 가능! ${params.missingName}만 되면 확정이야 → ${params.link}`
}

// "현우야, 30초면 돼. 되는 날만 탭해줘 → {링크}"
export function buildHurry(params: { missingName: string; link: string }): string {
  return `${params.missingName}야, 30초면 돼. 되는 날만 탭해줘 → ${params.link}`
}

// 확정 공유
export function buildFixed(params: { dateIso: string; title: string; link: string }): string {
  return `${formatKo(params.dateIso)} 「${params.title}」 확정! 캘린더에 박아둬 → ${params.link}`
}

// 초대
export function buildInvite(params: { title: string; link: string }): string {
  return `「${params.title}」 되는 날만 탭하면 끝. 앱 설치 없이 바로 참여 → ${params.link}`
}
