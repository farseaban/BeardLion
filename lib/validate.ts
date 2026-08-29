// 닉네임: 트림 후 1~12자 (문자 종류 제한 없음)
export function validateName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const name = raw.trim()
  if (name.length < 1 || name.length > 12) return null
  return name
}
