import "server-only"
import { getPayloadClient } from "./payload"

// ---- Shared types ---- //

export interface Article {
  id: number
  title: string
  slug: string
  author: string
  category: string
  tags: string[]
  excerpt: string
  coverImage: string | null
  publishedAt: string
  source: string
  sourceUrl: string | null
  seoTitle: string
  seoDescription: string
  canonicalUrl: string | null
  readingTime: number | null
  featured: boolean
  status: "draft" | "published"
  /** Lexical rich text JSON — rendered client side */
  content: any
  notionId?: string | null
}

function mapDoc(doc: any): Article {
  return {
    id: doc.id,
    title: doc.title ?? "",
    slug: doc.slug ?? String(doc.id),
    author: doc.author ?? "",
    category: doc.category ?? "",
    tags: (doc.tags ?? []).map((t: any) => t.tag ?? t),
    excerpt: doc.excerpt ?? "",
    coverImage: doc.coverImage ?? null,
    publishedAt: doc.publishedAt ?? doc.createdAt ?? "",
    source: doc.source ?? "",
    sourceUrl: doc.sourceUrl ?? null,
    seoTitle: doc.seo?.title ?? doc.title ?? "",
    seoDescription: doc.seo?.description ?? doc.excerpt ?? "",
    canonicalUrl: doc.seo?.canonicalUrl ?? null,
    readingTime: doc.readingTime ?? null,
    featured: doc.featured ?? false,
    status: doc.status ?? "draft",
    content: doc.content ?? null,
    notionId: doc.notionId ?? null,
  }
}

// ---- Public helpers ---- //

export async function getPublishedArticles(limit = 50): Promise<Article[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "articles",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit,
    })
    return result.docs.map(mapDoc)
  } catch (err) {
    console.error("[v0] getPublishedArticles error:", err)
    return []
  }
}

export async function getFeaturedArticles(limit = 4): Promise<Article[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "articles",
      where: {
        and: [
          { status: { equals: "published" } },
          { featured: { equals: true } },
        ],
      },
      sort: "-publishedAt",
      limit,
    })
    return result.docs.map(mapDoc)
  } catch (err) {
    console.error("[v0] getFeaturedArticles error:", err)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "articles",
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (result.docs.length === 0) return null
    return mapDoc(result.docs[0])
  } catch (err) {
    console.error("[v0] getArticleBySlug error:", err)
    return null
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const articles = await getPublishedArticles(200)
    return articles.map((a) => a.slug).filter(Boolean)
  } catch {
    return []
  }
}

// ---- Admin helpers ---- //

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: "articles",
      sort: "-updatedAt",
      limit: 200,
    })
    return result.docs.map(mapDoc)
  } catch (err) {
    console.error("[v0] getAllArticlesForAdmin error:", err)
    return []
  }
}

export async function getAdminArticleById(id: number | string): Promise<Article | null> {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findByID({
      collection: "articles",
      id: Number(id),
    })
    return mapDoc(doc)
  } catch (err) {
    console.error("[v0] getAdminArticleById error:", err)
    return null
  }
}

export interface ArticleInput {
  title: string
  slug?: string
  author?: string
  category?: string
  excerpt?: string
  coverImage?: string
  status?: string
  seoTitle?: string
  seoDescription?: string
  content?: any
  tags?: string[]
  featured?: boolean
  readingTime?: number | null
  publishedAt?: string | null
  source?: string
  sourceUrl?: string
  notionId?: string
}

function toPayloadShape(input: ArticleInput) {
  return {
    title: input.title,
    slug: input.slug ?? slugify(input.title),
    author: input.author ?? "",
    category: input.category ?? "",
    excerpt: input.excerpt ?? "",
    coverImage: input.coverImage ?? "",
    status: input.status === "Publicado" ? "published" : (input.status ?? "draft"),
    content: input.content ?? null,
    tags: (input.tags ?? []).map((tag) => ({ tag })),
    featured: input.featured ?? false,
    readingTime: input.readingTime ?? null,
    publishedAt: input.publishedAt ?? null,
    source: input.source ?? "",
    sourceUrl: input.sourceUrl ?? "",
    notionId: input.notionId ?? "",
    seo: {
      title: input.seoTitle ?? "",
      description: input.seoDescription ?? "",
    },
  }
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const payload = await getPayloadClient()
  const doc = await payload.create({
    collection: "articles",
    data: toPayloadShape(input),
  })
  return mapDoc(doc)
}

export async function updateArticle(id: number | string, input: ArticleInput): Promise<Article> {
  const payload = await getPayloadClient()
  const doc = await payload.update({
    collection: "articles",
    id: Number(id),
    data: toPayloadShape(input),
  })
  return mapDoc(doc)
}

export async function deleteArticle(id: number | string): Promise<void> {
  const payload = await getPayloadClient()
  await payload.delete({
    collection: "articles",
    id: Number(id),
  })
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
