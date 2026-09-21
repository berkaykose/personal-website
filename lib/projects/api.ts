import { createClient } from '@/lib/supabase/server'
import type { ProjectCategory, ProjectStatus, PublicProject } from './types'

interface ProjectRow {
  id: number
  title_en: string
  title_tr: string
  description_en: string
  description_tr: string
  one_liner_en: string | null
  one_liner_tr: string | null
  tags: string[]
  github_url: string | null
  live_url: string | null
  screenshot_url: string | null
  screenshot_width: number | null
  screenshot_height: number | null
  year: number
  status: ProjectStatus
  category: ProjectCategory
}

const SELECT_COLUMNS =
  'id, title_en, title_tr, description_en, description_tr, one_liner_en, one_liner_tr, tags, github_url, live_url, screenshot_url, screenshot_width, screenshot_height, year, status, category'

function toPublicProject(row: ProjectRow, locale: string): PublicProject {
  const isTr = locale === 'tr'
  return {
    id: String(row.id),
    title: isTr ? row.title_tr : row.title_en,
    description: isTr ? row.description_tr : row.description_en,
    oneLiner: (isTr ? row.one_liner_tr : row.one_liner_en) ?? '',
    tags: row.tags,
    githubUrl: row.github_url,
    liveUrl: row.live_url,
    screenshotUrl: row.screenshot_url,
    screenshotWidth: row.screenshot_width,
    screenshotHeight: row.screenshot_height,
    year: row.year,
    status: row.status,
    category: row.category,
  }
}

export async function fetchShowcaseProjects(locale: string): Promise<PublicProject[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_COLUMNS)
    .eq('placement', 'showcase')
    .order('display_order')

  if (error) throw new Error(error.message)
  return (data as ProjectRow[]).map((row) => toPublicProject(row, locale))
}

export async function fetchArchiveProjects(locale: string): Promise<PublicProject[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_COLUMNS)
    .eq('placement', 'archive')
    .order('display_order')

  if (error) throw new Error(error.message)
  return (data as ProjectRow[]).map((row) => toPublicProject(row, locale))
}
