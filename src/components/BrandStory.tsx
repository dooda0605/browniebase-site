interface BrandStoryProps {
  c: { title: string; body: string; korean: string; connection: string }
}
export default function BrandStory({ c }: BrandStoryProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#7B61FF] to-[#6d51f0] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-5xl mb-6">살핌</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">{c.title}</h2>
        <p className="text-white/90 text-lg mb-6 leading-relaxed">{c.body}</p>
        <blockquote className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <p className="text-white text-xl font-medium leading-relaxed">{c.korean}</p>
        </blockquote>
        <p className="text-white/80 leading-relaxed">{c.connection}</p>
      </div>
    </section>
  )
}
