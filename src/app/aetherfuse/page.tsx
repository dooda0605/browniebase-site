'use client'
import { useState } from 'react'
import BizInfo from '@/components/BizInfo'

type Lang = 'ko' | 'en'

// 구글 플레이 출시 전엔 빈 값 → 「곧 출시」 버튼. 출시되면 아래 주소를 넣고, 홈(src/app/page.tsx) 카드 status 도 함께 바꾼다.
// 'https://play.google.com/store/apps/details?id=com.browniebase.aetherfuse'
const PLAY_URL = ''

// 색은 게임 화면 그대로(짙은 보라 바탕 · 금색 · 연보라 글자) — 디자인 시안 「게임 소개 페이지」
const c = {
  ko: {
    sub: '에테르퓨즈\n싸우다 붙으면 합체!',
    intro: '싸우는 도중 붙은 두 정령을 직접 합쳐 더 강한 정령을 만드는 원소 합체 배틀',
    play: 'Google Play에서 받기',
    soon: 'Google Play 곧 출시',
    features: [
      { tone: '#ffcf3a', title: '같은 원소', desc: '둘을 합치면 한 단계 위로. 최고 단계엔 왕관이 생겨요.' },
      { tone: '#c79bff', title: '다른 원소', desc: '바람과 돌은 모래폭풍, 불과 빛은 태양. 레시피를 찾아 도감을 채워요.' },
      { tone: '#fff6dc', title: '궁극 정령', desc: '레시피 둘을 합치면 판을 뒤집는 궁극 정령이 나와요.' },
    ],
    shotsTitle: '게임 화면',
    shots: ['첫 화면', '싸우는 도중 합체', '궁극 정령의 공명', '원소 도감'],
    privacy: '개인정보처리방침',
    del: '계정 삭제',
    contact: '문의',
  },
  en: {
    sub: 'Spirits that fuse mid-battle',
    intro: 'An elemental merge battle — fuse two touching spirits yourself, right in the middle of the fight.',
    play: 'Get it on Google Play',
    soon: 'Coming soon to Google Play',
    features: [
      { tone: '#ffcf3a', title: 'Same element', desc: 'Fuse two and they rise a tier. The top tier wears a crown.' },
      { tone: '#c79bff', title: 'Different elements', desc: 'Wind and stone make a sandstorm, fire and light a sun. Find every recipe to fill your codex.' },
      { tone: '#fff6dc', title: 'Ultimate spirits', desc: 'Fuse two recipe spirits into an ultimate that turns the tide.' },
    ],
    shotsTitle: 'Screenshots',
    shots: ['Home', 'Fusing mid-battle', 'Ultimate resonance', 'Elemental codex'],
    privacy: 'Privacy Policy',
    del: 'Delete account',
    contact: 'Contact',
  },
} as const

const PLAY_PATH = (
  <path d="M3.6 2.31c-.36.2-.6.59-.6 1.04v17.3c0 .45.24.84.6 1.04l10.18-9.69L3.6 2.31zm12.06 8.65l-2.36 2.24 2.36 2.25 3.34-1.91c.7-.4.7-1.42 0-1.83l-3.34-1.91-.01.16zm-1.4 3.55l-9.4 5.36 8.45-8.04.95 2.68zm0-7.34l-8.45-8.04 9.4 5.36-.95 2.68z" />
)

export default function AetherfusePage() {
  const [lang, setLang] = useState<Lang>('ko')
  const t = c[lang]
  const playInner = (
    <>
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{PLAY_PATH}</svg>
      {PLAY_URL ? t.play : t.soon}
    </>
  )
  const btn = 'inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded-2xl border-[3px] border-[#0b0920] font-bold'

  return (
    <main className="min-h-screen bg-[#100d2e] text-[#fff6dc]">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="/" className="text-sm font-bold text-[#cfc8f5] hover:text-white transition-colors">← Browniebase</a>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs">
          <button onClick={() => setLang('ko')} className={`px-3 py-1 rounded-full font-medium ${lang === 'ko' ? 'bg-[#ffcf3a] text-[#2a1600]' : 'text-[#cfc8f5]'}`}>KO</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full font-medium ${lang === 'en' ? 'bg-[#ffcf3a] text-[#2a1600]' : 'text-[#cfc8f5]'}`}>EN</button>
        </div>
      </nav>

      {/* ── Hero: 게임 첫 화면 그림 위에 로고 ─────────────────────── */}
      <section
        className="bg-cover"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,13,46,.45), #100d2e 95%), url(/aetherfuse/title.webp)',
          backgroundPosition: 'center 38%',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col items-center text-center gap-5">
          <img src="/aetherfuse/logo.webp" alt="Aetherfuse" width={640} height={284} className="w-full max-w-[460px] h-auto" />
          <h1 className="text-2xl sm:text-3xl font-extrabold whitespace-pre-line [text-shadow:0_2px_8px_#0b0920]">{t.sub}</h1>
          <p className="text-base sm:text-lg text-[#e6e1ff] max-w-xl [text-shadow:0_1px_6px_#0b0920]">{t.intro}</p>
          {PLAY_URL ? (
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#ffcf3a] text-[#2a1600] hover:brightness-110`}>{playInner}</a>
          ) : (
            <span aria-disabled="true" className={`${btn} bg-[#2a2566] text-[#cfc8f5]`}>{playInner}</span>
          )}
        </div>
      </section>

      {/* ── 화면(폰에서 합체 설명보다 먼저 보이게) ──────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <h2 className="text-2xl font-extrabold mb-5">{t.shotsTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {t.shots.map((cap, i) => (
            <figure key={cap}>
              <img src={`/aetherfuse/shot${i + 1}.webp`} alt={cap} loading="lazy" width={540} height={960}
                   className="w-full h-auto rounded-2xl border-[3px] border-[#0b0920]" />
              <figcaption className="mt-2 text-xs sm:text-sm text-[#cfc8f5] text-center">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 합체 셋 ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.features.map(f => (
            <div key={f.title} className="rounded-3xl border-[3px] border-[#0b0920] bg-[#2a2566] p-5">
              <h2 className="text-xl font-extrabold mb-1.5" style={{ color: f.tone }}>{f.title}</h2>
              <p className="text-sm leading-relaxed text-[#cfc8f5]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-[#0b0920] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <img src="/aetherfuse/icon.webp" alt="" width={32} height={32} className="w-8 h-8 rounded-lg" />
            <span className="font-bold">Aetherfuse</span>
            <span className="text-[#a9a2d8] text-sm">/ 에테르퓨즈 · by Browniebase</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
            <a href="/aetherfuse/privacy/" className="text-[#ffcf3a] hover:text-[#ffe28a]">{t.privacy}</a>
            <a href="/aetherfuse/delete-account/" className="text-[#ffcf3a] hover:text-[#ffe28a]">{t.del}</a>
            <a href="mailto:support@browniebase.com" className="text-[#ffcf3a] hover:text-[#ffe28a]">{t.contact}</a>
          </div>
          <p className="text-[#a9a2d8] text-sm mt-6">© 2026 Browniebase. All rights reserved.</p>
          {/* 사이버몰 운영자 표시(전자상거래법 제10조) — 값·근거는 BizInfo.tsx. 거기 정책 링크는 바다퐁 것이라 끔 */}
          <BizInfo lang={lang} showPolicyLinks={false} className="mt-4 text-[#a9a2d8]" />
        </div>
      </footer>
    </main>
  )
}
