interface LanguagesProps {
  c: { title: string; body: string; list: string[] }
}

const flagEmoji: Record<string, string> = {
  '한국어': '🇰🇷', 'Korean': '🇰🇷',
  'English': '🇺🇸',
  '日本語': '🇯🇵', 'Japanese': '🇯🇵',
  '中文 (简体)': '🇨🇳', 'Chinese (Simplified)': '🇨🇳',
  '中文 (繁體)': '🇹🇼', 'Chinese (Traditional)': '🇹🇼',
  'ภาษาไทย': '🇹🇭', 'Thai': '🇹🇭',
  'Tiếng Việt': '🇻🇳', 'Vietnamese': '🇻🇳',
  'Español': '🇪🇸', 'Spanish': '🇪🇸',
  'Français': '🇫🇷', 'French': '🇫🇷',
  'Deutsch': '🇩🇪', 'German': '🇩🇪',
  'Русский': '🇷🇺', 'Russian': '🇷🇺',
  'العربية': '🇸🇦', 'Arabic': '🇸🇦',
  'Português': '🇧🇷', 'Portuguese': '🇧🇷',
}

export default function Languages({ c }: LanguagesProps) {
  return (
    <section id="languages" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">{c.body}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {c.list.map(lang => (
            <div key={lang} className="flex items-center gap-2 bg-[#f5f3ff] border border-[#7B61FF]/10 rounded-xl px-3 py-3 hover:border-[#7B61FF]/30 transition-colors">
              <span className="text-xl">{flagEmoji[lang] || '🌐'}</span>
              <span className="text-sm font-medium text-gray-700">{lang}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
