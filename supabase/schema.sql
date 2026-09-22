-- Paste this once into the Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- Creates the CMS schema: articles + article_translations (translation-table i18n
-- pattern — see lib/admin/types.ts / lib/posts/types.ts for the matching frontend shapes)
-- plus Row Level Security policies. No `users` table — Supabase Auth (auth.users) owns
-- the single admin account, created manually via Authentication → Users.

create table articles (
  id bigint generated always as identity primary key,
  category text not null default 'Backend' check (char_length(btrim(category)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table article_translations (
  id bigint generated always as identity primary key,
  article_id bigint not null references articles(id) on delete cascade,
  locale text not null check (locale in ('en', 'tr')),
  title text not null,
  slug text not null,
  excerpt text,
  content jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  unique (article_id, locale),
  unique (locale, slug)
);

create index idx_article_translations_locale_status on article_translations (locale, status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_set_updated_at
before update on articles
for each row execute function set_updated_at();

alter table articles enable row level security;
alter table article_translations enable row level security;

-- Public: the articles table itself holds nothing sensitive (id/category/timestamps),
-- and PostgREST needs SELECT permission on both sides of a join to resolve an embed
-- like article_translations(*, articles(category)).
create policy "public read articles" on articles
  for select using (true);

-- Public: only published translations are visible — drafts stay invisible structurally,
-- not just hidden in the UI.
create policy "public read published translations" on article_translations
  for select using (status = 'published');

-- Admin (any authenticated user — there's only ever the one seeded account): full
-- read/write access on both tables, gated purely by having a valid session.
create policy "admin full access articles" on articles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access translations" on article_translations
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
