import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Browniebase – Caring digital tools',
  description: 'Browniebase builds caring digital tools. Badapong — underwater visibility & ocean weather forecast.',
  openGraph: {
    title: 'Browniebase – Caring digital tools',
    description: 'Badapong — small tools that look closer at everyday life.',
    url: 'https://browniebase.com',
    siteName: 'Browniebase',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
