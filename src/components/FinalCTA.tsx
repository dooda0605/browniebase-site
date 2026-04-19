interface FinalCTAProps {
  c: { title: string; body: string; primary: string; secondary: string; comingSoon: string }
}
export default function FinalCTA({ c }: FinalCTAProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
        <p className="text-gray-600 mb-10 text-lg">{c.body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://play.google.com/store/apps/details?id=app.ingredientanalyzer.consumer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-700 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
            </svg>
            {c.primary}
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-400">browniebase.com</p>
      </div>
    </section>
  )
}
