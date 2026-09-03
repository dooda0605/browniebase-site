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

        {/* 전자결제(PG) 심사 필수 항목 — 상호·사업자등록번호·대표자명·사업장 주소·유선번호가
            홈페이지 하단에 있어야 한다. 하나라도 빠지면 심사에서 반려된다
            (토스페이먼츠 심사 체크리스트, 2026-09-03 확인). 전자상거래법 표시의무이기도 하다. */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-gray-600 text-xs leading-relaxed">
          상호 브라우니베이스(Browniebase) &nbsp;|&nbsp; 대표 최민기 &nbsp;|&nbsp; 사업자등록번호 322-04-03564<br />
          주소 경기도 평택시 고덕국제대로 99, 2층 2217-비08호<br />
          전화 010-9377-3554 &nbsp;|&nbsp; 이메일 support@browniebase.com &nbsp;|&nbsp; 통신판매업 신고번호 신고 예정
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{c.copy}</p>
        </div>
      </div>
    </footer>
  )
}
