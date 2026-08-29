// editToken 쿠키 — 모임별 쿠키명이라 한 브라우저로 여러 모임 참여 가능
export function cookieName(slug: string): string {
  return `djm_${slug}`
}

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 60 // 60일

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  }
}
