import { XMLParser } from "fast-xml-parser"
import { NextResponse } from "next/server"

// La Razón RSS feed (configurable via env var)
const FEED_URL = process.env.LA_RAZON_FEED_URL || "https://www.razon.com.mx/feed/"
// Optional author filter (e.g. "Alejandro Motta"). If unset returns latest articles.
const AUTHOR_FILTER = process.env.LA_RAZON_AUTHOR || ""

export const revalidate = 3600 // 1 hour

interface RawItem {
  title: string
  link: string
  pubDate: string
  description?: string
  category?: string | string[]
  "dc:creator"?: string
}

interface Article {
  id: string
  title: string
  link: string
  date: string
  category: string
  author?: string
  excerpt?: string
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function formatDate(pubDate: string, locale = "es-MX"): string {
  try {
    return new Date(pubDate).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return pubDate
  }
}

export async function GET() {
  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ThinkoBot/1.0)",
      },
    })

    if (!response.ok) {
      console.error("[v0] RSS feed fetch failed:", response.status)
      return NextResponse.json({ articles: [], source: "fallback" })
    }

    const xml = await response.text()
    const parser = new XMLParser({
      ignoreAttributes: false,
      isArray: (name) => name === "item" || name === "category",
    })
    const data = parser.parse(xml)
    const items: RawItem[] = data?.rss?.channel?.item || []

    let filtered = items
    if (AUTHOR_FILTER) {
      filtered = items.filter((item) => {
        const creator = item["dc:creator"] || ""
        return creator.toLowerCase().includes(AUTHOR_FILTER.toLowerCase())
      })
    }

    const articles: Article[] = filtered.slice(0, 6).map((item, i) => {
      const cats = Array.isArray(item.category) ? item.category : [item.category]
      const category = (cats[0] || "Análisis").toString()

      return {
        id: `article-${i}`,
        title: stripHtml(item.title || ""),
        link: item.link || "#",
        date: formatDate(item.pubDate),
        category,
        author: item["dc:creator"],
        excerpt: item.description ? stripHtml(item.description).slice(0, 180) : undefined,
      }
    })

    return NextResponse.json({ articles, source: "la-razon" })
  } catch (error) {
    console.error("[v0] RSS parse error:", error)
    return NextResponse.json({ articles: [], source: "error" })
  }
}
