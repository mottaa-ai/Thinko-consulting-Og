import { NextResponse } from "next/server"
import { getArticleBySlug, getArticleBlocks } from "@/lib/notion"

export const revalidate = 60

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const hasApiKey = !!process.env.NOTION_API_KEY
  const hasDbId = !!process.env.NOTION_CMS_DB_ID

  if (!hasApiKey || !hasDbId) {
    return NextResponse.json(
      {
        article: null,
        debug: {
          ok: false,
          error: "Missing environment variables",
          NOTION_API_KEY: hasApiKey,
          NOTION_CMS_DB_ID: hasDbId,
        },
      },
      { status: 200 },
    )
  }

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

    const blocks = await getArticleBlocks(article.id)

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
      date: article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : article.originalPublishedAt
          ? new Date(article.originalPublishedAt).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "",
      rawDate: article.publishedAt || article.originalPublishedAt || null,
      publishedAt: article.publishedAt,
      originalPublishedAt: article.originalPublishedAt,
      source: article.source,
      sourceUrl: article.sourceUrl,
      canonicalUrl: article.canonicalUrl,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      blocks,
    }

    return NextResponse.json(
      { article: payload, debug: { ok: true, blockCount: blocks.length } },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
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
