"use server"

import { createArticle, updateArticle } from "@/lib/articles"
import { revalidatePath } from "next/cache"
import { getSessionUser, canEditContent } from "@/lib/permissions"

async function requireUser() {
  const user = await getSessionUser()
  if (!user || !canEditContent(user.role)) throw new Error("Unauthorized")
  return user
}

interface ArticleInput {
  slug: string
  title: string
  excerpt?: string
  content?: string
  author?: string
  category?: string
  imageUrl?: string
  sourceUrl?: string
  sourceName?: string
  publishedAt?: Date
  isPublished?: boolean
}

export async function createArticleAction(input: ArticleInput): Promise<{ ok: boolean; id?: number; error?: string }> {
  try {
    await requireUser()
    const article = await createArticle(input)
    revalidatePath("/")
    revalidatePath("/blog")
    return { ok: true, id: article?.id }
  } catch (e) {
    console.error("[v0] createArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear el artículo." }
  }
}

export async function updateArticleAction(
  articleId: number,
  input: Partial<ArticleInput>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireUser()
    await updateArticle(articleId, input)
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath(`/blog/${input.slug}`)
    return { ok: true }
  } catch (e) {
    console.error("[v0] updateArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar el artículo." }
  }
}
