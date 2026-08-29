'use client'

import { useCallback, useEffect, useState } from 'react'
import type { MeetingState } from '@/lib/types'

// 랭킹 화면 최신성: 10초 폴링 (§7) + 탭 복귀 시 즉시 갱신 + 뮤테이션 후 refetch
export function useMeetingPoll(slug: string, initialState: MeetingState) {
  const [state, setState] = useState<MeetingState>(initialState)

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(`/api/meetings/${slug}`, { cache: 'no-store' })
      if (res.ok) setState(await res.json())
    } catch {
      // 네트워크 일시 오류는 다음 틱에서 회복
    }
  }, [slug])

  useEffect(() => {
    const id = setInterval(refetch, 10_000)
    function onVisible() {
      if (document.visibilityState === 'visible') refetch()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refetch])

  return { state, refetch }
}
