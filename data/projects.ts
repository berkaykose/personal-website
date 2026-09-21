export type ProjectStatus = 'completed' | 'in-progress' | 'planned'

export interface Project {
  id: string
  title: { tr: string; en: string }
  description: { tr: string; en: string }
  tags: string[]
  github?: string
  live?: string
  year: number
  status: ProjectStatus
  /** Ana sayfadaki "Featured Projects" bölümünde gösterilsin mi */
  featured?: boolean
  /** Öne çıkan bölüm için tek cümlelik özet (kart açıklamasından farklı, daha kısa) */
  oneLiner?: { tr: string; en: string }
  /** Öne çıkan bölümdeki ekran görüntüsü (public/ altındaki yol) */
  screenshot?: string
}

export const projects: Project[] = [
  {
    id: 'toast-notification-builder',
    title: { tr: 'Toast Notification Builder', en: 'Toast Notification Builder' },
    description: {
      tr: 'Tip ön ayarları, özel renkler, konumlandırma ve animasyonlar sunan; yapılandırmayı tek tıkla koda dönüştüren canlı bir toast bildirim oluşturucu.',
      en: 'A live toast notification configurator with type presets, custom colors, positioning, and animations — exports the configuration to code with one click.',
    },
    tags: ['Vite', 'Vue.js', 'Pinia', 'TypeScript'],
    github: 'https://github.com/berkaykose/toast-notification-builder',
    year: 2026,
    status: 'completed',
    featured: true,
    screenshot: '/projects/toast-notification-builder.png',
    oneLiner: {
      tr: 'Canlı önizleme ve kod dışa aktarma özellikli, yapılandırılabilir bir toast bildirim oluşturucu.',
      en: 'A configurable toast notification builder with live preview and code export.',
    },
  },
  {
    id: 'portfolio',
    title: { tr: 'Kişisel Portföy Sitesi', en: 'Personal Portfolio' },
    description: {
      tr: 'Next.js App Router, Server Components/Actions ve Supabase (Postgres + Auth) ile geliştirdiğim, İngilizce/Türkçe içerik yönetimi olan bu site. Kendi admin panelinden yazılar yayınlıyorum.',
      en: 'This site, built with Next.js App Router, Server Components/Actions and Supabase (Postgres + Auth) — bilingual content management with my own admin panel for publishing articles.',
    },
    tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    github: 'https://github.com/berkaykose/personal-website',
    // live: 'https://berkaykose.dev', — domain henüz aktif edilmedi, o zamana
    // kadar "View Project" GitHub repo'ya gitsin (href = project.live ?? project.github).
    year: 2026,
    status: 'in-progress',
    featured: true,
    screenshot: '/projects/portfolio.png',
    oneLiner: {
      tr: 'Kendi admin panelim ve Supabase destekli içerik yönetimiyle geliştirdiğim kişisel portföy sitesi.',
      en: 'My personal portfolio, with its own admin panel and Supabase-backed content management.',
    },
  },
  {
    id: 'admin-panel',
    title: { tr: 'Yönetim Paneli', en: 'Admin Dashboard' },
    description: {
      tr: 'Nuxt.js ve Pinia ile geliştirilen SPA yönetim paneli. Dinamik formlar, tablo filtrelemesi ve gerçek zamanlı bildirimler içeriyor.',
      en: 'An SPA admin panel built with Nuxt.js and Pinia. Features dynamic forms, table filtering, and real-time notifications.',
    },
    tags: ['Vue.js', 'Nuxt.js', 'Pinia', 'TypeScript'],
    year: 2024,
    status: 'completed',
    featured: true,
    oneLiner: {
      tr: 'Dinamik formlar ve gerçek zamanlı bildirimlere sahip bir SPA yönetim paneli.',
      en: 'An SPA admin dashboard with dynamic forms and real-time notifications.',
    },
  },
  {
    id: 'task-tracker',
    title: { tr: 'Görev Takip Uygulaması', en: 'Task Management App' },
    description: {
      tr: 'Next.js App Router ve Server Actions ile geliştireceğim görev yönetim uygulaması. Proje bazlı görev takibi ve takım işbirliği özelliklerini içerecek.',
      en: 'A task management app I plan to build with Next.js App Router and Server Actions. Will include project-based task tracking and team collaboration features.',
    },
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    year: 2025,
    status: 'planned',
  },
]
