import { NextResponse } from "next/server"
import { getArticleBySlug } from "@/lib/articles"

export const revalidate = 60

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
        { article: null, debug: { ok: true, found: false, slug } },
        { status: 404 },
      )
    }

    const payload = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      tags: article.tags,
      featured: article.featured,
      readTime: article.readingTime,
      imageUrl: article.coverImage,
      coverImage: article.coverImage,
      content: article.content,
      date: article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "",
      rawDate: article.publishedAt ?? null,
      publishedAt: article.publishedAt,
      source: article.source,
      sourceUrl: article.sourceUrl,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
    }

    return NextResponse.json(
      { article: payload, debug: { ok: true } },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      },
    )
  } catch (error: any) {
    return NextResponse.json(
      { article: null, debug: { ok: false, error: error?.message || String(error) } },
      { status: 200 },
    )
  }
}
