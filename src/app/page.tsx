'use client'
import { useState } from 'react'
import { Lang, content } from '@/lib/content'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WhatIs from '@/components/WhatIs'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Languages from '@/components/Languages'
import Personal from '@/components/Personal'
import BrandStory from '@/components/BrandStory'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  const [lang, setLang] = useState<Lang>('ko')
  const c = content[lang]

  return (
    <main className="min-h-screen bg-white">
      <Nav c={c.nav} lang={lang} setLang={setLang} />
      <Hero c={c.hero} />
      <WhatIs c={c.what} />
      <Features c={c.features} />
      <HowItWorks c={c.howItWorks} />
      <Languages c={c.languages} />
      <Personal c={c.personal} />
      <BrandStory c={c.brand} />
      <About c={c.about} />
      <FAQ c={c.faq} />
      <FinalCTA c={c.cta} />
      <Footer c={c.footer} lang={lang} />
    </main>
  )
}
