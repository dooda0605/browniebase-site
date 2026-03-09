interface AboutProps {
  c: { title: string; body: string }
}
export default function About({ c }: AboutProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#a78bfa] flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Browniebase</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{c.title}</h2>
        <p className="text-gray-600 leading-relaxed">{c.body}</p>
      </div>
    </section>
  )
}
