import { NextResponse } from 'next/server'

export type ErrorCode =
  | 'NOT_FOUND'
  | 'INVALID_NAME'
  | 'INVALID_BODY'
  | 'CAPACITY_FULL'
  | 'DUPLICATE_NAME'
  | 'NO_SUCH_NAME'
  | 'NO_IDENTITY'
  | 'DATE_OUT_OF_WINDOW'
  | 'NOT_FULL_OVERLAP'
  | 'ALREADY_FIXED'
  | 'NOT_FIXED'
  | 'NOT_FIXER'

export function jsonError(status: number, code: ErrorCode, message: string) {
  return NextResponse.json({ error: { code, message } }, { status })
}
