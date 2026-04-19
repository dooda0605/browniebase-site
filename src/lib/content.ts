export type Lang = 'en' | 'ko'

export const content = {
  en: {
    meta: {
      title: 'Salpim – AI Ingredient Reader | Browniebase',
      description: 'Scan ingredient labels and understand what they mean with AI. 13 languages supported.',
    },
    nav: {
      features: 'Features',
      howItWorks: 'How It Works',
      languages: 'Languages',
      faq: 'FAQ',
      download: 'Download',
    },
    hero: {
      badge: 'Now available on Google Play',
      headline: 'Take a closer look at ingredients',
      subheadline: 'Scan ingredient labels and understand what they mean with AI.',
      tagline: "Found a product you don't recognize? Scan it and take a closer look with Salpim.",
      ctaPrimary: 'Download on Google Play',
      ctaSecondary: 'Learn More',
      comingSoon: 'Download on Google Play',
      quickFeatures: [
        { icon: '🔍', label: 'AI Ingredient Scan' },
        { icon: '🌏', label: '13 Language Support' },
        { icon: '📚', label: 'Ingredient Library' },
      ],
    },
    what: {
      title: 'What is Salpim?',
      body: "Salpim helps you understand ingredients in everyday products — food, cosmetics, supplements, personal care, and household items. Instead of judging whether ingredients are safe, Salpim explains what each ingredient is and why it's used, empowering you to make informed decisions.",
    },
    features: {
      title: 'Key Features',
      items: [
        { icon: '📷', title: 'AI Ingredient Scan', desc: 'Scan ingredient labels with your phone camera and automatically extract the ingredient list.' },
        { icon: '💡', title: 'Ingredient Explanation', desc: 'Understand what ingredients are and why they are used — without medical judgments.' },
        { icon: '🌍', title: 'Global Product Understanding', desc: 'Scan unfamiliar imported or foreign products from anywhere in the world.' },
        { icon: '🌐', title: '13 Language Support', desc: 'Read ingredient explanations in your preferred language from 13 supported languages.' },
        { icon: '⚙️', title: 'Personal Preferences', desc: 'Configure ingredients you personally care about and track what matters to you.' },
        { icon: '📚', title: 'Ingredient Library', desc: 'Save ingredients and review them anytime from your personal library.' },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        { step: '01', title: 'Scan the label', desc: 'Point your camera at any product ingredient label.' },
        { step: '02', title: 'AI extracts ingredients', desc: 'AI reads and extracts the full ingredient list automatically.' },
        { step: '03', title: 'Salpim explains', desc: 'Get clear, informational explanations for each ingredient.' },
        { step: '04', title: 'Save to library', desc: 'Save ingredients you want to track or review later.' },
      ],
    },
    languages: {
      title: 'Understand Ingredients in 13 Languages',
      body: "Salpim lets you understand ingredient labels from products around the world, even when they're written in unfamiliar languages.",
      list: ['Korean', 'English', 'Japanese', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Thai', 'Vietnamese', 'Spanish', 'French', 'German', 'Russian', 'Arabic', 'Filipino'],
    },
    personal: {
      title: 'Personalized for You',
      items: [
        { icon: '⚙️', title: 'Track what matters', desc: 'Set ingredients you want to pay attention to, such as allergens or dietary preferences.' },
        { icon: '📚', title: 'Build your library', desc: 'Save and revisit ingredients from your scan history anytime.' },
        { icon: '🔄', title: 'Any product type', desc: 'Works with food, cosmetics, supplements, personal care, and household products.' },
      ],
    },
    brand: {
      title: 'Why the name Salpim?',
      body: '"Salpim" comes from the Korean word "살핌" — a pure Korean word meaning "carefully observing and examining something with great attention."',
      korean: '"살핌은 두루두루 주의하여 자세히 살펴본다는 뜻을 담은 순우리말입니다."',
      connection: 'This reflects the core philosophy of Salpim: helping you take a closer look at the ingredients that you might otherwise overlook.',
    },
    about: {
      title: 'About Browniebase',
      body: "Browniebase builds digital tools that help people understand everyday information more clearly. Salpim is Browniebase's flagship application, designed to make ingredient knowledge accessible to everyone.",
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'What products can I scan?', a: 'You can scan ingredient labels from food, cosmetics, supplements, personal care products, and household items.' },
        { q: 'Does Salpim judge ingredient safety?', a: 'No. Salpim provides informational explanations only. It does not make safety judgments or provide medical advice. Salpim helps you understand what ingredients are and why they are used.' },
        { q: 'Can I scan products from other countries?', a: 'Yes. Salpim is designed to understand ingredient labels from products around the world, regardless of language or country of origin.' },
        { q: 'Can I save ingredients?', a: 'Yes. You can save ingredients to your personal library and review them anytime.' },
        { q: 'Which languages are supported?', a: 'Salpim supports 13 languages: Korean, English, Japanese, Chinese (Simplified & Traditional), Thai, Vietnamese, Spanish, French, German, Russian, Arabic, and Filipino.' },
        { q: 'Is Salpim a medical app?', a: 'No. Salpim is an informational tool only. Always consult a qualified healthcare professional for medical advice.' },
      ],
    },
    cta: {
      title: 'Take a closer look at ingredients with Salpim',
      body: 'Scan products, understand ingredients, and save what matters to you.',
      primary: 'Download on Google Play',
      secondary: 'Learn More',
      comingSoon: 'Download on Google Play',
    },
    footer: {
      tagline: 'AI-powered ingredient understanding',
      company: 'Browniebase',
      links: [
        { label: 'Privacy Policy', href: '/privacy.html' },
        { label: 'Terms of Service', href: '/terms.html' },
        { label: 'Contact', href: 'mailto:support@browniebase.com' },
      ],
      copy: '© 2026 Browniebase. All rights reserved.',
    },
  },
  ko: {
    meta: {
      title: '살핌 – AI 성분 해설 앱 | Browniebase',
      description: 'AI로 성분표를 스캔하고 성분을 이해하세요. 13개 언어 지원.',
    },
    nav: {
      features: '주요 기능',
      howItWorks: '사용 방법',
      languages: '지원 언어',
      faq: 'FAQ',
      download: '다운로드',
    },
    hero: {
      badge: 'Google Play 정식 출시',
      headline: 'AI로 성분을 더 자세히 살펴보세요',
      subheadline: 'AI가 각 성분을 쉽게 설명해 드립니다.',
      tagline: '모르는 제품을 발견했다면 AI 스캔으로 성분을 살펴보세요.',
      ctaPrimary: 'Google Play에서 다운로드',
      ctaSecondary: '더 알아보기',
      comingSoon: 'Google Play에서 다운로드',
      quickFeatures: [
        { icon: '🔍', label: 'AI 성분 스캔' },
        { icon: '🌏', label: '13개 언어 지원' },
        { icon: '📚', label: '성분 라이브러리' },
      ],
    },
    what: {
      title: '살핌이란?',
      body: '살핌은 식품, 화장품, 건강기능식품, 생활용품 등 다양한 제품의 성분을 이해할 수 있도록 도와주는 앱입니다. 성분의 안전 여부를 판단하는 것이 아니라, 각 성분이 무엇이며 왜 사용되는지를 설명하여 여러분이 스스로 올바른 판단을 내릴 수 있도록 돕습니다.',
    },
    features: {
      title: '주요 기능',
      items: [
        { icon: '📷', title: 'AI 성분 스캔', desc: '카메라로 성분표를 촬영하면 AI가 자동으로 성분 목록을 추출합니다.' },
        { icon: '💡', title: '성분 해설', desc: '각 성분이 무엇이며 왜 사용되는지를 의학적 판단 없이 쉽게 설명합니다.' },
        { icon: '🌍', title: '해외 제품 이해', desc: '전 세계 어디서 구매한 낯선 수입 제품도 스캔하여 이해할 수 있습니다.' },
        { icon: '🌐', title: '13개 언어 지원', desc: '원하는 언어로 성분 설명을 확인할 수 있습니다. 13개 언어를 지원합니다.' },
        { icon: '⚙️', title: '개인 설정', desc: '내가 주목하고 싶은 성분을 직접 설정하여 맞춤형 정보를 확인하세요.' },
        { icon: '📚', title: '성분 라이브러리', desc: '관심 성분을 저장하고 언제든지 다시 확인할 수 있습니다.' },
      ],
    },
    howItWorks: {
      title: '이렇게 사용하세요',
      steps: [
        { step: '01', title: '라벨 스캔', desc: '카메라를 제품 성분표에 갖다 대세요.' },
        { step: '02', title: 'AI 성분 추출', desc: 'AI가 성분 목록을 자동으로 인식하고 추출합니다.' },
        { step: '03', title: '살핌이 설명', desc: '각 성분에 대한 명확하고 이해하기 쉬운 설명을 제공합니다.' },
        { step: '04', title: '라이브러리 저장', desc: '관심 성분을 저장하여 나중에 다시 확인하세요.' },
      ],
    },
    languages: {
      title: '13개 언어로 성분을 이해하세요',
      body: '전 세계 어디서 구매한 제품이든, 낯선 언어로 적힌 성분표도 살핌으로 이해할 수 있습니다.',
      list: ['한국어', 'English', '日本語', '中文 (简体)', '中文 (繁體)', 'ภาษาไทย', 'Tiếng Việt', 'Español', 'Français', 'Deutsch', 'Русский', 'العربية', 'Filipino'],
    },
    personal: {
      title: '나만의 맞춤 설정',
      items: [
        { icon: '⚙️', title: '내가 원하는 성분 추적', desc: '알레르기나 식이 제한 등 내가 주목하고 싶은 성분을 직접 설정하세요.' },
        { icon: '📚', title: '나만의 라이브러리', desc: '스캔 기록에서 저장한 성분을 언제든지 다시 확인할 수 있습니다.' },
        { icon: '🔄', title: '다양한 제품 지원', desc: '식품, 화장품, 건강기능식품, 생활용품 모두 지원합니다.' },
      ],
    },
    brand: {
      title: '왜 이름이 "살핌"인가요?',
      body: '"살핌(Salpim)"은 한국어에서 온 순우리말로, "두루두루 주의하여 자세히 살펴본다"는 뜻을 담고 있습니다.',
      korean: '"살핌은 두루두루 주의하여 자세히 살펴본다는 뜻을 담은 순우리말입니다."',
      connection: '이 이름은 살핌의 핵심 철학을 담고 있습니다 — 평소에 그냥 지나쳤던 성분들을 더 자세히 들여다볼 수 있도록 돕는 것입니다.',
    },
    about: {
      title: 'Browniebase 소개',
      body: 'Browniebase는 사람들이 일상의 정보를 더 명확하게 이해할 수 있도록 돕는 디지털 도구를 개발합니다. 살핌은 Browniebase의 대표 앱으로, 성분 정보를 누구나 쉽게 접근할 수 있도록 설계되었습니다.',
    },
    faq: {
      title: '자주 묻는 질문',
      items: [
        { q: '어떤 제품을 스캔할 수 있나요?', a: '식품, 화장품, 건강기능식품, 생활용품 등의 성분표를 스캔할 수 있습니다.' },
        { q: '살핌이 성분의 안전 여부를 판단하나요?', a: '아닙니다. 살핌은 정보 제공 목적으로만 사용됩니다. 성분의 안전 여부를 판단하거나 의학적 조언을 제공하지 않습니다. 각 성분이 무엇이며 왜 사용되는지를 설명합니다.' },
        { q: '해외 제품도 스캔할 수 있나요?', a: '네. 살핌은 전 세계 제품의 성분표를 이해하도록 설계되었습니다. 언어나 원산지에 관계없이 사용할 수 있습니다.' },
        { q: '성분을 저장할 수 있나요?', a: '네. 관심 성분을 개인 라이브러리에 저장하고 언제든지 다시 확인할 수 있습니다.' },
        { q: '어떤 언어를 지원하나요?', a: '한국어, 영어, 일본어, 중국어(간체·번체), 태국어, 베트남어, 스페인어, 프랑스어, 독일어, 러시아어, 아랍어, 필리핀어 등 13개 언어를 지원합니다.' },
        { q: '살핌은 의료 앱인가요?', a: '아닙니다. 살핌은 정보 제공 도구입니다. 의료 관련 사항은 반드시 전문의와 상담하세요.' },
      ],
    },
    cta: {
      title: 'AI로 성분을 더 자세히 살펴보세요',
      body: '제품을 스캔하고, 성분을 이해하고, 중요한 것을 저장하세요.',
      primary: 'Google Play에서 다운로드',
      secondary: '더 알아보기',
      comingSoon: 'Google Play에서 다운로드',
    },
    footer: {
      tagline: 'AI 기반 성분 해설 앱',
      company: 'Browniebase',
      links: [
        { label: '개인정보처리방침', href: '/privacy.html' },
        { label: '이용약관', href: '/terms.html' },
        { label: '문의', href: 'mailto:support@browniebase.com' },
      ],
      copy: '© 2026 Browniebase. All rights reserved.',
    },
  },
}
