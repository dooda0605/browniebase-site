// 사이버몰 운영자 표시(전자상거래법 제10조) — 상호·대표자·주소·전화·이메일·사업자등록번호·
// 통신판매업 신고번호·호스팅 제공자·약관 링크. 전자결제(PG) 심사 필수 항목이기도 하다
// (토스페이먼츠 심사 체크리스트, 2026-09-03 확인 — 하나라도 빠지면 반려).
// 값은 public/badapong/partners/index.html 의 .bizinfo 블록·terms-badapong(-en).html 과 같아야 한다.
// 한 곳을 바꾸면 그 HTML 들도 같이 바꿀 것(정적 HTML 이라 이 컴포넌트를 못 쓴다).
// 「사업자정보 확인」 = 공정위 통신판매사업자 정보공개 팝업(bizCommPop.do, 2026-09-29 응답 확인 — 보안문자 뒤 조회).

const BIZ_NO = '322-04-03564'
export const FTC_BIZ_URL = `https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${BIZ_NO.replace(/-/g, '')}`

type Lang = 'ko' | 'en'

export default function BizInfo({ lang, showPolicyLinks = true, className = '' }: {
  lang: Lang
  showPolicyLinks?: boolean
  className?: string
}) {
  const sep = <>&nbsp;|&nbsp;</>
  const link = 'underline underline-offset-2 hover:text-white'
  if (lang === 'en') {
    return (
      <div className={`text-xs leading-relaxed ${className}`}>
        Browniebase {sep} Owner: Choi Mingi {sep} Business Reg. No. {BIZ_NO}<br />
        2F, Unit 2217-B08, 99, Godeokgukje-daero, Pyeongtaek-si, Gyeonggi-do 18018, Republic of Korea<br />
        E-commerce Registration No. 2026-Gyeonggi Songtan-0795 {sep} Tel +82-10-9377-3554<br />
        E-mail <a href="mailto:support@browniebase.com" className={link}>support@browniebase.com</a>{sep}
        Hosting service: GitHub, Inc.{sep}
        <a href={FTC_BIZ_URL} target="_blank" rel="noopener noreferrer" className={link}>Business info (KFTC)</a>
        {showPolicyLinks && (<>
          <br />
          <a href="/terms-badapong-en.html" className={link}>Terms of Service</a>{sep}
          <a href="/privacy-badapong-en.html" className={link}>Privacy Policy</a>
        </>)}
      </div>
    )
  }
  return (
    <div className={`text-xs leading-relaxed ${className}`}>
      상호 브라우니베이스(Browniebase) {sep} 대표 최민기 {sep} 사업자등록번호 {BIZ_NO}<br />
      주소 경기도 평택시 고덕국제대로 99, 2층 2217-비08호<br />
      전화 010-9377-3554 {sep} 이메일 <a href="mailto:support@browniebase.com" className={link}>support@browniebase.com</a><br />
      통신판매업 신고번호 제2026-경기송탄-0795호{sep}
      <a href={FTC_BIZ_URL} target="_blank" rel="noopener noreferrer" className={link}>사업자정보 확인</a><br />
      호스팅서비스 GitHub, Inc.
      {showPolicyLinks && (<>
        {sep}
        <a href="/terms-badapong.html" className={link}>이용약관</a>{sep}
        <a href="/privacy-badapong.html" className={`${link} font-bold`}>개인정보처리방침</a>
      </>)}
    </div>
  )
}
