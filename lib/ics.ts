// 종일 일정 .ics 생성 (사양 §5-5 확정 배너의 캘린더 다운로드)
import { addDaysIso } from './dates'

function icsDate(iso: string): string {
  return iso.replaceAll('-', '')
}

function escapeText(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function buildIcs(params: { title: string; dateIso: string; uid: string }): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dangjangnana//ko',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${params.uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${icsDate(params.dateIso)}`,
    `DTEND;VALUE=DATE:${icsDate(addDaysIso(params.dateIso, 1))}`,
    `SUMMARY:${escapeText(params.title)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n') + '\r\n'
}
