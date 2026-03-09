interface HowItWorksProps {
  c: {
    title: string
    steps: { step: string; title: string; desc: string }[]
  }
}
export default function HowItWorks({ c }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="py-20 bg-[#f5f3ff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-14">{c.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {c.steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {/* Step number circle */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#a78bfa] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7B61FF]/20">
                <span className="text-white font-bold text-lg">{step.step}</span>
              </div>
              {/* Connecting line */}
              {i < c.steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-0.5 bg-gradient-to-r from-[#7B61FF]/40 to-[#7B61FF]/10" />
              )}
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
