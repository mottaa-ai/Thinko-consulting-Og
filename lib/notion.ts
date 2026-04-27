export interface NotionArticle {
  id: string
  title: string
  slug: string
  author: string
  category: string
  tags: string[]
  excerpt: string
  coverImage: string | null
  publishedAt: string
  originalPublishedAt: string | null
  source: string
  sourceUrl: string | null
  canonicalUrl: string | null
  seoTitle: string
  seoDescription: string
  readingTime: number | null
  featured: boolean
}

export interface NotionBlock {
  id: string
  type: string
  content: any
  children?: NotionBlock[]
}

const NOTION_API_KEY = process.env.NOTION_API_KEY || ""
const DATABASE_ID = process.env.NOTION_CMS_DB_ID || ""
const NOTION_VERSION = "2022-06-28"
const NOTION_BASE = "https://api.notion.com/v1"

async function notionFetch(path: string, init?: RequestInit): Promise<any> {
  if (!NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is not set")
  }

  const res = await fetch(`${NOTION_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text()
    let parsed: any = null
    try {
      parsed = JSON.parse(text)
    } catch {}
    const message = parsed?.message || text || `HTTP ${res.status}`
    throw new Error(`Notion API ${res.status}: ${message}`)
  }

  return res.json()
}

async function queryDatabase(body: Record<string, any>): Promise<any> {
  return notionFetch(`/databases/${DATABASE_ID}/query`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function retrieveDatabase(): Promise<any> {
  return notionFetch(`/databases/${DATABASE_ID}`)
}

export async function retrievePage(pageId: string): Promise<any> {
  return notionFetch(`/pages/${pageId}`)
}

export async function retrieveBotUser(): Promise<any> {
  return notionFetch(`/users/me`)
}

export async function searchAccessible(): Promise<any> {
  return notionFetch(`/search`, {
    method: "POST",
    body: JSON.stringify({ page_size: 20 }),
  })
}

function getPlainText(richText: any[] | undefined): string {
  if (!richText || !Array.isArray(richText)) return ""
  return richText.map((rt) => rt.plain_text || "").join("")
}

function getSelect(prop: any): string {
  return prop?.select?.name || ""
}

function getMultiSelect(prop: any): string[] {
  if (!prop?.multi_select) return []
  return prop.multi_select.map((s: any) => s.name)
}

function getStatusName(prop: any): string {
  return prop?.status?.name || prop?.select?.name || ""
}

function getDate(prop: any): string | null {
  return prop?.date?.start || null
}

function getUrl(prop: any): string | null {
  return prop?.url || null
}

function getCheckbox(prop: any): boolean {
  return prop?.checkbox || false
}

function getNumber(prop: any): number | null {
  return prop?.number ?? null
}

function getTitle(prop: any): string {
  return getPlainText(prop?.title)
}

function getRichText(prop: any): string {
  return getPlainText(prop?.rich_text)
}

function mapPageToArticle(page: any): NotionArticle {
  const props = page.properties || {}

  return {
    id: page.id,
    title: getTitle(props["Name"]),
    slug: getRichText(props["Slug"]) || page.id,
    author: getRichText(props["Autor"]),
    category: getSelect(props["Categoría"]),
    tags: getMultiSelect(props["Tags"]),
    excerpt: getRichText(props["Extracto"]),
    coverImage: getUrl(props["Imagen destacada"]),
    publishedAt: getDate(props["Fecha publicación Thinko"]) || "",
    originalPublishedAt: getDate(props["Fecha publicación original"]),
    source: getSelect(props["Fuente"]),
    sourceUrl: getUrl(props["URL fuente"]),
    canonicalUrl: getUrl(props["Canonical URL"]),
    seoTitle: getRichText(props["SEO Title"]) || getTitle(props["Name"]),
    seoDescription: getRichText(props["SEO Description"]) || getRichText(props["Extracto"]),
    readingTime: getNumber(props["Tiempo de lectura (min)"]),
    featured: getCheckbox(props["Destacado"]),
  }
}

/**
 * Builds a Status filter that works whether the property is of type "status" or "select",
 * and whether the published value is "Publicado" (Spanish) or "Published" (English).
 * Strategy: try select+Publicado, then status+Publicado, then select+Published, then status+Published.
 */
const PUBLISHED_VALUES = ["Publicado", "Published"]
const STATUS_TYPES: Array<"select" | "status"> = ["select", "status"]

async function queryWithStatusFilter(
  baseFilter: any | null,
  sorts?: any[],
  pageSize = 50,
): Promise<any> {
  const buildBody = (statusFilterType: "status" | "select", value: string) => {
    const statusClause = {
      property: "Status",
      [statusFilterType]: { equals: value },
    }
    let filter: any
    if (baseFilter && baseFilter.and) {
      filter = { and: [statusClause, ...baseFilter.and] }
    } else if (baseFilter) {
      filter = { and: [statusClause, baseFilter] }
    } else {
      filter = statusClause
    }
    return {
      filter,
      ...(sorts ? { sorts } : {}),
      page_size: pageSize,
    }
  }

  let lastError: any = null
  for (const value of PUBLISHED_VALUES) {
    for (const type of STATUS_TYPES) {
      try {
        const response = await queryDatabase(buildBody(type, value))
        if (response.results && response.results.length > 0) {
          return response
        }
        // Empty result is still valid; remember it but keep trying other combos
        lastError = null
        if (!lastError) lastError = { _emptyResponse: response }
      } catch (err: any) {
        lastError = err
        // Try next combination
      }
    }
  }

  // If we got an empty response from a valid query, return it
  if (lastError && lastError._emptyResponse) {
    return lastError._emptyResponse
  }
  throw lastError || new Error("All Status filter combinations failed")
}

export async function getPublishedArticles(limit?: number): Promise<NotionArticle[]> {
  if (!NOTION_API_KEY || !DATABASE_ID) return []

  try {
    const response = await queryWithStatusFilter(
      null,
      [{ property: "Fecha publicación Thinko", direction: "descending" }],
      limit ?? 50,
    )

    return (response.results || []).map(mapPageToArticle).filter((a: NotionArticle) => a.title)
  } catch (error) {
    console.error("[v0] Error fetching Notion articles:", error)
    return []
  }
}

export async function getFeaturedArticles(limit = 4): Promise<NotionArticle[]> {
  if (!NOTION_API_KEY || !DATABASE_ID) return []

  try {
    const response = await queryWithStatusFilter(
      { and: [{ property: "Destacado", checkbox: { equals: true } }] },
      [{ property: "Fecha publicación Thinko", direction: "descending" }],
      limit,
    )

    return (response.results || []).map(mapPageToArticle).filter((a: NotionArticle) => a.title)
  } catch (error) {
    console.error("[v0] Error fetching featured articles:", error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<NotionArticle | null> {
  if (!NOTION_API_KEY || !DATABASE_ID) return null

  try {
    const response = await queryWithStatusFilter(
      { and: [{ property: "Slug", rich_text: { equals: slug } }] },
      undefined,
      1,
    )

    if (!response.results || response.results.length === 0) return null
    return mapPageToArticle(response.results[0])
  } catch (error) {
    console.error("[v0] Error fetching article by slug:", error)
    return null
  }
}

export async function getArticleBlocks(pageId: string): Promise<any[]> {
  if (!NOTION_API_KEY) return []

  try {
    const blocks: any[] = []
    let cursor: string | undefined

    do {
      const url = `/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`
      const response = await notionFetch(url)
      blocks.push(...(response.results || []))
      cursor = response.has_more ? response.next_cursor || undefined : undefined
    } while (cursor)

    return blocks
  } catch (error) {
    console.error("[v0] Error fetching article blocks:", error)
    return []
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const articles = await getPublishedArticles(100)
  return articles.map((a) => a.slug).filter(Boolean)
}

/**
 * Creates a draft article in Notion. Used by the La Razón scraper.
 */
export async function createDraftArticle(input: {
  title: string
  slug: string
  author?: string
  source?: string
  sourceUrl?: string
  canonicalUrl?: string
  excerpt?: string
  coverImage?: string
  originalPublishedAt?: string
}): Promise<any> {
  if (!NOTION_API_KEY || !DATABASE_ID) {
    throw new Error("NOTION_API_KEY or NOTION_CMS_DB_ID not set")
  }

  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: input.title } }] },
    Slug: { rich_text: [{ text: { content: input.slug } }] },
    Status: { status: { name: "Draft" } },
  }

  if (input.author) properties["Autor"] = { rich_text: [{ text: { content: input.author } }] }
  if (input.source) properties["Fuente"] = { select: { name: input.source } }
  if (input.sourceUrl) properties["URL fuente"] = { url: input.sourceUrl }
  if (input.canonicalUrl) properties["Canonical URL"] = { url: input.canonicalUrl }
  if (input.excerpt) properties["Extracto"] = { rich_text: [{ text: { content: input.excerpt.slice(0, 2000) } }] }
  if (input.coverImage) properties["Imagen destacada"] = { url: input.coverImage }
  if (input.originalPublishedAt) properties["Fecha publicación original"] = { date: { start: input.originalPublishedAt } }

  try {
    return await notionFetch(`/pages`, {
      method: "POST",
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties,
      }),
    })
  } catch (err: any) {
    // Fallback: Status as select if not configured as status
    const msg = String(err?.message || "")
    if (msg.includes("status")) {
      properties.Status = { select: { name: "Draft" } }
      return await notionFetch(`/pages`, {
        method: "POST",
        body: JSON.stringify({
          parent: { database_id: DATABASE_ID },
          properties,
        }),
      })
    }
    throw err
  }
}

export async function findArticleBySourceUrl(sourceUrl: string): Promise<any | null> {
  if (!NOTION_API_KEY || !DATABASE_ID) return null
  try {
    const response = await queryDatabase({
      filter: { property: "URL fuente", url: { equals: sourceUrl } },
      page_size: 1,
    })
    return response.results?.[0] || null
  } catch {
    return null
  }
}
