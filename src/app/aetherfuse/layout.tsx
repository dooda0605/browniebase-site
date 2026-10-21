import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aetherfuse 에테르퓨즈 – Browniebase',
  description: 'An elemental merge battle — fuse two touching spirits yourself, right in the middle of the fight.',
}

export default function AetherfuseLayout({ children }: { children: React.ReactNode }) {
  return children
}
