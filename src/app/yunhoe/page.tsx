'use client'
import { useState } from 'react'
import BizInfo from '@/components/BizInfo'

type Lang = 'ko' | 'en'

// 출시 전엔 빈 값 → 「곧 출시」. 출시되면 주소를 넣고, 홈(src/app/page.tsx) 카드 status 도 함께 바꾼다.
// 'https://apps.apple.com/kr/app/…' · 'https://play.google.com/store/apps/details?id=com.browniebase.yunhoe'
const APP_STORE_URL = ''
const PLAY_URL = ''

// 색은 게임 화면 그대로(민화 옷: 한지 바탕 · 먹 테두리 · 오방색, 번지지 않는 판화 그림자) — yunhoe docs/style.md
const c = {
  ko: {
    name: '윤회: 인생 시뮬레이션',
    sub: '태어난 날로 시작해\n여든 살까지 살아 보기',
    intro: '시간표를 짜고 갈림길에서 고르며 한 사람의 인생을 처음부터 끝까지 살아 보는 인생 시뮬레이션 게임이에요.',
    appStore: 'App Store에서 받기',
    play: 'Google Play에서 받기',
    soonApple: 'App Store 곧 출시',
    soonPlay: 'Google Play 곧 출시',
    features: [
      { tone: '#2B5A8A', title: '시간표로 나를 키워요', desc: '공부·운동·일·취미·사람 만나기·휴식. 한 해를 무엇으로 채우느냐에 따라 능력치와 건강·행복·돈이 달라져요.' },
      { tone: '#C2362B', title: '갈림길에서 고르는 건 나', desc: '첫 학교, 첫 일, 집과 결혼, 뜻밖의 기회와 위기. 어릴 때 고른 일이 수십 년 뒤에 돌아오기도 해요.' },
      { tone: '#3D7556', title: '여든 살의 인생 총평', desc: '산신령·도깨비·삼신할매·백호 장군·용왕 가운데 나와 닮은 수호 캐릭터가 지나온 삶을 시기별로 짚어 줘요.' },
      { tone: '#94650C', title: '다시 태어나기', desc: '같은 날 다시 태어나 다르게 골라 보세요. 지난 생과 인생 그래프·칭호를 나란히 견줄 수 있어요.' },
    ],
    easy: ['로그인 없이 바로 시작', '결제 없음', '한 판 약 20~25분, 자동 저장'],
    fun: '이 게임은 재미로 즐기는 게임이에요. 실제 미래나 운명을 알려 주지 않아요.',
    privacy: '개인정보처리방침',
    del: '계정 삭제',
    contact: '문의',
  },
  en: {
    name: 'Yunhoe: Life Simulation',
    sub: 'Start from the day you were born\nand live to 80',
    intro: 'A life simulation game: plan your timetable, choose at every crossroads and live one whole life from birth to age 80.',
    appStore: 'Download on the App Store',
    play: 'Get it on Google Play',
    soonApple: 'Coming soon to the App Store',
    soonPlay: 'Coming soon to Google Play',
    features: [
      { tone: '#2B5A8A', title: 'Shape yourself with a timetable', desc: 'Study, exercise, work, hobbies, friends, rest. How you fill each year changes your abilities, health, happiness and money.' },
      { tone: '#C2362B', title: 'You make the choices', desc: 'First school, first job, a home, marriage, sudden chances and setbacks. A choice made as a child may come back decades later.' },
      { tone: '#3D7556', title: 'A life review at 80', desc: 'The guardian most like you (the Mountain Sage, the Goblin, the Birth Grandmother, General White Tiger or the Dragon King) looks back on each stage of your life.' },
      { tone: '#94650C', title: 'Be reborn', desc: 'Live the same birthday again and choose differently. Compare life graphs and titles side by side.' },
    ],
    easy: ['No sign-in needed to start', 'No purchases', 'About 20–25 minutes a life, saved automatically'],
    fun: 'This game is for fun and does not tell your real future.',
    privacy: 'Privacy Policy',
    del: 'Delete account',
    contact: 'Contact',
  },
} as const

const APPLE_PATH = <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3 0 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5 1-1.4 1.4-2.8 1.4-2.8 0-.1-2.6-1-2.6-4.1zM13.9 5c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" />
const PLAY_PATH = (
  <path d="M3.6 2.31c-.36.2-.6.59-.6 1.04v17.3c0 .45.24.84.6 1.04l10.18-9.69L3.6 2.31zm12.06 8.65l-2.36 2.24 2.36 2.25 3.34-1.91c.7-.4.7-1.42 0-1.83l-3.34-1.91-.01.16zm-1.4 3.55l-9.4 5.36 8.45-8.04.95 2.68zm0-7.34l-8.45-8.04 9.4 5.36-.95 2.68z" />
)
const card = 'rounded-2xl border-[2.5px] border-[#1F1A15] shadow-[3px_3px_0_#1F1A15]'

function StoreButton({ url, path, label, soon }: { url: string; path: React.ReactNode; label: string; soon: string }) {
  const inner = (
    <>
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{path}</svg>
      {url ? label : soon}
    </>
  )
  const cls = `inline-flex items-center justify-center gap-2 min-h-[52px] px-6 font-bold ${card}`
  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" className={`${cls} bg-[#C2362B] text-[#FBF6EA] hover:brightness-110`}>{inner}</a>
    : <span aria-disabled="true" className={`${cls} bg-[#FBF6EA] text-[#6B5C4A]`}>{inner}</span>
}

export default function YunhoePage() {
  const [lang, setLang] = useState<Lang>('ko')
  const t = c[lang]

  return (
    <main className="min-h-screen bg-[#F3E8CF] text-[#1F1A15] [word-break:keep-all]">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="/" className="text-sm font-bold text-[#6B5C4A] hover:text-[#1F1A15] transition-colors">← Browniebase</a>
        <div className="flex items-center bg-[#FBF6EA] rounded-full p-0.5 text-xs border-2 border-[#1F1A15]">
          <button onClick={() => setLang('ko')} className={`px-3 py-1 rounded-full font-medium ${lang === 'ko' ? 'bg-[#1F1A15] text-[#FBF6EA]' : 'text-[#6B5C4A]'}`}>KO</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full font-medium ${lang === 'en' ? 'bg-[#1F1A15] text-[#FBF6EA]' : 'text-[#6B5C4A]'}`}>EN</button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-14 flex flex-col items-center text-center gap-5">
        <img src="/yunhoe/icon.webp" alt={t.name} width={160} height={160} className={`w-32 h-32 sm:w-40 sm:h-40 ${card} rounded-[28px]`} />
        <p className="text-sm font-bold tracking-wide text-[#C2362B]">{t.name}</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug whitespace-pre-line">{t.sub}</h1>
        <p className="text-base sm:text-lg text-[#6B5C4A] max-w-xl">{t.intro}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <StoreButton url={APP_STORE_URL} path={APPLE_PATH} label={t.appStore} soon={t.soonApple} />
          <StoreButton url={PLAY_URL} path={PLAY_PATH} label={t.play} soon={t.soonPlay} />
        </div>
      </section>

      {/* ── 특징 넷 ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.features.map(f => (
            <div key={f.title} className={`bg-[#FBF6EA] p-5 ${card}`}>
              <h2 className="text-xl font-extrabold mb-1.5" style={{ color: f.tone }}>{f.title}</h2>
              <p className="text-sm leading-relaxed text-[#6B5C4A]">{f.desc}</p>
            </div>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
          {t.easy.map(e => <li key={e} className="px-3 py-1 rounded-full bg-[#FBF6EA] border-2 border-[#1F1A15]">{e}</li>)}
        </ul>
        <p className="mt-6 text-center text-sm text-[#6B5C4A]">{t.fun}</p>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-10 bg-[#EADBB8] border-t-[2.5px] border-[#1F1A15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <img src="/yunhoe/icon.webp" alt="" width={32} height={32} className="w-8 h-8 rounded-lg border-2 border-[#1F1A15]" />
            <span className="font-bold">Yunhoe</span>
            <span className="text-[#6B5C4A] text-sm">/ 윤회 · by Browniebase</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
            <a href="/yunhoe/privacy/" className="text-[#C2362B] hover:underline">{t.privacy}</a>
            <a href="/yunhoe/delete-account/" className="text-[#C2362B] hover:underline">{t.del}</a>
            <a href="mailto:support@browniebase.com" className="text-[#C2362B] hover:underline">{t.contact}</a>
          </div>
          <p className="text-[#6B5C4A] text-sm mt-6">© 2026 Browniebase. All rights reserved.</p>
          {/* 사이버몰 운영자 표시(전자상거래법 제10조) — 값·근거는 BizInfo.tsx. 거기 정책 링크는 바다퐁 것이라 끔 */}
          <BizInfo lang={lang} showPolicyLinks={false} className="mt-4 text-[#6B5C4A]" />
        </div>
      </footer>
    </main>
  )
}
