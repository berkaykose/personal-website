'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createArticle, deleteArticleById, updateArticle } from '@/lib/admin/api'
import {
  deleteProjectById,
  moveProject as moveProjectRow,
  saveProject as saveProjectRow,
  type ProjectFormValues,
} from '@/lib/admin/projects'
import { createClient } from '@/lib/supabase/server'
import type { ArticleCategory, ArticleTranslation, Locale } from '@/lib/admin/types'

const LOCALES: Locale[] = ['en', 'tr']

export async function saveArticle(
  id: string | null,
  category: ArticleCategory,
  translations: Partial<Record<Locale, ArticleTranslation>>
): Promise<{ error?: string } | undefined> {
  let currentId = id
  try {
    for (const locale of LOCALES) {
      const translation = translations[locale]
      if (!translation) continue

      if (currentId) {
        await updateArticle(currentId, translation, category)
      } else {
        const created = await createArticle(translation, category)
        currentId = created.id
      }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Could not save the article. Please try again.',
    }
  }

  redirect('/admin/articles')
}

export async function deleteArticle(id: string) {
  await deleteArticleById(id)
  redirect('/admin/articles')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function saveProject(
  id: string | null,
  values: ProjectFormValues,
  screenshotAction: 'keep' | 'replace' | 'remove',
  screenshotFile: File | null,
  screenshotDimensions: { width: number; height: number } | null
): Promise<{ error?: string } | undefined> {
  try {
    await saveProjectRow(id, values, screenshotAction, screenshotFile, screenshotDimensions)
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Could not save the project. Please try again.',
    }
  }

  redirect('/admin/projects')
}

export async function deleteProject(id: string) {
  await deleteProjectById(id)
  redirect('/admin/projects')
}

export async function moveProject(id: string, direction: 'up' | 'down') {
  await moveProjectRow(id, direction)
  revalidatePath('/admin/projects')
}
