interface HeroProps {
  c: {
    badge: string
    headline: string
    subheadline: string
    tagline: string
    ctaPrimary: string
    ctaSecondary: string
    comingSoon: string
    quickFeatures: { icon: string; label: string }[]
  }
}

export default function Hero({ c }: HeroProps) {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ff] via-white to-[#ede9fe] pointer-events-none" />
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#7B61FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#7B61FF] rounded-full"></span>
              {c.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              {c.headline.includes('AI') ? (
                <>
                  {c.headline.split('AI')[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#a78bfa]">AI</span>
                  {c.headline.split('AI')[1]}
                </>
              ) : (
                c.headline
              )}
            </h1>

            <p className="text-lg text-gray-600 mb-3 max-w-xl mx-auto lg:mx-0">{c.subheadline}</p>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto lg:mx-0 italic">&ldquo;{c.tagline}&rdquo;</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start" id="download">
              <a
                href="https://play.google.com/store/apps/details?id=app.ingredientanalyzer.consumer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                </svg>
                {c.ctaPrimary}
              </a>
              <a href="#features" className="inline-flex items-center justify-center gap-2 border border-[#7B61FF] text-[#7B61FF] px-6 py-3 rounded-full font-medium hover:bg-[#7B61FF]/5 transition-colors">
                {c.ctaSecondary}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </a>
            </div>

            {/* Quick features */}
            <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
              {c.quickFeatures.map(f => (
                <div key={f.label} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm text-gray-700 shadow-sm">
                  <span>{f.icon}</span>
                  <span className="font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-64 h-[520px] bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden border-4 border-gray-800">
              {/* Status bar */}
              <div className="h-8 bg-gray-900 flex items-center justify-center">
                <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
              </div>
              {/* App UI mockup */}
              <div className="flex-1 bg-white h-full">
                {/* App header */}
                <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#a78bfa]"></div>
                    <span className="text-xs font-bold text-gray-800">Salpim</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Scanning result</p>
                </div>
                {/* Ingredient cards */}
                <div className="px-3 py-3 space-y-2">
                  {[
                    { name: 'Niacinamide', status: 'safe', desc: 'Vitamin B3 derivative' },
                    { name: 'Glycerin', status: 'safe', desc: 'Moisturizing agent' },
                    { name: 'Cetearyl Alcohol', status: 'info', desc: 'Emulsifier' },
                    { name: 'Fragrance', status: 'caution', desc: 'May cause sensitivity' },
                    { name: 'Hyaluronic Acid', status: 'safe', desc: 'Hydration booster' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded-xl border text-left ${
                      item.status === 'caution' ? 'border-amber-200 bg-amber-50' :
                      item.status === 'info' ? 'border-blue-100 bg-blue-50' :
                      'border-gray-100 bg-gray-50'
                    }`}>
                      <div className={`w-1.5 min-h-[32px] rounded-full flex-shrink-0 ${
                        item.status === 'caution' ? 'bg-amber-400' :
                        item.status === 'info' ? 'bg-blue-400' :
                        'bg-[#7B61FF]'
                      }`}></div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-800">{item.name}</p>
                        <p className="text-[9px] text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -left-6 top-24 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-800">🔍 AI Scan</p>
              <p className="text-[10px] text-gray-500">Analyzing...</p>
            </div>
            <div className="absolute -right-6 bottom-24 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
              <p className="text-xs font-bold text-[#7B61FF]">✓ Saved</p>
              <p className="text-[10px] text-gray-500">To library</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
