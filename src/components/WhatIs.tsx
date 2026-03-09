interface WhatIsProps {
  c: { title: string; body: string }
}
export default function WhatIs({ c }: WhatIsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{c.title}</h2>
        <p className="text-lg text-gray-600 leading-relaxed">{c.body}</p>
        {/* Product type badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {['🍎 Food', '💄 Cosmetics', '💊 Supplements', '🧴 Personal Care', '🏠 Household'].map(t => (
            <span key={t} className="bg-[#f5f3ff] text-[#7B61FF] text-sm font-medium px-4 py-1.5 rounded-full border border-[#7B61FF]/20">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
