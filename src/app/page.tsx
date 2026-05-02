'use client'
import { useState } from 'react'

type Lang = 'ko' | 'en'

const t = {
  ko: {
    nav: { apps: '앱', about: '소개', contact: '문의' },
    hero: {
      badge: '브라우니베이스가 만드는 따뜻한 도구들',
      headline: '일상을 살피는 작은 도구들',
      subheadline: '복잡한 정보를 누구나 쉽게 이해할 수 있도록, AI와 데이터로 일상의 한 조각을 살핍니다.',
    },
    apps: {
      title: '우리가 만든 앱',
      subtitle: '하나씩, 깊이 있게',
      list: [
        {
          slug: 'salpim',
          icon: 'S',
          color: 'from-[#7B61FF] to-[#a78bfa]',
          name: 'Salpim',
          korean: '살핌',
          tagline: 'AI 성분 해설 앱',
          desc: '카메라로 제품 성분표를 스캔하면 AI가 13개 언어로 각 성분을 설명해 드립니다.',
          status: 'Google Play 정식 출시',
          statusColor: 'text-green-700 bg-green-50 border-green-200',
          ctaLabel: '자세히 보기',
        },
        {
          slug: 'mulsok',
          icon: '🌊',
          color: 'from-cyan-500 to-teal-400',
          name: 'Mulsok',
          korean: '물속',
          tagline: '수중 시야 예보 앱',
          desc: '바다 들어가기 전 시야를 예보합니다. 다이빙·스노클링·프리다이빙·해변수영 활동별 등급(A~E) 제공.',
          status: '베타 진행 중',
          statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
          ctaLabel: '자세히 보기',
        },
      ],
    },
    about: {
      title: 'Browniebase',
      body: 'Browniebase(브라우니베이스)는 사람들이 일상의 정보를 더 명확하게 이해할 수 있도록 돕는 디지털 도구를 만듭니다. 한국어 토박이말 이름으로 각 앱의 정체성을 담습니다 — Salpim(살핌)은 자세히 살펴봄, Mulsok(물속)은 바다 속을 미리 봄.',
    },
    contact: {
      title: '문의',
      body: '협업·제휴·피드백은 언제든 환영합니다.',
      email: 'support@browniebase.com',
    },
    footer: {
      copy: '© 2026 Browniebase. All rights reserved.',
      langSwitch: '🇺🇸 English',
    },
  },
  en: {
    nav: { apps: 'Apps', about: 'About', contact: 'Contact' },
    hero: {
      badge: 'Caring digital tools by Browniebase',
      headline: 'Small tools that look closer at everyday life',
      subheadline: 'We use AI and data to help everyone understand complex information — one slice of daily life at a time.',
    },
    apps: {
      title: 'Our Apps',
      subtitle: 'One at a time, with depth',
      list: [
        {
          slug: 'salpim',
          icon: 'S',
          color: 'from-[#7B61FF] to-[#a78bfa]',
          name: 'Salpim',
          korean: '살핌',
          tagline: 'AI Ingredient Reader',
          desc: 'Scan product ingredient labels with your camera. AI explains each ingredient in 13 languages.',
          status: 'Live on Google Play',
          statusColor: 'text-green-700 bg-green-50 border-green-200',
          ctaLabel: 'Learn more',
        },
        {
          slug: 'mulsok',
          icon: '🌊',
          color: 'from-cyan-500 to-teal-400',
          name: 'Mulsok',
          korean: '물속',
          tagline: 'Underwater Visibility Forecast',
          desc: 'Forecast underwater visibility before you enter the sea. A~E grades by activity (dive, snorkel, freedive, swim).',
          status: 'Beta in progress',
          statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
          ctaLabel: 'Learn more',
        },
      ],
    },
    about: {
      title: 'Browniebase',
      body: 'Browniebase builds digital tools that help people understand everyday information more clearly. Each app carries a Korean native-word name reflecting its identity — Salpim means "looking closely," Mulsok means "underwater."',
    },
    contact: {
      title: 'Contact',
      body: 'For partnerships, collaborations, or feedback — reach out anytime.',
      email: 'support@browniebase.com',
    },
    footer: {
      copy: '© 2026 Browniebase. All rights reserved.',
      langSwitch: '🇰🇷 한국어',
    },
  },
} as const

export default function BrowniebasePage() {
  const [lang, setLang] = useState<Lang>('ko')
  const c = t[lang]

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/90 backdrop-blur border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-700 to-amber-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">Browniebase</span>
              <span className="block text-[10px] text-gray-500 leading-none">caring digital tools</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <a href="#apps" className="text-sm text-gray-600 hover:text-amber-700 transition-colors">{c.nav.apps}</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-amber-700 transition-colors">{c.nav.about}</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-amber-700 transition-colors">{c.nav.contact}</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-amber-100 rounded-full p-0.5 text-xs">
              <button onClick={() => setLang('ko')} className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'ko' ? 'bg-amber-700 text-white shadow-sm' : 'text-gray-500'}`}>KO</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'en' ? 'bg-amber-700 text-white shadow-sm' : 'text-gray-500'}`}>EN</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF7F2] via-white to-amber-50/40 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-700/10 text-amber-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
            {c.hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {c.hero.headline}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{c.hero.subheadline}</p>
        </div>
      </section>

      {/* ── Apps ────────────────────────────────────────────────── */}
      <section id="apps" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{c.apps.title}</h2>
            <p className="text-gray-500">{c.apps.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.apps.list.map(app => (
              <a
                key={app.slug}
                href={`/${app.slug}/`}
                className="group block bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-md`}>
                    <span className="text-white text-2xl font-bold">{app.icon}</span>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${app.statusColor}`}>{app.status}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{app.name}</h3>
                  <span className="text-base text-gray-400">{app.korean}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-4">{app.tagline}</p>
                <p className="text-gray-600 leading-relaxed mb-6">{app.desc}</p>
                <div className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 group-hover:gap-2.5 transition-all">
                  {app.ctaLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-500 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{c.about.title}</span>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{c.about.body}</p>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.contact.title}</h2>
          <p className="text-gray-600 mb-8">{c.contact.body}</p>
          <a
            href={`mailto:${c.contact.email}`}
            className="inline-flex items-center gap-2 bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {c.contact.email}
          </a>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-700 to-amber-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-bold">Browniebase</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="/salpim/" className="text-gray-400 hover:text-white transition-colors">Salpim</a>
            <a href="/mulsok/" className="text-gray-400 hover:text-white transition-colors">Mulsok</a>
            <a href="/privacy.html" className="text-gray-400 hover:text-white transition-colors">{lang === 'ko' ? '개인정보처리방침' : 'Privacy'}</a>
            <a href="/terms.html" className="text-gray-400 hover:text-white transition-colors">{lang === 'ko' ? '이용약관' : 'Terms'}</a>
          </div>
          <p className="text-gray-500 text-xs">{c.footer.copy}</p>
        </div>
      </footer>
    </main>
  )
}
