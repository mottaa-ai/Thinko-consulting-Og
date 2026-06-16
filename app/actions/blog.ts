"use server"

import { createArticle, updateArticle, deleteArticle, type ArticleInput } from "@/lib/articles"
import { revalidatePath } from "next/cache"
import { getSessionUser, canEditContent } from "@/lib/permissions"

async function requireUser() {
  const user = await getSessionUser()
  if (!user || !canEditContent(user.role)) throw new Error("Unauthorized")
  return user
}

export async function createArticleAction(
  input: ArticleInput,
): Promise<{ ok: boolean; id?: number; error?: string }> {
  try {
    await requireUser()
    const article = await createArticle(input)
    revalidatePath("/")
    revalidatePath("/blog")
    return { ok: true, id: article.id }
  } catch (e) {
    console.error("[v0] createArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear el artículo." }
  }
}

export async function updateArticleAction(
  id: number | string,
  input: ArticleInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireUser()
    const article = await updateArticle(id, input)
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath(`/blog/${article.slug}`)
    return { ok: true }
  } catch (e) {
    console.error("[v0] updateArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar el artículo." }
  }
}

export async function deleteArticleAction(
  id: number | string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireUser()
    await deleteArticle(id)
    revalidatePath("/")
    revalidatePath("/blog")
    return { ok: true }
  } catch (e) {
    console.error("[v0] deleteArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al eliminar el artículo." }
  }
}
