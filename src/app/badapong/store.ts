'use client'
import { useEffect, useState } from 'react'

export const APP_STORE_URL = 'https://apps.apple.com/app/id6768805465'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.browniebase.badapong'

/**
 * 유입 채널 추적용 스토어 링크.
 * Play는 install referrer(Play Console 획득 보고서), Apple은 ct 캠페인 파라미터로 잡힌다.
 */
export function storeUrl(target: 'ios' | 'android', source = 'site') {
  if (target === 'android') {
    const referrer = `utm_source=${source}&utm_medium=referral&utm_campaign=badapong`
    return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`
  }
  return `${APP_STORE_URL}?ct=${encodeURIComponent(source)}&mt=8`
}

/** 접속 기기 판별. SSR/정적 렌더 시엔 null → 양쪽 버튼을 기본 순서로 노출. */
export function useDeviceOS() {
  const [os, setOs] = useState<'ios' | 'android' | null>(null)
  useEffect(() => {
    const ua = navigator.userAgent || ''
    if (/iPhone|iPad|iPod/i.test(ua)) setOs('ios')
    else if (/Android/i.test(ua)) setOs('android')
  }, [])
  return os
}
