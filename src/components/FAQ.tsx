'use client'
import { useState } from 'react'

interface FAQProps {
  c: {
    title: string
    items: { q: string; a: string }[]
  }
}
export default function FAQ({ c }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-20 bg-[#f5f3ff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">{c.title}</h2>
        <div className="space-y-3">
          {c.items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                <svg className={`w-5 h-5 text-[#7B61FF] flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed text-sm">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
