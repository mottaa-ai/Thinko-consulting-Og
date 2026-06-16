import { NextResponse } from "next/server"
import { getPublishedArticles } from "@/lib/articles"

export const revalidate = 60

export async function GET() {
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
        : "",
      rawDate: a.publishedAt ?? null,
      category: a.category || "Editorial",
      author: a.author,
      excerpt: a.excerpt,
      readTime: a.readingTime,
      featured: a.featured,
      imageUrl: a.coverImage,
      coverImage: a.coverImage,
    }))

    return NextResponse.json(
      { articles: formatted, source: "payload", count: formatted.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
        },
      },
    )
  } catch (error: any) {
    return NextResponse.json(
      { articles: [], source: "payload", count: 0, error: error?.message || String(error) },
      { status: 200 },
    )
  }
}
