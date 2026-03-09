interface FeaturesProps {
  c: {
    title: string
    items: { icon: string; title: string; desc: string }[]
  }
}
export default function Features({ c }: FeaturesProps) {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-[#f5f3ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{c.title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B61FF]/10 to-[#a78bfa]/20 flex items-center justify-center text-2xl mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
