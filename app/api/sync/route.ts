import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

/**
 * Webhook endpoint para revalidar el contenido del blog
 * cuando se actualiza la base de datos de Notion.
 *
 * Uso desde Notion (vía Zapier, Make, o automatización):
 *   POST /api/sync
 *   Headers: { "Authorization": "Bearer <SYNC_SECRET>" }
 *   Body: { "slug"?: "mi-articulo" }
 *
 * Si se incluye un slug, revalida solo esa página.
 * Si no, revalida toda la sección /blog.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.replace(/^Bearer\s+/i, "").trim()
  const expected = process.env.SYNC_SECRET

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let slug: string | undefined
  try {
    const body = await request.json().catch(() => ({}))
    slug = body?.slug
  } catch {
    slug = undefined
  }

  try {
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath("/api/insights")

    if (slug) {
      revalidatePath(`/blog/${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: slug ? ["/", "/blog", `/blog/${slug}`, "/api/insights"] : ["/", "/blog", "/api/insights"],
    })
  } catch (error) {
    console.error("[v0] Sync error:", error)
    return NextResponse.json(
      { error: "Revalidation failed", details: String(error) },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const expected = process.env.SYNC_SECRET

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const slug = url.searchParams.get("slug") || undefined

  try {
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath("/api/insights")
    if (slug) revalidatePath(`/blog/${slug}`)

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Revalidation failed", details: String(error) },
      { status: 500 },
    )
  }
}
