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
      tr: 'React/Next.js öğrenme sürecimin bir parçası olarak geliştirdiğim bu site. App Router, Server Components, Server Actions ve Tailwind CSS v4 kullanıyor.',
      en: 'This portfolio site, built as part of my React/Next.js learning journey. Uses App Router, Server Components, Server Actions, and Tailwind CSS v4.',
    },
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    github: 'https://github.com/berkaykose/portfolio',
    year: 2025,
    status: 'in-progress',
    oneLiner: {
      tr: 'Modern React/Next.js kalıplarını öğrenmek ve sergilemek için geliştirdiğim kişisel portföy sitesi.',
      en: 'A personal portfolio built to learn and showcase modern React/Next.js patterns.',
    },
  },
  {
    id: 'inventory-api',
    title: { tr: 'Envanter Yönetim API\'si', en: 'Inventory Management API' },
    description: {
      tr: 'Spring Boot ile geliştirilen RESTful API. JWT authentication, rol tabanlı yetkilendirme ve PostgreSQL ile stok takibi sağlıyor. Docker Compose ile çalıştırılabilir.',
      en: 'A RESTful API built with Spring Boot. Features JWT authentication, role-based authorization, and stock tracking with PostgreSQL. Runnable with Docker Compose.',
    },
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker'],
    github: 'https://github.com/berkaykose/inventory-api',
    year: 2024,
    status: 'completed',
    featured: true,
    screenshot: '/projects/inventory-api.png',
    oneLiner: {
      tr: 'JWT kimlik doğrulama ve rol tabanlı yetkilendirmeye sahip güvenli bir RESTful envanter API\'si.',
      en: 'A secure RESTful inventory API with JWT authentication and role-based access control.',
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
