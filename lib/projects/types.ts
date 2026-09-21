export type ProjectStatus = 'completed' | 'in-progress' | 'planned'
export type ProjectCategory = 'frontend' | 'backend'

export interface PublicProject {
  id: string
  title: string
  description: string
  oneLiner: string
  tags: string[]
  githubUrl: string | null
  liveUrl: string | null
  screenshotUrl: string | null
  screenshotWidth: number | null
  screenshotHeight: number | null
  year: number
  status: ProjectStatus
  category: ProjectCategory
}
