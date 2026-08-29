# 당장만나 — 시안 B (겹침 랭킹형)

친구 3명이 링크로 들어와 각자 가능한 날짜를 탭하면, **앞으로 14일을 "겹치는 인원 수" 순으로 랭킹**해 보여주는 웹앱.
전원 겹침은 즉시 픽스, 2/3 겹침은 "찔러보기" 메시지로 나머지 한 명을 설득한다. 로그인 없음.

## 실행

```bash
npm install
npm run dev   # SQLite DB 자동 생성 포함 — 외부 서비스 계정 불요
```

http://localhost:3000 에서 모임을 만들고, 초대 링크(`/m/<slug>/join`)를 시크릿 창 2개로 열면 3인 플로우를 재현할 수 있다.

## 스택

- Next.js 15 (App Router) + TypeScript + React 19
- Tailwind CSS 3
- Prisma 7 (Rust-free) + SQLite, `@prisma/adapter-better-sqlite3` 드라이버 어댑터
- 인증 없음 — 초대는 8자 slug, 본인 식별은 `editToken` 쿠키 (`djm_<slug>`)

## 구조

| 경로 | 역할 |
|---|---|
| `app/page.tsx` | 모임 생성 (§5-1) |
| `app/m/[slug]/join` | 닉네임 참여 · 승계 확인 · 정원 초과 (§5-2) |
| `app/m/[slug]/my` | 14일 날짜 칩 그리드, 자동 저장 (§5-3) |
| `app/m/[slug]` | 겹침 랭킹 화면 — 제품의 본체 (§5-4) |
| `app/api/meetings/**` | JSON API 7종 (생성/상태/참여/승계/가능일/픽스/ics) |
| `lib/overlap.ts` | 겹침 랭킹 계산 (순수 함수, §6) |
| `lib/meeting-state.ts` | 서버 컴포넌트·폴링 GET 공용 상태 조립 |
| `prisma/schema.prisma` | 데이터 모델 (§4 + SystemMessage) |
| `scripts/db-init.mjs` | SQLite 스키마 부트스트랩 (`predev`/`prebuild`에서 실행) |

랭킹 화면은 10초 폴링으로 최신화된다. 공유(찔러보기/재촉/확정)는 Web Share API, 미지원 시 클립보드 복사.

## DB 관련 메모

- `npm run dev`가 `scripts/db-init.mjs`로 `prisma/dev.db`를 만들기 때문에 `prisma db push`가 필요 없다 (네트워크 차단 환경에서도 동작).
- Prisma 클라이언트는 `lib/generated/prisma`에 **커밋되어** 있다. `prisma/schema.prisma`를 바꾸면
  `scripts/db-init.mjs`의 DDL을 함께 수정하고 `npm run db:generate`를 다시 실행할 것.
- 다른 DB로 배포하려면 `DATABASE_URL`과 어댑터(`lib/db.ts`, `prisma.config.ts`)를 교체한다.

## 검증

```bash
npm run dev                                        # 켜둔 상태에서
node scripts/acceptance.mjs                        # 수용 기준 §8 자동 검증 (Playwright, 시크릿 창 3개 상당)
node --experimental-strip-types scripts/unit-overlap.ts  # 겹침 계산 단위 검증
```
