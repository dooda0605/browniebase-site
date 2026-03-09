import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Salpim – AI Ingredient Reader | Browniebase',
  description: 'Scan ingredient labels and understand what they mean with AI. 13 languages supported.',
  openGraph: {
    title: 'Salpim – AI Ingredient Reader',
    description: 'Take a closer look at ingredients with AI.',
    url: 'https://browniebase.com',
    siteName: 'Salpim by Browniebase',
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
