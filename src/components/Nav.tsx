'use client'
import { useState } from 'react'
import { Lang } from '@/lib/content'

interface NavProps {
  c: {
    features: string
    howItWorks: string
    languages: string
    faq: string
    download: string
  }
  lang: Lang
  setLang: (l: Lang) => void
}

export default function Nav({ c, lang, setLang }: NavProps) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: c.features, href: '#features' },
    { label: c.howItWorks, href: '#how-it-works' },
    { label: c.languages, href: '#languages' },
    { label: c.faq, href: '#faq' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#a78bfa] flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg leading-none">Salpim</span>
            <span className="block text-[10px] text-gray-400 leading-none">by Browniebase</span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-gray-600 hover:text-[#7B61FF] transition-colors">{l.label}</a>
          ))}
        </div>

        {/* Right: lang toggle + CTA */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'ko' ? 'bg-white text-[#7B61FF] shadow-sm' : 'text-gray-500'}`}
            >KO</button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full transition-all font-medium ${lang === 'en' ? 'bg-white text-[#7B61FF] shadow-sm' : 'text-gray-500'}`}
            >EN</button>
          </div>

          <a href="https://play.google.com/store/apps/details?id=app.ingredientanalyzer.consumer" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 bg-[#7B61FF] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#6d51f0] transition-colors">
            {c.download}
          </a>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-gray-700 hover:text-[#7B61FF]">{l.label}</a>
          ))}
          <a href="https://play.google.com/store/apps/details?id=app.ingredientanalyzer.consumer" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center bg-[#7B61FF] text-white text-sm font-medium px-4 py-2 rounded-full">
            {c.download}
          </a>
        </div>
      )}
    </nav>
  )
}
