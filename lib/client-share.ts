'use client'

// Web Share API → 미지원 시 클립보드 복사 (사양 §5-6)
export async function shareText(text: string): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch (e) {
      // 사용자가 공유 시트를 닫은 경우 등 — 클립보드로 폴백하지 않고 조용히 종료
      if (e instanceof DOMException && e.name === 'AbortError') return 'failed'
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
