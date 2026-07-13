import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { createArticle } from "@/lib/articles"
import { getArticleBySlug } from "@/lib/articles"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const AUTHOR_URL = "https://www.larazon.es/autores/alejandro-g-motta/"
const BASE_URL = "https://www.larazon.es"

interface ScrapedArticle {
  title: string
  url: string
  excerpt?: string
  image?: string
  date?: string
  category?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
}

function absoluteUrl(href: string): string {
  if (!href) return ""
  if (href.startsWith("http")) return href
  if (href.startsWith("//")) return `https:${href}`
  if (href.startsWith("/")) return `${BASE_URL}${href}`
  return `${BASE_URL}/${href}`
}

async function scrapeAuthorPage(pageUrl: string): Promise<ScrapedArticle[]> {
  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ThinkoBot/1.0; +https://www.thinkoconsulting.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`La Razón responded ${res.status} ${res.statusText}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)

  const articles: ScrapedArticle[] = []
  const seen = new Set<string>()

  // Strategy 1: Try structured data first (JSON-LD)
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}")
      const items = Array.isArray(json) ? json : json["@graph"] || [json]
      for (const item of items) {
        if (item["@type"] === "ItemList" && Array.isArray(item.itemListElement)) {
          for (const entry of item.itemListElement) {
            const it = entry.item || entry
            if (it.url && it.headline && !seen.has(it.url)) {
              seen.add(it.url)
              articles.push({
                title: it.headline,
                url: absoluteUrl(it.url),
                excerpt: it.description,
                image: it.image?.url || it.image,
                date: it.datePublished,
              })
            }
          }
        }
      }
    } catch {
      // ignore malformed JSON-LD
    }
  })

  // Strategy 2: Parse article cards from HTML (fallback / supplement)
  const articleSelectors = [
    "article",
    "[class*='article']",
    "[class*='card']",
    "[class*='news']",
    ".post",
  ]

  for (const selector of articleSelectors) {
    $(selector).each((_, el) => {
      const $el = $(el)
      const $link = $el.find("a[href*='/']").first()
      const href = $link.attr("href")
      if (!href) return

      const url = absoluteUrl(href)
      if (
        !url.includes("larazon.es") ||
        url === AUTHOR_URL ||
        url.includes("/autores/") ||
        url.includes("/tags/") ||
        url.includes("/secciones/") ||
        seen.has(url)
      ) {
        return
      }

      const title =
        $el.find("h1, h2, h3, h4").first().text().trim() ||
        $link.attr("title") ||
        $link.text().trim()

      if (!title || title.length < 10) return

      const image =
        $el.find("img").first().attr("src") ||
        $el.find("img").first().attr("data-src") ||
        $el.find("img").first().attr("data-lazy-src") ||
        $el.find("source").first().attr("srcset")?.split(" ")[0]

      const excerpt = $el.find("p").first().text().trim()
      const date =
        $el.find("time").first().attr("datetime") ||
        $el.find("[class*='date']").first().text().trim()

      seen.add(url)
      articles.push({
        title,
        url,
        excerpt: excerpt || undefined,
        image: image ? absoluteUrl(image) : undefined,
        date: date || undefined,
      })
    })
    if (articles.length > 0) break
  }

  return articles
}

async function authorize(request: Request): Promise<boolean> {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const auth = request.headers.get("authorization")
  const bearer = auth?.replace(/^Bearer\s+/i, "")
  return token === process.env.SYNC_SECRET || bearer === process.env.SYNC_SECRET
}

export async function GET(request: Request) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const dryRun = url.searchParams.get("dry") === "1"

  try {
    const scraped = await scrapeAuthorPage(AUTHOR_URL)

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        scraped: scraped.length,
        articles: scraped,
      })
    }

    const results: Array<{
      title: string
      url: string
      status: "created" | "skipped" | "error"
      error?: string
    }> = []

    for (const article of scraped) {
      try {
        // Generate slug from title
        const baseSlug = slugify(article.title)
        let slug = baseSlug
        
        // Check if article already exists
        const exists = await getArticleBySlug(slug)
        if (exists) {
          results.push({
            title: article.title,
            url: article.url,
            status: "skipped",
          })
          continue
        }

        let publishDate: Date | undefined
        if (article.date) {
          try {
            publishDate = new Date(article.date)
          } catch {}
        }

        // Create draft article in Neon
        await createArticle({
          title: article.title.slice(0, 200),
          slug,
          author: "Alejandro G. Motta",
          sourceName: "La Razón",
          sourceUrl: article.url,
          excerpt: article.excerpt,
          imageUrl: article.image,
          publishedAt: publishDate,
          isPublished: false, // Save as draft
        })

        results.push({
          title: article.title,
          url: article.url,
          status: "created",
        })
      } catch (err) {
        results.push({
          title: article.title,
          url: article.url,
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    return NextResponse.json({
      ok: true,
      scraped: scraped.length,
      created: results.filter((r) => r.status === "created").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
      details: results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
