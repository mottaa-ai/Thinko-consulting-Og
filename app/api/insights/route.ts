import { NextResponse } from "next/server"
import { getFeaturedArticles } from "@/lib/articles"

export const revalidate = 3600

export async function GET() {
  try {
    const articles = await getFeaturedArticles(6)

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
        : "",
      rawDate: a.publishedAt || null,
      category: a.category || "Editorial",
      author: a.author,
      excerpt: a.excerpt,
      imageUrl: a.imageUrl,
      sourceName: a.sourceName,
    }))

    return NextResponse.json(
      {
        articles: formatted,
        source: "neon",
        count: formatted.length,
        debug: {
          ok: true,
          count: formatted.length,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        articles: [],
        source: "neon",
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
