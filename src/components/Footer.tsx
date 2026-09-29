import { Lang } from '@/lib/content'
import BizInfo from '@/components/BizInfo'

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

        {/* 전자결제(PG) 심사 필수 항목 — 상호·사업자등록번호·대표자명·사업장 주소·유선번호가
            홈페이지 하단에 있어야 한다. 하나라도 빠지면 심사에서 반려된다
            (토스페이먼츠 심사 체크리스트, 2026-09-03 확인). 전자상거래법 표시의무이기도 하다. */}
        {/* 통신판매업 신고번호는 「신고 예정」이었다가 신고 완료 — 값은 BizInfo.tsx 한 곳(2026-09-29).
            약관 링크는 위 c.links 에 살핌용이 따로 있어 여기선 뺀다. */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <BizInfo lang={lang} showPolicyLinks={false} className="text-gray-600" />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{c.copy}</p>
        </div>
      </div>
    </footer>
  )
}
