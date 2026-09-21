'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { deleteProject, saveProject } from '@/app/admin/actions'
import type {
  AdminProject,
  ProjectCategory,
  ProjectFormValues,
  ProjectPlacement,
  ProjectStatus,
} from '@/lib/admin/projects'

interface Props {
  mode: 'create' | 'edit'
  project?: AdminProject
}

type LocaleTab = 'en' | 'tr'

const LOCALES: { value: LocaleTab; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
]

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'planned', label: 'Planned' },
]

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
]

const PLACEMENTS: { value: ProjectPlacement; label: string }[] = [
  { value: 'showcase', label: 'Showcase' },
  { value: 'archive', label: 'Archive' },
]

const inputClass =
  'w-full px-4 py-3 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'
const labelClass = 'block font-mono text-xs tracking-widest uppercase text-muted mb-2'

export default function ProjectEditor({ mode, project }: Props) {
  const [activeLocale, setActiveLocale] = useState<LocaleTab>('en')

  const [titleEn, setTitleEn] = useState(project?.title.en ?? '')
  const [titleTr, setTitleTr] = useState(project?.title.tr ?? '')
  const [descriptionEn, setDescriptionEn] = useState(project?.description.en ?? '')
  const [descriptionTr, setDescriptionTr] = useState(project?.description.tr ?? '')
  const [oneLinerEn, setOneLinerEn] = useState(project?.oneLiner.en ?? '')
  const [oneLinerTr, setOneLinerTr] = useState(project?.oneLiner.tr ?? '')

  const [tagsInput, setTagsInput] = useState(project?.tags.join(', ') ?? '')
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? '')
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? '')
  const [year, setYear] = useState(project?.year ?? new Date().getFullYear())
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'completed')
  const [category, setCategory] = useState<ProjectCategory>(project?.category ?? 'frontend')
  const [placement, setPlacement] = useState<ProjectPlacement>(project?.placement ?? 'showcase')

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.screenshotUrl ?? null)
  const [screenshotAction, setScreenshotAction] = useState<'keep' | 'replace' | 'remove'>('keep')
  const [screenshotDimensions, setScreenshotDimensions] = useState<{
    width: number
    height: number
  } | null>(
    project?.screenshotWidth && project?.screenshotHeight
      ? { width: project.screenshotWidth, height: project.screenshotHeight }
      : null
  )

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Blob URL'lerini bellek sızıntısı olmaması için component unmount/değişiminde serbest bırak.
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)

    setScreenshotFile(file)
    setScreenshotAction('replace')
    setPreviewUrl(objectUrl)

    // object-fit ile değil, gerçek en/boy oranıyla bozulmadan göstermek için
    // dosyanın doğal piksel boyutunu tarayıcıda okuyoruz (bkz. lib/admin/projects.ts).
    const img = new window.Image()
    img.onload = () => {
      setScreenshotDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.src = objectUrl
  }

  function handleRemoveScreenshot() {
    setScreenshotFile(null)
    setScreenshotAction('remove')
    setPreviewUrl(null)
    setScreenshotDimensions(null)
  }

  async function handleSave() {
    setIsSaving(true)
    setError(null)

    const values: ProjectFormValues = {
      titleEn,
      titleTr,
      descriptionEn,
      descriptionTr,
      oneLinerEn,
      oneLinerTr,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      githubUrl,
      liveUrl,
      year,
      status,
      category,
      placement,
    }

    // Başarılıysa saveProject içeride redirect() ile sayfadan çıkar (bu satıra
    // hiç dönülmez); sadece hata durumunda normal şekilde geri döner.
    const result = await saveProject(
      project?.id ?? null,
      values,
      screenshotAction,
      screenshotFile,
      screenshotDimensions
    )
    if (result?.error) {
      setError(result.error)
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!project) return
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setIsDeleting(true)
    await deleteProject(project.id)
  }

  const canSave = titleEn.trim() && titleTr.trim() && descriptionEn.trim() && descriptionTr.trim()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">
          {mode === 'create' ? 'New Project' : 'Edit Project'}
        </h1>
        <div className="flex items-center gap-4">
          {mode === 'edit' && project && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="text-sm text-muted hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button
            type="button"
            disabled={isSaving || !canSave}
            onClick={handleSave}
            className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 -mt-4 mb-8">{error}</p>}

      <div className="mb-10">
        <label className={labelClass}>Screenshot</label>
        <div className="flex items-start gap-6">
          <div className="relative w-64 aspect-video rounded-md overflow-hidden bg-accent-light border border-border shrink-0">
            {previewUrl ? (
              <Image src={previewUrl} alt="Screenshot preview" fill unoptimized className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                No screenshot
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-muted file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-accent file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:opacity-90 cursor-pointer"
            />
            <p className="text-xs text-muted max-w-xs">
              Preview shows immediately — the file only uploads when you hit Save.
            </p>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="text-xs text-muted hover:text-red-600 transition-colors self-start"
              >
                Remove screenshot
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border">
        {LOCALES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveLocale(value)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeLocale === value ? 'text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            {label}
            {activeLocale === value && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6 mb-12">
        {activeLocale === 'en' ? (
          <>
            <div>
              <label className={labelClass}>Title (EN)</label>
              <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description (EN)</label>
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>One-liner (EN) — shown on the homepage card</label>
              <input
                value={oneLinerEn}
                onChange={(e) => setOneLinerEn(e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={labelClass}>Başlık (TR)</label>
              <input value={titleTr} onChange={(e) => setTitleTr(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Açıklama (TR)</label>
              <textarea
                value={descriptionTr}
                onChange={(e) => setDescriptionTr(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Tek cümlelik özet (TR) — anasayfa kartında görünür</label>
              <input
                value={oneLinerTr}
                onChange={(e) => setOneLinerTr(e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Next.js, TypeScript, Supabase"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Live URL</label>
          <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className={inputClass}
          >
            {STATUSES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory)}
            className={inputClass}
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Placement</label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value as ProjectPlacement)}
            className={inputClass}
          >
            {PLACEMENTS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
