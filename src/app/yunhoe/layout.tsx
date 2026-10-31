import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yunhoe 윤회: 인생 시뮬레이션 – Browniebase',
  description: '태어난 날로 시작해 여든 살까지, 시간표를 짜고 갈림길에서 고르며 한 사람의 인생을 살아 보는 인생 시뮬레이션 게임.',
}

export default function YunhoeLayout({ children }: { children: React.ReactNode }) {
  return children
}
