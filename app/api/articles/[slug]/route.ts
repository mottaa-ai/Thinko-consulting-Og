import { NextResponse } from "next/server"
import { getArticleBySlug } from "@/lib/articles"

export const revalidate = 3600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json({ article: null, error: "Missing slug" }, { status: 400 })
  }

  try {
    const article = await getArticleBySlug(slug)

    if (!article) {
      return NextResponse.json(
        {
          article: null,
          debug: { ok: true, found: false, slug },
        },
        { status: 404 },
      )
    }

    const payload = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      category: article.category,
      imageUrl: article.imageUrl,
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
      date: article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "",
      rawDate: article.publishedAt,
      publishedAt: article.publishedAt,
      isPublished: article.isPublished,
    }

    return NextResponse.json(
      { article: payload, debug: { ok: true } },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        article: null,
        debug: {
          ok: false,
          error: error?.message || String(error),
        },
      },
      { status: 200 },
    )
  }
}
