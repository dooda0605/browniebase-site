'use client'
import { useEffect, useState } from 'react'
import { storeUrl } from '../store'

/**
 * /badapong/get — 스마트 리다이렉트
 * 접속 기기를 판별해 해당 스토어로 즉시 이동시킨다.
 * 고관여 채널(인스타 스토리·DM·릴스 댓글)용. 프로필 링크는 랜딩(/badapong/)을 유지.
 *
 * ?src= 로 유입 채널을 구분해 스토어 캠페인 파라미터에 실어 보낸다.
 *   예: /badapong/get/?src=ig_bio  ·  ?src=ig_story  ·  ?src=reel02
 * 정적 export라 서버 리다이렉트가 불가능해 클라이언트에서 처리한다.
 */
export default function GetPage() {
  const [fallback, setFallback] = useState<{ ios: string; android: string } | null>(null)

  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get('src') || 'link'
    const ua = navigator.userAgent || ''
    const ios = storeUrl('ios', src)
    const android = storeUrl('android', src)

    if (/iPhone|iPad|iPod/i.test(ua)) {
      window.location.replace(ios)
      return
    }
    if (/Android/i.test(ua)) {
      window.location.replace(android)
      return
    }
    // PC·기타: 자동 이동 대신 선택지를 보여준다 (스토어 웹페이지는 설치가 안 되므로)
    setFallback({ ios, android })
  }, [])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        <img src="/badapong-icon.png" alt="Badapong" width={80} height={80}
             className="w-20 h-20 rounded-[18px] shadow-lg shadow-cyan-500/20 mx-auto" />
        <h1 className="mt-5 text-2xl font-bold text-gray-900">Badapong · 바다퐁</h1>
        <p className="mt-2 text-gray-500 text-sm">
          {fallback ? '기기에 맞는 스토어를 선택하세요' : '스토어로 이동 중…'}
        </p>

        {fallback && (
          <div className="mt-6 flex flex-col gap-3">
            <a href={fallback.ios} className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              App Store
            </a>
            <a href={fallback.android} className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Google Play
            </a>
            <a href="/badapong/" className="mt-2 text-sm text-cyan-700 hover:underline">
              앱 소개 보기 →
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
