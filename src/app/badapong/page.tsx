'use client'
import { useState } from 'react'
import { storeUrl, useDeviceOS, useSource } from './store'

type Lang = 'ko' | 'en'

/** 등급색 — 앱 theme.dart 의 다크 값 그대로. 여기서 새로 고르지 않는다. */
const GRADE_TONE: Record<string, string> = {
  A: '#69F0AE', B: '#B2FF59', C: '#FFD84D', D: '#FFB266', E: '#FF7B7B',
}

const c = {
  ko: {
    nav: { features: '주요 기능', regions: '지원 지역', activities: '활동', faq: 'FAQ', launch: '앱 다운로드', partners: '샵 제휴' },
    hero: {
      badge: 'iOS App Store · Google Play 정식 출시',
      headline: '들어가도 되는 바다인지,\n1분이면 압니다',
      subheadline: '파고 · 조류 · 너울 · 바람 · 강수에 수중 시야 예보까지. 활동별로 다른 기준으로 채점해 A~E 한 글자로 답합니다.',
      tagline: '"바다 들어가기 전, 기상과 시야를 한 번에 살펴보세요."',
      cta1: 'App Store에서 다운로드',
      cta2: 'Google Play에서 다운로드',
      cta3: '자세히 알아보기',
      pills: [
        { icon: '🌊', label: '실시간 해양 기상' },
        { icon: '📍', label: '21개 지역 지원' },
        { icon: '🤿', label: '4가지 활동' },
      ],
    },
    what: {
      title: 'Badapong이란?',
      body: '해양 액티비티에 필요한 종합 기상 예보 앱입니다. 파고·조류·스웰·바람·강수·수온 등 핵심 해양 데이터를 격자별로 시각화하고, 다이빙·스노클링·프리다이빙·해변수영 활동별로 수중 시야 예보(A~E 등급)까지 함께 제공합니다.',
    },
    features: {
      title: '주요 기능',
      items: [
        { icon: '🌊', title: '시각적 애니메이션 기상 레이어', desc: '조류·파고·너울·바람을 입자 애니메이션으로 흐름 시각화. 보고만 있어도 바다 상태가 읽힙니다.' },
        { icon: '🤿', title: '활동별 맞춤 시야 등급', desc: '해변수영·스노클링·프리다이빙·스쿠버 4가지 활동별로 다른 임계값의 A~E 수중 시야 등급.' },
        { icon: '⏱️', title: '시간대별 예보', desc: '3시간 단위로 7일치 등급·기상을 한눈에.' },
        { icon: '⚠️', title: '안전 경고', desc: '이안류와 너울성 파도 위험을 시간대별로 경고. 잔잔해 보여도 위험한 구간을 미리 표시.' },
        { icon: '🌙', title: '조석 · 일출일몰', desc: '만조/간조 시각과 슬랙 워터, 일출·일몰 기준 야간 시간대 자동 가드.' },
        { icon: '💬', title: '스팟 리뷰 & 커뮤니티', desc: '다녀온 사람들의 실제 후기 — 작성·좋아요순 정렬·10개 언어 자동 번역.' },
        { icon: '📊', title: '하이브리드 채점', desc: '파고·너울·바람·조류·수온·수질에 36방향 지형 차폐(zone shielding)까지 종합 평가.' },
        { icon: '🌐', title: '10개 언어', desc: '한국어·영어·일본어·중국어 등 10개 언어로 정보 제공.' },
      ],
    },
    activities: {
      title: '4가지 활동 지원',
      list: [
        { icon: '🏖️', title: '해변 수영', desc: '얕은 수심, 안전 위주' },
        { icon: '🤿', title: '스노클링', desc: '표면 활동, 시야 중요' },
        { icon: '🧜', title: '프리다이빙', desc: '중간 수심, 안정성' },
        { icon: '🐠', title: '스쿠버 다이빙', desc: '깊은 수심, 종합 평가' },
      ],
    },
    // A~E 는 이 앱의 핵심 발명인데 랜딩에는 "A~E 등급"이라는 말만 있고
    // A 가 무엇인지가 없었다. 문구는 앱 ARB 의 summaryVerdictA~E 와 같은 수위로.
    grades: {
      eyebrow: '수중 시야 등급',
      title: '숫자를 읽지 않아도 됩니다',
      body: '파고 · 너울 · 바람 · 조류 · 수온 · 수질에 36방향 지형 차폐까지 종합해 한 글자로 줄입니다. 활동마다 임계값이 다릅니다.',
      list: [
        { g: 'A', name: '아주 좋음', desc: '입수하기 좋은 때. 시야가 트이고 물결이 잔잔합니다.' },
        { g: 'B', name: '좋음', desc: '대체로 괜찮습니다. 입수할 만한 조건.' },
        { g: 'C', name: '보통', desc: '가능하지만 주의 요소가 있습니다. 초심자는 확인이 필요합니다.' },
        { g: 'D', name: '나쁨', desc: '권하지 않습니다. 앱이 "오늘의 베스트"라 부르지 않습니다.' },
        { g: 'E', name: '아주 나쁨', desc: '들어가지 마세요. 경고와 함께 표시됩니다.' },
      ],
    },
    stats: [
      { n: '21', label: '지원 지역' },
      { n: '3h', label: '예보 간격 · 7일치' },
      { n: '10', label: '지원 언어' },
    ],
    regions: {
      title: '21개 지역 지원',
      body: '한국·일본·동남아에 더해 괌·사이판(서태평양)까지, 주요 다이빙·스노클 지역을 커버합니다.',
      list: [
        { flag: '🇰🇷', name: '제주도' },
        { flag: '🇰🇷', name: '부산' },
        { flag: '🇰🇷', name: '강릉·속초' },
        { flag: '🇰🇷', name: '거제·통영' },
        { flag: '🇰🇷', name: '포항' },
        { flag: '🇯🇵', name: '오키나와' },
        { flag: '🇯🇵', name: '이시가키' },
        { flag: '🇯🇵', name: '미야코지마' },
        { flag: '🇵🇭', name: '세부' },
        { flag: '🇵🇭', name: '보홀' },
        { flag: '🇵🇭', name: '시키호르' },
        { flag: '🇵🇭', name: '보라카이' },
        { flag: '🇹🇭', name: '푸켓' },
        { flag: '🇹🇭', name: '파타야' },
        { flag: '🇹🇭', name: '피피' },
        { flag: '🇮🇩', name: '발리' },
        { flag: '🇮🇩', name: '롬복' },
        { flag: '🇮🇩', name: '코모도' },
        { flag: '🇮🇩', name: '길리 아일랜드' },
        { flag: '🇺🇸', name: '괌' },
        { flag: '🇺🇸', name: '사이판' },
      ],
    },
    how: {
      title: '이렇게 사용하세요',
      steps: [
        { step: '01', title: '지역 선택', desc: '21개 지원 지역 중 가려는 곳을 선택' },
        { step: '02', title: '활동 선택', desc: '해변수영·스노클링·프리다이빙·스쿠버 중 활동 선택' },
        { step: '03', title: '시간 슬라이더', desc: '3시간 단위로 시간대별 등급 변화 확인' },
        { step: '04', title: '스팟 상세', desc: '구체적 스팟 클릭 시 파고·조류 그래프와 등급 변동 확인' },
      ],
    },
    brand: {
      title: '왜 이름이 "Badapong"인가요?',
      body: '"Badapong(바다퐁)"은 "바다(海)"와 작은 물방울이 떨어지는 의성어 "퐁"이 만난 이름입니다.',
      connection: '바다에 퐁 떨어지듯 가볍게 들여다보고 안전하게 들어갈 시간을 찾아드리는 앱의 본질을 담았습니다.',
    },
    cta: {
      title: '지금 바로 바다 기상을 살펴보세요',
      body: '바다 들어가기 전 1분이면 충분합니다. App Store와 Google Play에서 다운로드할 수 있습니다.',
      primary: 'App Store에서 다운로드',
    },
    footerTagline: '해양 액티비티 기상 + 시야 예보',
    shopBand: {
      title: '다이브샵 · 서핑샵을 운영하고 계신가요?',
      body: '전국 292곳을 스팟 근처 서비스로 이미 무료 등재했습니다. 내 샵이 어느 스팟에 나오는지, 그 스팟을 몇 명이 봤는지 확인해 보세요.',
      cta: '내 샵 확인하기',
    },
  },
  en: {
    nav: { features: 'Features', regions: 'Regions', activities: 'Activities', faq: 'FAQ', launch: 'Get the App', partners: 'For Shops' },
    hero: {
      badge: 'Now on App Store & Google Play',
      headline: 'Is the sea okay today?\nOne minute tells you',
      subheadline: 'A full ocean weather forecast for marine activities — waves, swell, current, wind and rain, plus an underwater visibility forecast on top.',
      tagline: '"Check the weather and the visibility, in one minute, before you go in."',
      cta1: 'Download on App Store',
      cta2: 'Get it on Google Play',
      cta3: 'Learn More',
      pills: [
        { icon: '🌊', label: 'Live ocean weather' },
        { icon: '📍', label: '21 regions' },
        { icon: '🤿', label: '4 activities' },
      ],
    },
    what: {
      title: 'What is Badapong?',
      body: 'Badapong is a full ocean weather forecast app built for marine activities. It visualises wave, swell, current, wind, rain and water temperature across a fine grid — and, on top of that, gives an A~E underwater visibility forecast tailored to beach swim, snorkel, freedive and scuba.',
    },
    features: {
      title: 'Key Features',
      items: [
        { icon: '🌊', title: 'Animated weather layers', desc: 'Particle animations for current, waves, swell and wind — the state of the sea, at a glance.' },
        { icon: '🤿', title: 'Activity-tuned visibility grades', desc: 'A~E underwater visibility grades with distinct thresholds for beach swim / snorkel / freedive / scuba.' },
        { icon: '⏱️', title: 'Hourly forecast', desc: 'Grades and weather in 3-hour slots, 7 days ahead.' },
        { icon: '⚠️', title: 'Safety alerts', desc: 'Time-slot warnings for rip currents and swell surge — dangers that look calm but strike without warning.' },
        { icon: '🌙', title: 'Tide & daylight', desc: 'High/low tide times with slack water, plus automatic night-time guards from sunrise and sunset.' },
        { icon: '💬', title: 'Spot reviews & community', desc: 'Real visitor reviews — write, sort by likes, with automatic translation across 10 languages.' },
        { icon: '📊', title: 'Hybrid scoring', desc: 'Wave, swell, wind, current, temperature and water quality, plus 36-direction terrain shielding.' },
        { icon: '🌐', title: '10 languages', desc: 'Korean, English, Japanese, Chinese and 6 more.' },
      ],
    },
    activities: {
      title: '4 supported activities',
      list: [
        { icon: '🏖️', title: 'Beach swim', desc: 'Shallow, safety-first' },
        { icon: '🤿', title: 'Snorkeling', desc: 'Surface, visibility key' },
        { icon: '🧜', title: 'Freediving', desc: 'Mid depth, stability' },
        { icon: '🐠', title: 'Scuba diving', desc: 'Deep, full evaluation' },
      ],
    },
    grades: {
      eyebrow: 'Visibility grade',
      title: 'You should not have to read numbers',
      body: 'Waves, swell, wind, current, water temperature and clarity — plus 36-direction terrain shielding — reduced to one letter. Thresholds differ per activity.',
      list: [
        { g: 'A', name: 'Excellent', desc: 'A good time to get in. Clear water, calm surface.' },
        { g: 'B', name: 'Good', desc: 'Generally fine. Worth going in.' },
        { g: 'C', name: 'Fair', desc: 'Possible, but with caveats. Beginners should check first.' },
        { g: 'D', name: 'Poor', desc: 'Not recommended. Never shown as "best today".' },
        { g: 'E', name: 'Very poor', desc: 'Do not enter. Shown together with a warning.' },
      ],
    },
    stats: [
      { n: '21', label: 'Regions' },
      { n: '3h', label: 'Steps · 7-day' },
      { n: '10', label: 'Languages' },
    ],
    regions: {
      title: '21 regions covered',
      body: 'Covering major dive and snorkel destinations across Korea, Japan, Southeast Asia and the Western Pacific (Guam, Saipan).',
      list: [
        { flag: '🇰🇷', name: 'Jeju Island' },
        { flag: '🇰🇷', name: 'Busan' },
        { flag: '🇰🇷', name: 'Gangneung-Sokcho' },
        { flag: '🇰🇷', name: 'Geoje-Tongyeong' },
        { flag: '🇰🇷', name: 'Pohang' },
        { flag: '🇯🇵', name: 'Okinawa' },
        { flag: '🇯🇵', name: 'Ishigaki' },
        { flag: '🇯🇵', name: 'Miyakojima' },
        { flag: '🇵🇭', name: 'Cebu' },
        { flag: '🇵🇭', name: 'Bohol' },
        { flag: '🇵🇭', name: 'Siquijor' },
        { flag: '🇵🇭', name: 'Boracay' },
        { flag: '🇹🇭', name: 'Phuket' },
        { flag: '🇹🇭', name: 'Pattaya' },
        { flag: '🇹🇭', name: 'Phi Phi' },
        { flag: '🇮🇩', name: 'Bali' },
        { flag: '🇮🇩', name: 'Lombok' },
        { flag: '🇮🇩', name: 'Komodo' },
        { flag: '🇮🇩', name: 'Gili Islands' },
        { flag: '🇺🇸', name: 'Guam' },
        { flag: '🇺🇸', name: 'Saipan' },
      ],
    },
    how: {
      title: 'How it works',
      steps: [
        { step: '01', title: 'Pick region', desc: 'Choose from 21 supported destinations.' },
        { step: '02', title: 'Pick activity', desc: 'Beach swim / snorkel / freedive / scuba.' },
        { step: '03', title: 'Time slider', desc: 'Scrub through 3-hour slots to find the best window.' },
        { step: '04', title: 'Spot detail', desc: 'Click a spot for wave/current charts and grade timeline.' },
      ],
    },
    brand: {
      title: 'Why the name "Badapong"?',
      body: '"Badapong (바다퐁)" combines "Bada" — Korean for "sea" — with "Pong", the playful sound of a droplet plopping into water.',
      connection: 'Like a droplet plopping in, Badapong lets you peek beneath the surface before you go — finding the right window to dive in safely.',
    },
    cta: {
      title: 'Check ocean weather now',
      body: 'A minute before you enter the water can save the trip. Available on the App Store and Google Play.',
      primary: 'Download on App Store',
    },
    footerTagline: 'Marine weather + visibility forecast',
    shopBand: {
      title: 'Do you run a dive or surf shop?',
      body: 'We have already listed 292 Korean shops for free as services near their spots. Check which spots your shop appears on, and how many people viewed them.',
      cta: 'Find my shop',
    },
  },
} as const

const APPLE_PATH = (
  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
)
const PLAY_PATH = (
  <path d="M3.6 2.31c-.36.2-.6.59-.6 1.04v17.3c0 .45.24.84.6 1.04l10.18-9.69L3.6 2.31zm12.06 8.65l-2.36 2.24 2.36 2.25 3.34-1.91c.7-.4.7-1.42 0-1.83l-3.34-1.91-.01.16zm-1.4 3.55l-9.4 5.36 8.45-8.04.95 2.68zm0-7.34l-8.45-8.04 9.4 5.36-.95 2.68z" />
)

export default function BadapongPage() {
  const [lang, setLang] = useState<Lang>('ko')
  const t = c[lang]
  const os = useDeviceOS()
  const src = useSource()
  // 기기에 맞는 스토어를 1순위로 (미판별 PC는 기존 순서 유지)
  const primary = os === 'android'
    ? { href: storeUrl('android', src), label: t.hero.cta2, icon: 'play' as const }
    : { href: storeUrl('ios', src), label: t.hero.cta1, icon: 'apple' as const }
  const secondary = os === 'android'
    ? { href: storeUrl('ios', src), label: t.hero.cta1, icon: 'apple' as const }
    : { href: storeUrl('android', src), label: t.hero.cta2, icon: 'play' as const }

  return (
    <main className="min-h-screen bg-[#0B1220] text-[#F0F4F8]">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1220]/85 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="/badapong/" className="flex items-center gap-2">
            <img src="/badapong-icon.png" alt="Badapong" width={32} height={32}
                 className="w-8 h-8 rounded-xl shadow-sm" />
            <div>
              <span className="font-bold text-[#F0F4F8] text-lg leading-none">Badapong</span>
              <span className="block text-[10px] text-[#6B8AA8] leading-none">바다퐁 · by Browniebase</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-[#A9BCD0] hover:text-[#7DBDFF] transition-colors">{t.nav.features}</a>
            <a href="#activities" className="text-sm text-[#A9BCD0] hover:text-[#7DBDFF] transition-colors">{t.nav.activities}</a>
            <a href="#regions" className="text-sm text-[#A9BCD0] hover:text-[#7DBDFF] transition-colors">{t.nav.regions}</a>
            <a href="/badapong/partners/" className="text-sm text-[#A9BCD0] hover:text-[#7DBDFF] transition-colors">{t.nav.partners}</a>
            <a href="/salpim/" className="text-sm text-[#6B8AA8] hover:text-[#7B61FF] transition-colors">Salpim →</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs">
              <button onClick={() => setLang('ko')} className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'ko' ? 'bg-[#7DBDFF]/20 text-[#7DBDFF]' : 'text-[#6B8AA8]'}`}>KO</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'en' ? 'bg-[#7DBDFF]/20 text-[#7DBDFF]' : 'text-[#6B8AA8]'}`}>EN</button>
            </div>
            <a href={primary.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1A73E8] to-[#14B8A6] text-white text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-full hover:brightness-110 transition whitespace-nowrap">
              {t.nav.launch}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* 앱과 같은 심해 바탕 — 아래로 갈수록 옅게 퍼지는 두 개의 물빛 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#0B1220] pointer-events-none" />
        <div className="absolute top-10 right-[-10%] w-[36rem] h-[36rem] bg-[#1A73E8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[28rem] h-[28rem] bg-[#14B8A6]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-8">
            <img src="/badapong-icon.png" alt="Badapong" width={96} height={96}
                 className="w-24 h-24 rounded-[22px] shadow-lg shadow-cyan-500/20" />
            <div className="inline-flex items-center gap-2 bg-[#69F0AE]/10 text-[#69F0AE] text-sm font-semibold px-4 py-1.5 rounded-full border border-[#69F0AE]/25">
              <span className="w-2 h-2 bg-[#69F0AE] rounded-full" />
              {t.hero.badge}
            </div>
            {/* "AI로 " 접두를 뺐다 — headline 과 이어져 「AI로 바다 들어가기 전,
                기상부터 시야까지」로 읽혔다. AI·차폐 알고리즘은 기능 섹션의
                근거로 내린다. 마지막 줄만 그라데이션으로 강조. */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] max-w-4xl">
              {t.hero.headline.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === arr.length - 1
                    ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69F0AE] to-[#2DD4BF]">{line}</span>
                    : line}
                </span>
              ))}
            </h1>
            <p className="text-lg text-[#A9BCD0] max-w-2xl">{t.hero.subheadline}</p>

            <div className="flex flex-col items-center gap-4 mt-2">
              <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
                {[primary, secondary].map((btn, i) => (
                  <a key={btn.href} href={btn.href} target="_blank" rel="noopener noreferrer"
                     className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                       i === 0
                         ? 'bg-gradient-to-r from-[#1A73E8] to-[#14B8A6] text-white shadow-lg shadow-[#1A73E8]/25 hover:brightness-110'
                         : 'bg-white/5 text-[#C3D3E4] border border-white/12 hover:bg-white/10'
                     }`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      {btn.icon === 'apple'
                        ? APPLE_PATH
                        : PLAY_PATH}
                    </svg>
                    {btn.label}
                  </a>
                ))}
              </div>
              <a href="#features" className="inline-flex items-center justify-center gap-1.5 text-[#7DBDFF] text-sm font-medium hover:underline">
                {t.hero.cta3}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {t.hero.pills.map(p => (
                <div key={p.label} className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full text-sm text-[#C3D3E4] shadow-sm">
                  <span>{p.icon}</span>
                  <span className="font-medium">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What is ─────────────────────────────────────────────── */}
      {/* ── 지표 ─────────────────────────────────────────────── */}
      <section className="pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 border-t border-white/10 pt-8">
            {t.stats.map((x) => (
              <div key={x.label} className="text-center">
                <div className="text-3xl font-bold tabular-nums">{x.n}</div>
                <p className="text-xs text-[#6B8AA8] mt-1">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A~E 등급 ─────────────────────────────────────────────
          앱의 핵심 발명인데 랜딩에는 "A~E 등급"이라는 말만 있고 A 가
          무엇인지가 없었다. 히어로 다음에 둔다. */}
      <section className="py-20 bg-[#0E1729]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-bold text-[#2DD4BF] mb-2">{t.grades.eyebrow}</p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold flex-1">{t.grades.title}</h2>
            <p className="text-[#A9BCD0] lg:max-w-md">{t.grades.body}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.grades.list.map((x) => {
              const tone = GRADE_TONE[x.g]
              return (
                <div key={x.g}
                     className="rounded-2xl border p-5 bg-white/[0.03]"
                     style={{ borderColor: tone + '33' }}>
                  <div className="w-11 h-11 rounded-full grid place-items-center font-black text-lg mb-3"
                       style={{ color: tone, borderColor: tone, borderWidth: 2,
                                background: tone + '1F', boxShadow: `0 0 18px ${tone}44` }}>
                    {x.g}
                  </div>
                  <h3 className="font-bold mb-1">{x.name}</h3>
                  <p className="text-sm text-[#A9BCD0] leading-relaxed">{x.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-[#F0F4F8] mb-6">{t.what.title}</h2>
          <p className="text-lg text-[#A9BCD0] leading-relaxed">{t.what.body}</p>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-[#0E1729]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F4F8]">{t.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map(f => (
              <div key={f.title} className="bg-white/[0.04] rounded-2xl p-6 shadow-sm border border-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-400/20 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-[#F0F4F8] mb-2">{f.title}</h3>
                <p className="text-[#A9BCD0] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Activities ──────────────────────────────────────────── */}
      <section id="activities" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F4F8] text-center mb-14">{t.activities.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.activities.list.map(a => (
              <div key={a.title} className="text-center bg-white/[0.04] rounded-2xl p-6 shadow-sm border border-white/10">
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-semibold text-[#F0F4F8] mb-1">{a.title}</h3>
                <p className="text-[#6B8AA8] text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="py-20 bg-[#0E1729]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F4F8] text-center mb-14">{t.how.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {t.how.steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                  <span className="text-white font-bold text-lg">{s.step}</span>
                </div>
                {i < t.how.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-0.5 bg-gradient-to-r from-cyan-500/40 to-cyan-500/10" />
                )}
                <h3 className="font-semibold text-[#F0F4F8] mb-2">{s.title}</h3>
                <p className="text-sm text-[#A9BCD0] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regions ─────────────────────────────────────────────── */}
      <section id="regions" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F4F8] mb-4">{t.regions.title}</h2>
          <p className="text-[#A9BCD0] max-w-2xl mx-auto mb-12">{t.regions.body}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {t.regions.list.map(r => (
              <div key={r.name} className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-3 hover:border-[#7DBDFF]/40 transition-colors">
                <span className="text-xl">{r.flag}</span>
                <span className="text-sm font-medium text-[#C3D3E4]">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand story ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0F4F8] mb-6">{t.brand.title}</h2>
          <p className="text-lg text-[#C3D3E4] mb-4 leading-relaxed">{t.brand.body}</p>
          <p className="text-[#A9BCD0] leading-relaxed">{t.brand.connection}</p>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0E1729] border-t border-white/10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <img src="/badapong-icon.png" alt="Badapong" width={72} height={72}
               className="w-18 h-18 rounded-2xl mx-auto mb-6 shadow-lg" style={{ width: 72, height: 72 }} />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-[#A9BCD0] text-lg mb-10">{t.cta.body}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={storeUrl('ios', src)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#14B8A6] text-white px-8 py-4 rounded-full font-semibold text-lg hover:brightness-110 transition shadow-lg shadow-[#1A73E8]/25">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              {t.cta.primary}
            </a>
            <a href={storeUrl('android', src)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#14B8A6] text-white px-8 py-4 rounded-full font-semibold text-lg hover:brightness-110 transition shadow-lg shadow-[#1A73E8]/25">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 2.31c-.36.2-.6.59-.6 1.04v17.3c0 .45.24.84.6 1.04l10.18-9.69L3.6 2.31zm12.06 8.65l-2.36 2.24 2.36 2.25 3.34-1.91c.7-.4.7-1.42 0-1.83l-3.34-1.91-.01.16zm-1.4 3.55l-9.4 5.36 8.45-8.04.95 2.68zm0-7.34l-8.45-8.04 9.4 5.36-.95 2.68z" />
              </svg>
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </section>

      {/* ── 샵 제휴 배너 ─────────────────────────────────────────── */}
      <section className="py-14 bg-[#0E1729] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0F4F8] mb-3">{t.shopBand.title}</h2>
          <p className="text-[#A9BCD0] leading-relaxed mb-7">{t.shopBand.body}</p>
          <a
            href="/badapong/partners/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1A73E8] to-[#14B8A6] text-white px-6 py-3 rounded-full font-semibold hover:brightness-110 transition shadow-sm"
          >
            {t.shopBand.cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/badapong-icon.png" alt="Badapong" width={32} height={32}
                     className="w-8 h-8 rounded-xl" />
                <span className="font-bold text-lg">Badapong</span>
                <span className="text-[#6B8AA8] text-sm">/ 바다퐁</span>
              </div>
              <p className="text-[#6B8AA8] text-sm">{t.footerTagline}</p>
              <p className="text-[#6B8AA8] text-xs mt-1">by Browniebase</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="/" className="text-[#6B8AA8] hover:text-white text-sm transition-colors">Browniebase</a>
              <a href="/badapong/partners/" className="text-[#6B8AA8] hover:text-white text-sm transition-colors">{lang === 'ko' ? '샵 제휴' : 'For Shops'}</a>
              <a href="/salpim/" className="text-[#6B8AA8] hover:text-white text-sm transition-colors">Salpim</a>
              <a href={lang === 'ko' ? '/privacy-badapong.html' : '/privacy-badapong-en.html'} className="text-[#6B8AA8] hover:text-white text-sm transition-colors">{lang === 'ko' ? '개인정보처리방침' : 'Privacy'}</a>
              <a href={lang === 'ko' ? '/terms-badapong.html' : '/terms-badapong-en.html'} className="text-[#6B8AA8] hover:text-white text-sm transition-colors">{lang === 'ko' ? '이용약관' : 'Terms'}</a>
              <a href="mailto:support@browniebase.com" className="text-[#6B8AA8] hover:text-white text-sm transition-colors">{lang === 'ko' ? '문의' : 'Contact'}</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#6B8AA8] text-sm">© 2026 Browniebase. All rights reserved.</p>
            <p className="text-[#A9BCD0] text-xs">support@browniebase.com</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
