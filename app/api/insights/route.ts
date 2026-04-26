import { NextResponse } from "next/server"
import { getPublishedArticles } from "@/lib/notion"

export const revalidate = 60

export async function GET() {
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
    category: a.category || "Editorial",
    author: a.author,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    featured: a.featured,
  }))

  return NextResponse.json(
    { articles: formatted, source: "notion" },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    },
  )
}
