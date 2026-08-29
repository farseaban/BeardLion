import { randomBytes, randomInt } from 'crypto'

const SLUG_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789' // 혼동 문자(l,1,o,0,i) 제외

// 초대 링크용 8자 영숫자 토큰
export function generateSlug(): string {
  let out = ''
  for (let i = 0; i < 8; i++) out += SLUG_ALPHABET[randomInt(SLUG_ALPHABET.length)]
  return out
}

// 본인 입력 수정용 토큰 (쿠키 저장)
export function generateEditToken(): string {
  return randomBytes(16).toString('hex')
}
