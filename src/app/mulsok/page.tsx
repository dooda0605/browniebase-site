'use client'
import { useState } from 'react'

type Lang = 'ko' | 'en'

const c = {
  ko: {
    nav: { features: '주요 기능', regions: '지원 지역', activities: '활동', faq: 'FAQ', launch: '앱 열기' },
    hero: {
      badge: '베타 테스트 진행 중',
      headline: '바다 속 시야를 미리 살펴보세요',
      subheadline: 'AI가 파고·조류·너울·바람·강수를 종합 분석해 다이빙·스노클링 활동에 적합한 시간을 알려드립니다.',
      tagline: '"물속에 들어가기 전, 시야부터 살펴보세요."',
      cta1: '앱 열기',
      cta2: '자세히 알아보기',
      pills: [
        { icon: '🌊', label: '실시간 해양 예보' },
        { icon: '📍', label: '11개 지역 지원' },
        { icon: '🤿', label: '4가지 활동' },
      ],
    },
    what: {
      title: 'Mulsok이란?',
      body: '바다에 들어가기 전, 수중 시야를 객관적으로 예측하는 도구입니다. 파고·조류·스웰·바람·강수 등 다양한 해양 데이터를 종합해 격자별 등급(A~E)으로 시각화합니다. 다이빙·스노클링·프리다이빙·해변수영을 즐기는 분들께 "지금 들어가도 잘 보일까?"에 답해 드립니다.',
    },
    features: {
      title: '주요 기능',
      items: [
        { icon: '🗺️', title: '지역 등급 지도', desc: '바다 위에 격자별로 A~E 등급을 색으로 표시. 어디가 좋은지 한눈에 파악.' },
        { icon: '⏱️', title: '시간대별 예보', desc: '3시간 단위로 7일치 예보 + 8~14일 참고 예보까지 제공.' },
        { icon: '🌊', title: '윈디 스타일 기상 레이어', desc: '조류·파고·큰 너울·교차 너울 입자 애니메이션으로 흐름 시각화.' },
        { icon: '🤿', title: '활동별 맞춤 등급', desc: '해변수영·스노클링·프리다이빙·스쿠버 4가지 활동별로 다른 임계값 적용.' },
        { icon: '📊', title: '하이브리드 채점', desc: 'wave/swell/wind/current/temperature/water quality 종합 평가.' },
        { icon: '🌐', title: '10개 언어', desc: '한국어·영어·일본어·중국어 등 10개 언어로 정보 제공.' },
      ],
    },
    activities: {
      title: '4가지 활동 지원',
      list: [
        { icon: '🏖️', title: '해변 수영', desc: '얕은 수심, 안전 위주' },
        { icon: '🤿', title: '스노클링', desc: '표면 활동, 시야 중요' },
        { icon: '🐠', title: '프리다이빙', desc: '중간 수심, 안정성' },
        { icon: '🌊', title: '스쿠버 다이빙', desc: '깊은 수심, 종합 평가' },
      ],
    },
    regions: {
      title: '11개 지역 지원',
      body: '한국·일본·동남아 주요 다이빙 지역을 커버합니다.',
      list: [
        { flag: '🇰🇷', name: '제주도' },
        { flag: '🇯🇵', name: '오키나와' },
        { flag: '🇮🇩', name: '발리' },
        { flag: '🇮🇩', name: '롬복' },
        { flag: '🇮🇩', name: '코모도' },
        { flag: '🇮🇩', name: '길리 아일랜드' },
        { flag: '🇵🇭', name: '세부' },
        { flag: '🇵🇭', name: '보홀' },
        { flag: '🇵🇭', name: '시키호르' },
        { flag: '🇹🇭', name: '푸켓' },
        { flag: '🇹🇭', name: '파타야' },
      ],
    },
    how: {
      title: '이렇게 사용하세요',
      steps: [
        { step: '01', title: '지역 선택', desc: '11개 지원 지역 중 가려는 곳을 선택' },
        { step: '02', title: '활동 선택', desc: '해변수영·스노클링·프리다이빙·스쿠버 중 활동 선택' },
        { step: '03', title: '시간 슬라이더', desc: '3시간 단위로 시간대별 등급 변화 확인' },
        { step: '04', title: '스팟 상세', desc: '구체적 스팟 클릭 시 파고·조류 그래프와 등급 변동 확인' },
      ],
    },
    brand: {
      title: '왜 이름이 "Mulsok"인가요?',
      body: '"Mulsok(물속)"은 한국어 토박이말로 "물 안쪽 = 바다 속"이라는 뜻입니다.',
      connection: '바다 속 상황을 미리 살펴 적절한 시간을 찾아드리는 앱의 본질을 그대로 담은 이름입니다. 자매 앱 "Salpim(살핌)"과 같은 토박이말 패턴입니다.',
    },
    cta: {
      title: '지금 바로 시야를 살펴보세요',
      body: '바다 들어가기 전 1분이면 충분합니다.',
      primary: '앱 열기',
    },
    footerTagline: '수중 활동 등급 예보',
  },
  en: {
    nav: { features: 'Features', regions: 'Regions', activities: 'Activities', faq: 'FAQ', launch: 'Launch App' },
    hero: {
      badge: 'Beta in progress',
      headline: 'See underwater visibility before you dive',
      subheadline: 'AI combines waves, swell, current, wind & rain to forecast the best time for diving and snorkeling.',
      tagline: '"Take a closer look at the water before you go in."',
      cta1: 'Launch App',
      cta2: 'Learn More',
      pills: [
        { icon: '🌊', label: 'Live ocean forecast' },
        { icon: '📍', label: '11 regions' },
        { icon: '🤿', label: '4 activities' },
      ],
    },
    what: {
      title: 'What is Mulsok?',
      body: 'A forecasting tool that gives an objective grade for underwater visibility before you enter the sea. By combining wave, swell, current, wind and rain data, it produces an A~E grade for each grid cell — answering "will I see anything if I go in now?" for snorkelers, freedivers, scuba divers, and beach swimmers.',
    },
    features: {
      title: 'Key Features',
      items: [
        { icon: '🗺️', title: 'Regional grade map', desc: 'A~E color-graded heatmap over the sea. See best spots at a glance.' },
        { icon: '⏱️', title: 'Hourly forecast', desc: '7-day forecast in 3-hour slots, plus 8~14 day reference outlook.' },
        { icon: '🌊', title: 'Windy-style layers', desc: 'Particle animations for current, waves, large swell and cross swell.' },
        { icon: '🤿', title: 'Activity-tuned grades', desc: 'Different thresholds for beach swim / snorkel / freedive / scuba.' },
        { icon: '📊', title: 'Hybrid scoring', desc: 'Composite of wave / swell / wind / current / temperature / water quality.' },
        { icon: '🌐', title: '10 languages', desc: 'Korean, English, Japanese, Chinese and 6 more.' },
      ],
    },
    activities: {
      title: '4 supported activities',
      list: [
        { icon: '🏖️', title: 'Beach swim', desc: 'Shallow, safety-first' },
        { icon: '🤿', title: 'Snorkeling', desc: 'Surface, visibility key' },
        { icon: '🐠', title: 'Freediving', desc: 'Mid depth, stability' },
        { icon: '🌊', title: 'Scuba diving', desc: 'Deep, full evaluation' },
      ],
    },
    regions: {
      title: '11 regions covered',
      body: 'Covering major dive destinations across Korea, Japan and Southeast Asia.',
      list: [
        { flag: '🇰🇷', name: 'Jeju Island' },
        { flag: '🇯🇵', name: 'Okinawa' },
        { flag: '🇮🇩', name: 'Bali' },
        { flag: '🇮🇩', name: 'Lombok' },
        { flag: '🇮🇩', name: 'Komodo' },
        { flag: '🇮🇩', name: 'Gili Islands' },
        { flag: '🇵🇭', name: 'Cebu' },
        { flag: '🇵🇭', name: 'Bohol' },
        { flag: '🇵🇭', name: 'Siquijor' },
        { flag: '🇹🇭', name: 'Phuket' },
        { flag: '🇹🇭', name: 'Pattaya' },
      ],
    },
    how: {
      title: 'How it works',
      steps: [
        { step: '01', title: 'Pick region', desc: 'Choose from 11 supported destinations.' },
        { step: '02', title: 'Pick activity', desc: 'Beach swim / snorkel / freedive / scuba.' },
        { step: '03', title: 'Time slider', desc: 'Scrub through 3-hour slots to find the best window.' },
        { step: '04', title: 'Spot detail', desc: 'Click a spot for wave/current charts and grade timeline.' },
      ],
    },
    brand: {
      title: 'Why the name "Mulsok"?',
      body: '"Mulsok (물속)" is a pure Korean word meaning "inside the water" — literally, underwater.',
      connection: 'It captures the essence of the app: looking inside the sea before you go in. It shares the native-Korean pattern with our sister app "Salpim (살핌)".',
    },
    cta: {
      title: 'Check your visibility now',
      body: 'A minute before you enter the water can save the trip.',
      primary: 'Launch App',
    },
    footerTagline: 'Underwater activity forecasting',
  },
} as const

const APP_URL = 'https://browniebase.com/mulsok-app/'

export default function MulsokPage() {
  const [lang, setLang] = useState<Lang>('ko')
  const t = c[lang]

  return (
    <main className="min-h-screen bg-white">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="/mulsok/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-sm">
              <span className="text-white text-base">🌊</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">Mulsok</span>
              <span className="block text-[10px] text-gray-400 leading-none">물속 · by Browniebase</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">{t.nav.features}</a>
            <a href="#activities" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">{t.nav.activities}</a>
            <a href="#regions" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">{t.nav.regions}</a>
            <a href="/salpim/" className="text-sm text-gray-500 hover:text-[#7B61FF] transition-colors">Salpim →</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs">
              <button onClick={() => setLang('ko')} className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'ko' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500'}`}>KO</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'en' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-500'}`}>EN</button>
            </div>
            <a href={APP_URL} className="hidden sm:inline-flex items-center gap-1.5 bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-cyan-700 transition-colors">
              {t.nav.launch}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-teal-50 pointer-events-none" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 bg-cyan-600/10 text-cyan-700 text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-cyan-600 rounded-full" />
              {t.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-4xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">{lang === 'ko' ? 'AI' : 'AI'}</span>{lang === 'ko' ? '로 ' : '-driven '}
              {t.hero.headline}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">{t.hero.subheadline}</p>
            <p className="text-base text-gray-500 italic max-w-xl">{t.hero.tagline}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
              <a href={APP_URL} className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors">
                <span>🌊</span>{t.hero.cta1}
              </a>
              <a href="#features" className="inline-flex items-center justify-center gap-2 border border-cyan-600 text-cyan-700 px-6 py-3 rounded-full font-medium hover:bg-cyan-50 transition-colors">
                {t.hero.cta2}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {t.hero.pills.map(p => (
                <div key={p.label} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 shadow-sm">
                  <span>{p.icon}</span>
                  <span className="font-medium">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What is ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.what.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{t.what.body}</p>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-400/20 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Activities ──────────────────────────────────────────── */}
      <section id="activities" className="py-20 bg-cyan-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">{t.activities.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.activities.list.map(a => (
              <div key={a.title} className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                <p className="text-gray-500 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">{t.how.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {t.how.steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                  <span className="text-white font-bold text-lg">{s.step}</span>
                </div>
                {i < t.how.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-0.5 bg-gradient-to-r from-cyan-500/40 to-cyan-500/10" />
                )}
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regions ─────────────────────────────────────────────── */}
      <section id="regions" className="py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.regions.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">{t.regions.body}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {t.regions.list.map(r => (
              <div key={r.name} className="flex items-center gap-2 bg-white border border-cyan-500/10 rounded-xl px-3 py-3 hover:border-cyan-500/30 transition-colors">
                <span className="text-xl">{r.flag}</span>
                <span className="text-sm font-medium text-gray-700">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand story ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t.brand.title}</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">{t.brand.body}</p>
          <p className="text-gray-600 leading-relaxed">{t.brand.connection}</p>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-teal-500 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl mb-6">🌊</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-white/90 text-lg mb-10">{t.cta.body}</p>
          <a href={APP_URL} className="inline-flex items-center justify-center gap-2 bg-white text-cyan-700 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-50 transition-colors shadow-lg">
            <span>🌊</span>{t.cta.primary}
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
                  <span className="text-white text-base">🌊</span>
                </div>
                <span className="font-bold text-lg">Mulsok</span>
                <span className="text-gray-500 text-sm">/ 물속</span>
              </div>
              <p className="text-gray-400 text-sm">{t.footerTagline}</p>
              <p className="text-gray-500 text-xs mt-1">by Browniebase</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">Browniebase</a>
              <a href="/salpim/" className="text-gray-400 hover:text-white text-sm transition-colors">Salpim</a>
              <a href="/privacy.html" className="text-gray-400 hover:text-white text-sm transition-colors">{lang === 'ko' ? '개인정보처리방침' : 'Privacy'}</a>
              <a href="/terms.html" className="text-gray-400 hover:text-white text-sm transition-colors">{lang === 'ko' ? '이용약관' : 'Terms'}</a>
              <a href="mailto:support@browniebase.com" className="text-gray-400 hover:text-white text-sm transition-colors">{lang === 'ko' ? '문의' : 'Contact'}</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2026 Browniebase. All rights reserved.</p>
            <p className="text-gray-600 text-xs">support@browniebase.com</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
