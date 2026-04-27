import { NextResponse } from "next/server"
import { getPublishedArticles } from "@/lib/notion"

export const revalidate = 60

export async function GET() {
  const hasApiKey = !!process.env.NOTION_API_KEY
  const hasDbId = !!process.env.NOTION_CMS_DB_ID

  if (!hasApiKey || !hasDbId) {
    return NextResponse.json(
      {
        articles: [],
        source: "notion",
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

  try {
    const articles = await getPublishedArticles(6)

    const formatted = articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      link: `/blog/${a.slug}`,
      date: a.publishedAt
        ? new Date(a.publishedAt).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : a.originalPublishedAt
          ? new Date(a.originalPublishedAt).toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
      rawDate: a.publishedAt || a.originalPublishedAt || null,
      category: a.category || "Editorial",
      author: a.author,
      excerpt: a.excerpt,
      readTime: a.readingTime,
      featured: a.featured,
      imageUrl: a.coverImage,
      coverImage: a.coverImage,
    }))

    return NextResponse.json(
      {
        articles: formatted,
        source: "notion",
        count: formatted.length,
        debug: {
          ok: true,
          count: formatted.length,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        articles: [],
        source: "notion",
        count: 0,
        debug: {
          ok: false,
          error: error?.message || String(error),
        },
      },
      { status: 200 },
    )
  }
}
