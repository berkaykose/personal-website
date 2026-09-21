import { createClient } from '@/lib/supabase/server'

export type ProjectStatus = 'completed' | 'in-progress' | 'planned'
export type ProjectCategory = 'frontend' | 'backend'
export type ProjectPlacement = 'showcase' | 'archive'

export interface AdminProject {
  id: string
  title: { en: string; tr: string }
  description: { en: string; tr: string }
  oneLiner: { en: string; tr: string }
  tags: string[]
  githubUrl: string
  liveUrl: string
  screenshotUrl: string | null
  screenshotWidth: number | null
  screenshotHeight: number | null
  year: number
  status: ProjectStatus
  category: ProjectCategory
  placement: ProjectPlacement
  displayOrder: number
}

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
  placement: ProjectPlacement
  display_order: number
}

const SCREENSHOT_BUCKET = 'project-screenshots'
const SELECT_COLUMNS =
  'id, title_en, title_tr, description_en, description_tr, one_liner_en, one_liner_tr, tags, github_url, live_url, screenshot_url, screenshot_width, screenshot_height, year, status, category, placement, display_order'

function toAdminProject(row: ProjectRow): AdminProject {
  return {
    id: String(row.id),
    title: { en: row.title_en, tr: row.title_tr },
    description: { en: row.description_en, tr: row.description_tr },
    oneLiner: { en: row.one_liner_en ?? '', tr: row.one_liner_tr ?? '' },
    tags: row.tags,
    githubUrl: row.github_url ?? '',
    liveUrl: row.live_url ?? '',
    screenshotUrl: row.screenshot_url,
    screenshotWidth: row.screenshot_width,
    screenshotHeight: row.screenshot_height,
    year: row.year,
    status: row.status,
    category: row.category,
    placement: row.placement,
    displayOrder: row.display_order,
  }
}

export async function fetchAllProjects(): Promise<AdminProject[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_COLUMNS)
    .order('placement')
    .order('display_order')

  if (error) throw new Error(error.message)
  return (data as ProjectRow[]).map(toAdminProject)
}

export async function fetchProjectById(id: string): Promise<AdminProject | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return toAdminProject(data as ProjectRow)
}

function screenshotPathFromUrl(url: string): string | null {
  const marker = `/object/public/${SCREENSHOT_BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return url.slice(index + marker.length)
}

async function uploadScreenshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() || 'png'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(SCREENSHOT_BUCKET)
    .upload(path, file, { contentType: file.type })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(SCREENSHOT_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function deleteScreenshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  url: string
): Promise<void> {
  const path = screenshotPathFromUrl(url)
  if (!path) return
  await supabase.storage.from(SCREENSHOT_BUCKET).remove([path])
}

export interface ProjectFormValues {
  titleEn: string
  titleTr: string
  descriptionEn: string
  descriptionTr: string
  oneLinerEn: string
  oneLinerTr: string
  tags: string[]
  githubUrl: string
  liveUrl: string
  year: number
  status: ProjectStatus
  category: ProjectCategory
  placement: ProjectPlacement
}

// screenshotAction: 'keep' bırakır dokunmaz, 'replace' yeni dosyayı yükleyip
// eskisini (varsa) storage'dan siler, 'remove' mevcut ekran görüntüsünü
// storage'dan silip alanı null bırakır. screenshotDimensions, seçilen dosyanın
// gerçek piksel boyutu (tarayıcıda okunur) — object-fit ile değil, doğal en/boy
// oranıyla, bozulmadan render edebilmek için gerekli (bkz. ProjectScreenshot.tsx).
export async function saveProject(
  id: string | null,
  values: ProjectFormValues,
  screenshotAction: 'keep' | 'replace' | 'remove',
  screenshotFile: File | null,
  screenshotDimensions: { width: number; height: number } | null
): Promise<AdminProject> {
  const supabase = await createClient()

  const existing = id ? await fetchProjectById(id) : null

  let screenshotUrl = existing?.screenshotUrl ?? null
  let screenshotWidth = existing?.screenshotWidth ?? null
  let screenshotHeight = existing?.screenshotHeight ?? null
  if (screenshotAction === 'replace' && screenshotFile) {
    if (existing?.screenshotUrl) await deleteScreenshot(supabase, existing.screenshotUrl)
    screenshotUrl = await uploadScreenshot(supabase, screenshotFile)
    screenshotWidth = screenshotDimensions?.width ?? null
    screenshotHeight = screenshotDimensions?.height ?? null
  } else if (screenshotAction === 'remove') {
    if (existing?.screenshotUrl) await deleteScreenshot(supabase, existing.screenshotUrl)
    screenshotUrl = null
    screenshotWidth = null
    screenshotHeight = null
  }

  const row = {
    title_en: values.titleEn,
    title_tr: values.titleTr,
    description_en: values.descriptionEn,
    description_tr: values.descriptionTr,
    one_liner_en: values.oneLinerEn || null,
    one_liner_tr: values.oneLinerTr || null,
    tags: values.tags,
    github_url: values.githubUrl || null,
    live_url: values.liveUrl || null,
    screenshot_url: screenshotUrl,
    screenshot_width: screenshotWidth,
    screenshot_height: screenshotHeight,
    year: values.year,
    status: values.status,
    category: values.category,
    placement: values.placement,
  }

  if (id) {
    const { error } = await supabase.from('projects').update(row).eq('id', id)
    if (error) throw new Error(error.message)
    const updated = await fetchProjectById(id)
    if (!updated) throw new Error('Project not found after update.')
    return updated
  }

  // Yeni proje eklenen placement grubunun sonuna gitsin.
  const { data: siblings } = await supabase
    .from('projects')
    .select('display_order')
    .eq('placement', values.placement)
    .order('display_order', { ascending: false })
    .limit(1)
  const nextOrder = siblings && siblings.length > 0 ? siblings[0].display_order + 1 : 0

  const { data: created, error } = await supabase
    .from('projects')
    .insert({ ...row, display_order: nextOrder })
    .select(SELECT_COLUMNS)
    .single()
  if (error) throw new Error(error.message)
  return toAdminProject(created as ProjectRow)
}

export async function deleteProjectById(id: string): Promise<void> {
  const supabase = await createClient()
  const existing = await fetchProjectById(id)
  if (existing?.screenshotUrl) await deleteScreenshot(supabase, existing.screenshotUrl)

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function moveProject(id: string, direction: 'up' | 'down'): Promise<void> {
  const supabase = await createClient()
  const current = await fetchProjectById(id)
  if (!current) return

  const { data: siblings, error } = await supabase
    .from('projects')
    .select('id, display_order')
    .eq('placement', current.placement)
    .order('display_order')
  if (error) throw new Error(error.message)

  const rows = siblings as { id: number; display_order: number }[]
  const index = rows.findIndex((r) => String(r.id) === id)
  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return

  const a = rows[index]
  const b = rows[swapIndex]

  await Promise.all([
    supabase.from('projects').update({ display_order: b.display_order }).eq('id', a.id),
    supabase.from('projects').update({ display_order: a.display_order }).eq('id', b.id),
  ])
}
