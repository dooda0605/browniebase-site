interface PersonalProps {
  c: {
    title: string
    items: { icon: string; title: string; desc: string }[]
  }
}
export default function Personal({ c }: PersonalProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f5f3ff]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">{c.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.items.map((item, i) => (
            <div key={i} className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
