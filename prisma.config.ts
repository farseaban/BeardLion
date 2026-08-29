import { defineConfig } from 'prisma/config'

// SQLite 파일 경로 — 리포 루트 기준. 배포 시 DATABASE_URL로 치환 (표준 SQL 스키마 유지)
const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url },
})
