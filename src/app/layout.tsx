import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Browniebase – Caring digital tools',
  description: 'Browniebase builds caring digital tools. Salpim (AI ingredient reader) and Mulsok (underwater visibility forecast).',
  openGraph: {
    title: 'Browniebase – Caring digital tools',
    description: 'Salpim · Mulsok — small tools that look closer at everyday life.',
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
