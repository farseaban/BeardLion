// 수용 기준(사양 §8) 자동 검증. 실행: node scripts/acceptance.mjs
// 전제: npm run dev 가 localhost:3000 에 떠 있을 것.
// 독립 브라우저 컨텍스트 3개 = 시크릿 창 3개 (쿠키 격리).
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
let passed = 0
let failed = 0

function ok(cond, label, extra = '') {
  if (cond) {
    passed++
    console.log(`  ✅ ${label}`)
  } else {
    failed++
    console.log(`  ❌ ${label}${extra ? ` — ${extra}` : ''}`)
  }
}

function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// 샌드박스의 사전 설치 크로뮴 사용 (headless shell 미설치 환경 대응)
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || chromium.executablePath(),
})

async function newCtx() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE })
  return ctx
}

// ---------- 시나리오 A: 본 플로우 ----------
console.log('\n[A] 생성 → 3인 참여 → 랭킹 → 찔러보기 → 승계 → 픽스')
const ctx1 = await newCtx()
const ctx2 = await newCtx()
const ctx3 = await newCtx()

// 지수가 생성
const p1 = await ctx1.newPage()
await p1.goto(`${BASE}/`)
await p1.fill('#title', '금요모임')
await p1.fill('#name', '지수')
await p1.click('button[type=submit]')
await p1.waitForURL(/\/m\/\w+$/)
const slug = p1.url().split('/').pop()
console.log(`  meeting slug: ${slug}`)

// 창 시작일을 API에서 얻는다
const stateRes = await ctx1.request.get(`${BASE}/api/meetings/${slug}`)
const st0 = await stateRes.json()
const d = (n) => addDays(st0.windowStartIso, n)

// 민재·현우 참여 (각자 다른 브라우저 컨텍스트)
for (const [ctx, name] of [[ctx2, '민재'], [ctx3, '현우']]) {
  const pg = await ctx.newPage()
  await pg.goto(`${BASE}/m/${slug}/join`)
  await pg.fill('#join-name', name)
  await pg.click('button[type=submit]')
  await pg.waitForURL(/\/my$/)
  await pg.close()
}
const st1 = await (await ctx1.request.get(`${BASE}/api/meetings/${slug}`)).json()
ok(st1.participants.length === 3, '§8-1 시크릿 창 3개로 3인 참여')

// §8-7: 4번째 참여 차단
const ctx5 = await newCtx()
const p5 = await ctx5.newPage()
await p5.goto(`${BASE}/m/${slug}/join`)
await p5.waitForSelector('text=정원 초과')
// UI 차단에 더해 API 직접 호출도 409로 차단되는지 확인
const joinRes = await ctx5.request.post(`${BASE}/api/meetings/${slug}/participants`, {
  data: { name: '침입자' },
})
const st2 = await (await ctx1.request.get(`${BASE}/api/meetings/${slug}`)).json()
ok(
  joinRes.status() === 409 && st2.participants.length === 3,
  '§8-7 4번째 참여 시도 차단 (정원 초과 안내 + API 409 + 3인 유지)',
)
await ctx5.close()

// 지수·민재만 날짜 입력 → 현우 미응답 상태
await ctx1.request.put(`${BASE}/api/meetings/${slug}/availability`, {
  data: { dates: [d(0), d(1), d(4)] },
})
await ctx2.request.put(`${BASE}/api/meetings/${slug}/availability`, {
  data: { dates: [d(0), d(1), d(2), d(4)] },
})

// §8-4: 넛지 카드 최상단 + "응답자 기준" 라벨
await p1.goto(`${BASE}/m/${slug}`)
await p1.waitForSelector('text=아직 입력 안 했어요')
const nudgeText = await p1.locator('section[aria-label="미응답자 알림"]').textContent()
ok(nudgeText.includes('현우'), '§8-4 넛지 카드에 미응답자 이름(현우) 표시')
const fullHeading = await p1.locator('#full-heading').textContent()
ok(fullHeading.includes('응답자 기준'), '§8-4 랭킹 라벨 "응답자 기준" 표기')
const firstBadge = await p1.locator('li >> text=/겹침/').first().textContent()
ok(firstBadge.includes('2/2 겹침') && firstBadge.includes('현우 미응답'),
  '§8-4 "2/2 겹침 · 현우 미응답" 형식 라벨', `got: ${firstBadge}`)

// 재촉하기 문안
await p1.click('button:has-text("현우 재촉하기")')
await p1.waitForSelector('text=복사했어요')
const hurryMsg = await p1.evaluate(() => navigator.clipboard.readText())
ok(hurryMsg.includes('현우야, 30초면 돼') && hurryMsg.includes(`/m/${slug}/my`),
  '§5-6 재촉 문안에 이름·링크 포함', `got: ${hurryMsg}`)

// 현우가 UI 탭으로 날짜 입력 (d0 제외 → d1, d4만)
const p3 = await ctx3.newPage()
await p3.goto(`${BASE}/m/${slug}/my`)
for (const day of [d(1), d(4)]) {
  const label = `${Number(day.slice(5, 7))}/${Number(day.slice(8, 10))}`
  await p3.click(`button:has-text("${label}(")`)
}
await p3.click('button:has-text("완료")')
await p3.waitForURL(new RegExp(`/m/${slug}$`))

// §8-2 랭킹 정렬: full=[d1,d4] 오름차순, duo=[d0], d2(민재만)는 미표시
const st3 = await (await ctx1.request.get(`${BASE}/api/meetings/${slug}`)).json()
ok(
  JSON.stringify(st3.ranking.fullOverlap.map((r) => r.date)) === JSON.stringify([d(1), d(4)]),
  '§8-2 전원 겹침 [d1,d4] 오름차순',
  JSON.stringify(st3.ranking.fullOverlap.map((r) => r.date)),
)
ok(
  JSON.stringify(st3.ranking.duoOverlap.map((r) => r.date)) === JSON.stringify([d(0)]),
  '§8-2 2명 겹침 [d0]',
)
ok(
  !JSON.stringify(st3.ranking).includes(d(2)),
  '§8-2 1명 이하 겹침 날짜(d2) 미표시',
)

// §8-3 찔러보기 문안: 현우 불가 → "나·민재는 가능! 현우만 되면 확정이야"
await p1.reload()
await p1.click('button:has-text("찔러보기")')
await p1.waitForSelector('text=복사했어요')
const nudgeMsg = await p1.evaluate(() => navigator.clipboard.readText())
ok(
  nudgeMsg.includes('나·민재는 가능') && nudgeMsg.includes('현우만 되면 확정이야'),
  '§8-3 찔러보기 문안에 불가자 이름 정확히 포함',
  `got: ${nudgeMsg}`,
)

// §8-8 과거 날짜 미노출 (UI): 오늘 이전 날짜 칩/행 없음 — 창 시작이 내일이므로
// 서버 검증으로 보강: 과거 날짜 저장 시도는 400
const past = addDays(st3.todayIso, -1)
const pastRes = await ctx1.request.put(`${BASE}/api/meetings/${slug}/availability`, {
  data: { dates: [past] },
})
ok(pastRes.status() === 400, '§8-8 과거 날짜 저장 거부(400)')

// §8-6 쿠키 유실 승계: 새 컨텍스트에서 현우로 재입장
const ctx4 = await newCtx()
const p4 = await ctx4.newPage()
await p4.goto(`${BASE}/m/${slug}/join`)
// 정원이 찬 모임에서 쿠키 유실자는 "기존 닉네임으로 이어받기" 경로로 진입
await p4.click('button:has-text("기존 닉네임으로 이어받기")')
await p4.fill('#join-name', '현우')
await p4.click('button[type=submit]')
await p4.waitForSelector('text=참여한 기록이 있어요')
ok(true, '§8-6 같은 닉네임 재입장 시 승계 확인 화면')
await p4.click('button:has-text("이어받기")')
await p4.waitForURL(/\/my$/)
const st4 = await (await ctx4.request.get(`${BASE}/api/meetings/${slug}`)).json()
ok(
  st4.me?.name === '현우' && JSON.stringify(st4.me.dates) === JSON.stringify([d(1), d(4)]),
  '§8-6 승계 후 기존 입력 유지',
  JSON.stringify(st4.me),
)
await ctx4.close()

// §8-2(전파) 픽스: ctx2가 랭킹 화면을 미리 열어두고, ctx1이 픽스 → 10초 폴링으로 배너 전환
const p2 = await ctx2.newPage()
await p2.goto(`${BASE}/m/${slug}`)
await p1.reload()
await p1.locator(`li:has-text("${Number(d(1).slice(5, 7))}/${Number(d(1).slice(8, 10))}")`).locator('button:has-text("픽스")').click()
await p1.click('button:has-text("픽스!")')
await p1.waitForSelector('text=확정')
const bannerSeen = await p2
  .waitForSelector('section[aria-label="확정된 날짜"]', { timeout: 12000 })
  .then(() => true)
  .catch(() => false)
ok(bannerSeen, '§8-2 픽스 후 다른 브라우저가 12초 내 확정 배너로 전환 (10초 폴링)')

// .ics 다운로드 응답
const icsRes = await ctx1.request.get(`${BASE}/api/meetings/${slug}/ics`)
const icsBody = await icsRes.text()
ok(
  icsRes.status() === 200 && icsBody.includes('BEGIN:VEVENT') && icsBody.includes(d(1).replaceAll('-', '')),
  '§5-5 .ics 다운로드에 확정 날짜 포함',
)

await ctx1.close()
await ctx2.close()
await ctx3.close()

// ---------- 시나리오 B: "이번 2주 다 안 됨" ≠ 미응답 ----------
console.log('\n[B] 전부 불가 선언은 미응답이 아니다')
const b1 = await newCtx()
const b2 = await newCtx()
const b3 = await newCtx()
const q1 = await b1.newPage()
await q1.goto(`${BASE}/`)
await q1.fill('#name', 'A')
await q1.click('button[type=submit]')
await q1.waitForURL(/\/m\/\w+$/)
const slugB = q1.url().split('/').pop()
const stB = await (await b1.request.get(`${BASE}/api/meetings/${slugB}`)).json()
const e = (n) => addDays(stB.windowStartIso, n)
for (const [ctx, name] of [[b2, 'B'], [b3, 'C']]) {
  const pg = await ctx.newPage()
  await pg.goto(`${BASE}/m/${slugB}/join`)
  await pg.fill('#join-name', name)
  await pg.click('button[type=submit]')
  await pg.waitForURL(/\/my$/)
  await pg.close()
}
await b1.request.put(`${BASE}/api/meetings/${slugB}/availability`, { data: { dates: [e(0), e(1)] } })
await b2.request.put(`${BASE}/api/meetings/${slugB}/availability`, { data: { dates: [e(0), e(1)] } })

// C가 UI에서 0개 선택으로 완료 → "이번 2주 다 안 됨" 확인 모달
const q3 = await b3.newPage()
await q3.goto(`${BASE}/m/${slugB}/my`)
await q3.click('button:has-text("완료")')
await q3.waitForSelector('text=이번 2주 다 안 됨으로 기록할까요?')
await q3.click('button:has-text("네, 다 안 돼요")')
await q3.waitForURL(new RegExp(`/m/${slugB}$`))
const stB2 = await (await b1.request.get(`${BASE}/api/meetings/${slugB}`)).json()
ok(stB2.ranking.nonResponderIds.length === 0, '§8-5 전부 불가 선언자는 미응답자가 아님')
const cRow = stB2.participants.find((p) => p.name === 'C')
ok(cRow.responded && cRow.dates.length === 0, '§8-5 응답함 + 선택 0개로 기록')
ok(
  stB2.ranking.fullOverlap.length === 0 &&
    JSON.stringify(stB2.ranking.duoOverlap.map((r) => r.date)) === JSON.stringify([e(0), e(1)]),
  '§8-5 전부 불가가 분모에 포함되어 전원 겹침이 성립하지 않음 (2/3로 강등)',
)
// 넛지 카드 부재 + 빈 상태 안내
const q1b = await b1.newPage()
await q1b.goto(`${BASE}/m/${slugB}`)
const nudgeCount = await q1b.locator('section[aria-label="미응답자 알림"]').count()
ok(nudgeCount === 0, '§8-5 넛지 카드 미표시')
await q1b.waitForSelector('text=완전히 겹치는 날이 없어요')
ok(true, '§5-4-5 전원 응답 & 전원 겹침 0건 빈 상태 문구')

await b1.close()
await b2.close()
await b3.close()
await browser.close()

console.log(`\n결과: ${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
