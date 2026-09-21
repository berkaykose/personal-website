-- Paste this once into the Supabase project's SQL Editor (after 001/schema.sql has
-- already been run). Creates the projects table + RLS, a public storage bucket for
-- screenshots, and migrates the 4 projects that used to live in data/projects.ts —
-- with `admin-panel`'s placement corrected to 'archive' (it had a stray `featured: true`
-- flag but was never actually in the real showcase list, see plan notes).

create table projects (
  id bigint generated always as identity primary key,
  title_en text not null,
  title_tr text not null,
  description_en text not null,
  description_tr text not null,
  one_liner_en text,
  one_liner_tr text,
  tags text[] not null default '{}',
  github_url text,
  live_url text,
  screenshot_url text,
  year integer not null,
  status text not null default 'completed' check (status in ('completed', 'in-progress', 'planned')),
  category text not null default 'frontend' check (category in ('frontend', 'backend')),
  placement text not null default 'archive' check (placement in ('showcase', 'archive')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_placement_order on projects (placement, display_order);

create trigger projects_set_updated_at
before update on projects
for each row execute function set_updated_at(); -- reuses the function created in 001/schema.sql

alter table projects enable row level security;

create policy "public read projects" on projects
  for select using (true);

create policy "admin full access projects" on projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage: public bucket so screenshot URLs are directly servable; RLS gates writes
-- to the authenticated admin only.
insert into storage.buckets (id, name, public)
  values ('project-screenshots', 'project-screenshots', true)
  on conflict (id) do nothing;

create policy "public read project screenshots" on storage.objects
  for select using (bucket_id = 'project-screenshots');

create policy "admin write project screenshots" on storage.objects
  for insert with check (bucket_id = 'project-screenshots' and auth.role() = 'authenticated');

create policy "admin update project screenshots" on storage.objects
  for update using (bucket_id = 'project-screenshots' and auth.role() = 'authenticated');

create policy "admin delete project screenshots" on storage.objects
  for delete using (bucket_id = 'project-screenshots' and auth.role() = 'authenticated');

-- One-time migration of the 4 projects that used to live in data/projects.ts.
-- screenshot_url is left null here — re-upload the two existing screenshots
-- (public/projects/portfolio.png, toast-notification-builder.png) through the
-- admin editor once it's live, since that's simpler than scripting a storage upload.
insert into projects
  (title_en, title_tr, description_en, description_tr, one_liner_en, one_liner_tr, tags, github_url, live_url, year, status, category, placement, display_order)
values
  (
    'Personal Portfolio', 'Kişisel Portföy Sitesi',
    'This site, built with Next.js App Router, Server Components/Actions and Supabase (Postgres + Auth) — bilingual content management with my own admin panel for publishing articles.',
    'Next.js App Router, Server Components/Actions ve Supabase (Postgres + Auth) ile geliştirdiğim, İngilizce/Türkçe içerik yönetimi olan bu site. Kendi admin panelinden yazılar yayınlıyorum.',
    'My personal portfolio, with its own admin panel and Supabase-backed content management.',
    'Kendi admin panelim ve Supabase destekli içerik yönetimiyle geliştirdiğim kişisel portföy sitesi.',
    array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    'https://github.com/berkaykose/personal-website', null,
    2026, 'in-progress', 'frontend', 'showcase', 0
  ),
  (
    'Toast Notification Builder', 'Toast Notification Builder',
    'A live toast notification configurator with type presets, custom colors, positioning, and animations — exports the configuration to code with one click.',
    'Tip ön ayarları, özel renkler, konumlandırma ve animasyonlar sunan; yapılandırmayı tek tıkla koda dönüştüren canlı bir toast bildirim oluşturucu.',
    'A configurable toast notification builder with live preview and code export.',
    'Canlı önizleme ve kod dışa aktarma özellikli, yapılandırılabilir bir toast bildirim oluşturucu.',
    array['Vite', 'Vue.js', 'Pinia', 'TypeScript'],
    'https://github.com/berkaykose/toast-notification-builder', null,
    2026, 'completed', 'frontend', 'showcase', 1
  ),
  (
    'Admin Dashboard', 'Yönetim Paneli',
    'An SPA admin panel built with Nuxt.js and Pinia. Features dynamic forms, table filtering, and real-time notifications.',
    'Nuxt.js ve Pinia ile geliştirilen SPA yönetim paneli. Dinamik formlar, tablo filtrelemesi ve gerçek zamanlı bildirimler içeriyor.',
    'An SPA admin dashboard with dynamic forms and real-time notifications.',
    'Dinamik formlar ve gerçek zamanlı bildirimlere sahip bir SPA yönetim paneli.',
    array['Vue.js', 'Nuxt.js', 'Pinia', 'TypeScript'],
    null, null,
    2024, 'completed', 'frontend', 'archive', 0
  ),
  (
    'Task Management App', 'Görev Takip Uygulaması',
    'A task management app I plan to build with Next.js App Router and Server Actions. Will include project-based task tracking and team collaboration features.',
    'Next.js App Router ve Server Actions ile geliştireceğim görev yönetim uygulaması. Proje bazlı görev takibi ve takım işbirliği özelliklerini içerecek.',
    null, null,
    array['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    null, null,
    2025, 'planned', 'backend', 'archive', 1
  );
