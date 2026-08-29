// computeRanking 단위 검증 — 순수 함수라 합성 todayIso 주입으로 창 중간 경과를 재현.
// 실행: node --experimental-strip-types scripts/unit-overlap.ts
import { computeRanking } from '../lib/overlap.ts'
import { buildNudge, buildHurry } from '../lib/share.ts'

let failed = 0
function ok(cond: boolean, label: string) {
  console.log(`  ${cond ? '✅' : '❌'} ${label}`)
  if (!cond) failed++
}

const P = (id: string, responded: boolean, dates: string[]) => ({ id, name: id, responded, dates })

// 창: 2026-09-01 ~ 09-14. 오늘이 9/5라고 가정 (창 중간 경과)
const r = computeRanking(
  [
    P('지수', true, ['2026-09-02', '2026-09-06', '2026-09-10']),
    P('민재', true, ['2026-09-02', '2026-09-06', '2026-09-10']),
    P('현우', true, ['2026-09-02', '2026-09-06']),
  ],
  '2026-09-01',
  '2026-09-05',
)
ok(
  !JSON.stringify(r).includes('2026-09-02'),
  '§8-8 창 중간 경과: 지난 날짜(9/2)는 전원 겹침이어도 랭킹에서 제외',
)
ok(
  JSON.stringify(r.fullOverlap.map((x) => x.date)) === JSON.stringify(['2026-09-06']),
  '전원 겹침 = [9/6]',
)
ok(
  JSON.stringify(r.duoOverlap.map((x) => x.date)) === JSON.stringify(['2026-09-10']),
  '2명 겹침 = [9/10], 불가자=현우',
)
ok(r.duoOverlap[0].unavailableResponderIds[0] === '현우', '불가자 식별 정확')

// 미응답자 분모 제외
const r2 = computeRanking(
  [P('지수', true, ['2026-09-06']), P('민재', true, ['2026-09-06']), P('현우', false, [])],
  '2026-09-01',
  '2026-09-01',
)
ok(
  r2.fullOverlap.length === 1 && r2.fullOverlap[0].count === 2 && r2.fullOverlap[0].responderTotal === 2,
  '미응답자는 분모 제외 → 2/2 겹침',
)
ok(r2.nonResponderIds.length === 1, '미응답자 넛지 목록 분리')

// 겹침 1명 이하 미표시
const r3 = computeRanking(
  [P('지수', true, ['2026-09-06']), P('민재', true, []), P('현우', true, [])],
  '2026-09-01',
  '2026-09-01',
)
ok(r3.fullOverlap.length === 0 && r3.duoOverlap.length === 0, '겹침 1명 이하 날짜 미표시')

// 공유 문안
ok(
  buildNudge({
    dateIso: '2026-08-08',
    availableNames: ['나', '지수'],
    missingName: '현우',
    link: 'L',
  }) === '8/8(토) 나·지수는 가능! 현우만 되면 확정이야 → L',
  '§8-3 찔러보기 문안 형식',
)
ok(buildHurry({ missingName: '현우', link: 'L' }) === '현우야, 30초면 돼. 되는 날만 탭해줘 → L', '재촉 문안 형식')

console.log(failed === 0 ? '\nunit: all passed' : `\nunit: ${failed} failed`)
process.exit(failed ? 1 : 0)
