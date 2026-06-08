"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createArticle, updateArticle, type ArticleInput } from "@/lib/notion"
import { revalidatePath } from "next/cache"

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export async function createArticleAction(input: ArticleInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    await requireUser()
    const page = await createArticle(input)
    revalidatePath("/")
    revalidatePath("/blog")
    return { ok: true, id: page?.id }
  } catch (e) {
    console.log("[v0] createArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al crear el artículo." }
  }
}

export async function updateArticleAction(
  pageId: string,
  input: ArticleInput,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireUser()
    await updateArticle(pageId, input)
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath(`/blog/${pageId}`)
    return { ok: true }
  } catch (e) {
    console.log("[v0] updateArticleAction error:", e)
    return { ok: false, error: e instanceof Error ? e.message : "Error al actualizar el artículo." }
  }
}
