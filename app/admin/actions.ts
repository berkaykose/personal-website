'use server'
import { redirect } from 'next/navigation'
import { createArticle, deleteArticleById, updateArticle } from '@/lib/admin/api'
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
