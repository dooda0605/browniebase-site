'use client'
import { useEffect } from 'react'

export default function MulsokRedirect() {
  useEffect(() => {
    window.location.replace('/badapong/')
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <div className="text-5xl mb-6">🌊</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          이 페이지는 이동했어요 / This page has moved
        </h1>
        <p className="text-gray-600 mb-6">
          Mulsok은 <strong>Badapong</strong>으로 이름이 바뀌었습니다.<br />
          Mulsok is now <strong>Badapong</strong>.
        </p>
        <a
          href="/badapong/"
          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-full font-medium hover:bg-cyan-700 transition-colors"
        >
          Badapong 페이지로 이동 →
        </a>
      </div>
    </main>
  )
}
