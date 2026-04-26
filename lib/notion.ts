import { Client } from "@notionhq/client"

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

const notion = process.env.NOTION_API_KEY
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null

const DATABASE_ID = process.env.NOTION_CMS_DB_ID || ""

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

export async function getPublishedArticles(limit?: number): Promise<NotionArticle[]> {
  if (!notion || !DATABASE_ID) return []

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [
        {
          property: "Fecha publicación Thinko",
          direction: "descending",
        },
      ],
      page_size: limit ?? 50,
    })

    return response.results.map(mapPageToArticle).filter((a) => a.title)
  } catch (error) {
    console.error("[v0] Error fetching Notion articles:", error)
    return []
  }
}

export async function getFeaturedArticles(limit = 4): Promise<NotionArticle[]> {
  if (!notion || !DATABASE_ID) return []

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: "Status", select: { equals: "Published" } },
          { property: "Destacado", checkbox: { equals: true } },
        ],
      },
      sorts: [
        {
          property: "Fecha publicación Thinko",
          direction: "descending",
        },
      ],
      page_size: limit,
    })

    return response.results.map(mapPageToArticle).filter((a) => a.title)
  } catch (error) {
    console.error("[v0] Error fetching featured articles:", error)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<NotionArticle | null> {
  if (!notion || !DATABASE_ID) return null

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: "Status", select: { equals: "Published" } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    })

    if (response.results.length === 0) return null
    return mapPageToArticle(response.results[0])
  } catch (error) {
    console.error("[v0] Error fetching article by slug:", error)
    return null
  }
}

export async function getArticleBlocks(pageId: string): Promise<any[]> {
  if (!notion) return []

  try {
    const blocks: any[] = []
    let cursor: string | undefined

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      })
      blocks.push(...response.results)
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
