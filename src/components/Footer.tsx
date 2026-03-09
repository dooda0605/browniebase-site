import { Lang } from '@/lib/content'

interface FooterProps {
  c: {
    tagline: string
    company: string
    links: { label: string; href: string }[]
    copy: string
  }
  lang: Lang
}
export default function Footer({ c, lang }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#a78bfa] flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="font-bold text-lg">Salpim</span>
              <span className="text-gray-500 text-sm">/ 살핌</span>
            </div>
            <p className="text-gray-400 text-sm">{c.tagline}</p>
            <p className="text-gray-500 text-xs mt-1">by {c.company}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6">
            {c.links.map(l => (
              <a key={l.label} href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors">{l.label}</a>
            ))}
            <span className="text-gray-400 text-sm">
              {lang === 'ko' ? <span>🇺🇸 English</span> : <span>🇰🇷 한국어</span>}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{c.copy}</p>
          <p className="text-gray-600 text-xs">support@browniebase.com</p>
        </div>
      </div>
    </footer>
  )
}
