// SQLite 스키마 부트스트랩 — prisma/schema.prisma와 1:1 대응하는 표준 SQL.
// `prisma db push` 대체: 네트워크·외부 서비스 없이 `npm run dev`만으로 DB가 준비된다.
// 스키마를 바꾸면 이 DDL과 schema.prisma를 함께 수정하고 `npm run db:generate`를 실행할 것.
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const file = url.replace(/^file:/, '')

mkdirSync(path.dirname(file), { recursive: true })
const db = new Database(file)
db.pragma('journal_mode = WAL')

db.exec(`
CREATE TABLE IF NOT EXISTS "Meeting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL DEFAULT '당장만나',
  "windowStart" DATETIME NOT NULL,
  "windowEnd" DATETIME NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'collecting',
  "fixedDate" DATETIME,
  "fixedBy" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "Meeting_slug_key" ON "Meeting"("slug");

CREATE TABLE IF NOT EXISTS "Participant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "meetingId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "editToken" TEXT NOT NULL,
  "respondedAt" DATETIME,
  CONSTRAINT "Participant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_editToken_key" ON "Participant"("editToken");
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_meetingId_name_key" ON "Participant"("meetingId", "name");

CREATE TABLE IF NOT EXISTS "Availability" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "participantId" TEXT NOT NULL,
  "date" DATETIME NOT NULL,
  CONSTRAINT "Availability_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Availability_participantId_date_key" ON "Availability"("participantId", "date");

CREATE TABLE IF NOT EXISTS "SystemMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "meetingId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SystemMessage_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
`)

db.close()
console.log(`SQLite ready: ${file}`)
