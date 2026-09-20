type Localized = { tr: string; en: string }

export interface ExperienceEntry {
  period: Localized
  role: Localized
  company: string
  location: Localized
  description: Localized
  tags?: string[]
}

// En yeni önce — özgeçmiş/timeline sıralaması.
export const experience: ExperienceEntry[] = [
  {
    period: { en: 'Feb 2026 — Present', tr: 'Şubat 2026 — Günümüz' },
    role: { en: 'Software Engineer', tr: 'Yazılım Mühendisi' },
    company: 'OBLIQUEX',
    location: { en: 'Remote', tr: 'Uzaktan' },
    description: {
      en: 'Building full-stack products from the ground up at OBLIQUEX, a company I co-founded with a friend.',
      tr: 'Bir arkadaşımla birlikte kurduğumuz OBLIQUEX\'te sıfırdan full-stack ürünler geliştiriyorum.',
    },
    tags: ['TypeScript', 'React.js', 'Next.js', 'PostgreSQL', 'Java', 'Spring Boot'],
  },
  {
    period: { en: 'Dec 2021 — Feb 2026', tr: 'Aralık 2021 — Şubat 2026' },
    role: { en: 'Software Engineer', tr: 'Yazılım Mühendisi' },
    company: 'Pitcher',
    location: { en: 'Switzerland', tr: 'İsviçre' },
    description: {
      en: 'Built and maintained customer-facing production applications across the full stack, using Vue.js, Nuxt.js and Angular on the frontend, alongside PHP and SQL on the backend.',
      tr: 'Frontend\'de Vue.js, Nuxt.js ve Angular, backend\'de PHP ve SQL kullanarak müşteriye yönelik production uygulamalarını full-stack olarak geliştirdim ve sürdürdüm.',
    },
    tags: ['JavaScript', 'TypeScript', 'Vue.js', 'Nuxt.js', 'Angular', 'PHP', 'SQL'],
  },
]
