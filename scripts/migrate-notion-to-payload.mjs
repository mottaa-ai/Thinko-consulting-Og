/**
 * Migration script: Notion CMS → Payload CMS
 *
 * Usage (from project root):
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/migrate-notion-to-payload.mjs
 *
 * What it does:
 * 1. Fetches all articles (including drafts) from Notion
 * 2. Fetches block content for each article
 * 3. Converts Notion blocks → Lexical JSON
 * 4. Inserts articles into Payload via REST API
 *
 * Safe to run multiple times — uses notionId to avoid duplicates.
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY
const DATABASE_ID = process.env.NOTION_CMS_DB_ID
const NOTION_VERSION = "2022-06-28"
const NOTION_BASE = "https://api.notion.com/v1"
const PAYLOAD_BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || "thinko-consulting-secret-change-in-production-2024"

if (!NOTION_API_KEY || !DATABASE_ID) {
  console.error("[migrate] ERROR: NOTION_API_KEY and NOTION_CMS_DB_ID must be set")
  process.exit(1)
}

// ---- Notion helpers ----

async function notionFetch(path, init = {}) {
  const res = await fetch(`${NOTION_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Notion ${res.status}: ${text}`)
  }
  return res.json()
}

function getText(arr) {
  if (!arr || !Array.isArray(arr)) return ""
  return arr.map((t) => t.plain_text || "").join("")
}

function mapPage(page) {
  const p = page.properties || {}
  const getSelect = (f) => p[f]?.select?.name || ""
  const getMulti = (f) => (p[f]?.multi_select || []).map((s) => s.name)
  const getDate = (f) => p[f]?.date?.start || null
  const getUrl = (f) => p[f]?.url || null
  const getFile = (f) => {
    const files = p[f]?.files || []
    if (!files.length) return null
    const file = files[0]
    return file.type === "external" ? file.external?.url : file.file?.url
  }
  const getRich = (f) => getText(p[f]?.rich_text)
  const getTitle = (f) => getText(p[f]?.title)
  const getStatus = (f) => p[f]?.status?.name || p[f]?.select?.name || "Draft"
  const getCheck = (f) => p[f]?.checkbox || false
  const getNum = (f) => p[f]?.number ?? null

  const status = getStatus("Status")
  const isPublished = status === "Publicado" || status === "Published"

  return {
    notionId: page.id,
    title: getTitle("Name"),
    slug: getRich("Slug") || page.id,
    author: getRich("Autor"),
    category: getSelect("Categoría"),
    tags: getMulti("Tags"),
    excerpt: getRich("Extracto"),
    coverImage: getFile("Imagen destacada") || getUrl("Imagen destacada"),
    publishedAt: getDate("Fecha publicación Thinko"),
    source: getSelect("Fuente"),
    sourceUrl: getUrl("URL fuente"),
    seoTitle: getRich("SEO Title") || getTitle("Name"),
    seoDescription: getRich("SEO Description") || getRich("Extracto"),
    readingTime: getNum("Tiempo de lectura (min)"),
    featured: getCheck("Destacado"),
    status: isPublished ? "published" : "draft",
  }
}

async function getAllNotionArticles() {
  const articles = []
  let cursor
  do {
    const body = {
      sorts: [{ property: "Fecha publicación Thinko", direction: "descending" }],
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    }
    const res = await notionFetch(`/databases/${DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    articles.push(...(res.results || []).map(mapPage).filter((a) => a.title))
    cursor = res.has_more ? res.next_cursor : null
  } while (cursor)
  return articles
}

async function getNotionBlocks(pageId) {
  const blocks = []
  let cursor
  do {
    const url = `/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`
    const res = await notionFetch(url)
    blocks.push(...(res.results || []))
    cursor = res.has_more ? res.next_cursor : null
  } while (cursor)
  return blocks
}

// ---- Notion blocks → Lexical ----

function richTextToLexical(richText = []) {
  return richText.map((rt) => {
    const a = rt.annotations || {}
    let format = 0
    if (a.bold) format |= 1
    if (a.italic) format |= 2
    if (a.strikethrough) format |= 4
    if (a.underline) format |= 8
    if (a.code) format |= 16

    const node = {
      type: "text",
      text: rt.plain_text || "",
      format,
      detail: 0,
      mode: "normal",
      style: "",
      version: 1,
    }

    if (rt.href) {
      return {
        type: "link",
        children: [node],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
        fields: { url: rt.href, newTab: rt.href.startsWith("http") },
      }
    }

    return node
  })
}

function notionBlocksToLexical(blocks) {
  const children = []
  for (const block of blocks) {
    const type = block.type
    const data = block[type]
    if (!data) continue

    switch (type) {
      case "paragraph": {
        const inline = richTextToLexical(data.rich_text)
        children.push({
          type: "paragraph",
          children: inline.length ? inline : [{ type: "text", text: "", format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
          direction: "ltr",
          format: "",
          indent: 0,
          textFormat: 0,
          version: 1,
        })
        break
      }
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const levelMap = { heading_1: "h2", heading_2: "h3", heading_3: "h4" }
        children.push({
          type: "heading",
          tag: levelMap[type],
          children: richTextToLexical(data.rich_text),
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        })
        break
      }
      case "bulleted_list_item": {
        // Collect consecutive items into a list
        const last = children[children.length - 1]
        const item = {
          type: "listitem",
          children: richTextToLexical(data.rich_text),
          direction: "ltr",
          format: "",
          indent: 0,
          value: 1,
          checked: undefined,
          version: 1,
        }
        if (last?.type === "list" && last.listType === "bullet") {
          item.value = last.children.length + 1
          last.children.push(item)
        } else {
          children.push({
            type: "list",
            listType: "bullet",
            children: [item],
            direction: "ltr",
            format: "",
            indent: 0,
            start: 1,
            tag: "ul",
            version: 1,
          })
        }
        break
      }
      case "numbered_list_item": {
        const last = children[children.length - 1]
        const item = {
          type: "listitem",
          children: richTextToLexical(data.rich_text),
          direction: "ltr",
          format: "",
          indent: 0,
          value: 1,
          checked: undefined,
          version: 1,
        }
        if (last?.type === "list" && last.listType === "number") {
          item.value = last.children.length + 1
          last.children.push(item)
        } else {
          children.push({
            type: "list",
            listType: "number",
            children: [item],
            direction: "ltr",
            format: "",
            indent: 0,
            start: 1,
            tag: "ol",
            version: 1,
          })
        }
        break
      }
      case "quote":
        children.push({
          type: "quote",
          children: richTextToLexical(data.rich_text),
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
        })
        break
      case "divider":
        children.push({ type: "horizontalrule", version: 1 })
        break
      case "code":
        children.push({
          type: "code",
          code: data.rich_text?.map((t) => t.plain_text).join("") || "",
          language: data.language || "plaintext",
          version: 1,
        })
        break
      default:
        // Skip unsupported types (images, embeds, etc. — can be added later)
        break
    }
  }

  return {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  }
}

// ---- Payload REST helpers ----

async function getPayloadToken() {
  // Use the Payload REST API to log in with a superadmin account
  // For migration we use the secret directly as an API key header
  return null // We'll use the local API approach instead
}

async function payloadCreateArticle(data) {
  const res = await fetch(`${PAYLOAD_BASE}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Payload API ${res.status}: ${text}`)
  }

  return res.json()
}

async function payloadFindByNotionId(notionId) {
  const res = await fetch(
    `${PAYLOAD_BASE}/api/articles?where[notionId][equals]=${encodeURIComponent(notionId)}&limit=1`,
    { headers: { "Content-Type": "application/json" } },
  )
  if (!res.ok) return null
  const json = await res.json()
  return json.docs?.[0] ?? null
}

// ---- Main ----

async function main() {
  console.log("[migrate] Starting Notion → Payload migration")
  console.log(`[migrate] Notion DB: ${DATABASE_ID}`)
  console.log(`[migrate] Payload base URL: ${PAYLOAD_BASE}`)

  // 1. Fetch all Notion articles
  console.log("[migrate] Fetching articles from Notion...")
  const notionArticles = await getAllNotionArticles()
  console.log(`[migrate] Found ${notionArticles.length} articles in Notion`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const article of notionArticles) {
    try {
      // Check if already migrated
      const existing = await payloadFindByNotionId(article.notionId)
      if (existing) {
        console.log(`[migrate] SKIP (exists): ${article.title}`)
        skipped++
        continue
      }

      // Fetch blocks
      const blocks = await getNotionBlocks(article.notionId)
      const content = notionBlocksToLexical(blocks)

      const payload = {
        title: article.title,
        slug: article.slug,
        author: article.author || "",
        category: article.category || "",
        tags: (article.tags || []).map((tag) => ({ tag })),
        excerpt: article.excerpt || "",
        coverImage: article.coverImage || "",
        status: article.status,
        publishedAt: article.publishedAt || null,
        source: article.source || "",
        sourceUrl: article.sourceUrl || null,
        readingTime: article.readingTime || null,
        featured: article.featured || false,
        content,
        notionId: article.notionId,
        seo: {
          title: article.seoTitle || "",
          description: article.seoDescription || "",
        },
      }

      await payloadCreateArticle(payload)
      console.log(`[migrate] CREATED: ${article.title}`)
      created++

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 300))
    } catch (err) {
      console.error(`[migrate] ERROR: ${article.title} — ${err.message}`)
      errors++
    }
  }

  console.log(`\n[migrate] Done!`)
  console.log(`  Created : ${created}`)
  console.log(`  Skipped : ${skipped}`)
  console.log(`  Errors  : ${errors}`)
}

main().catch((err) => {
  console.error("[migrate] Fatal error:", err)
  process.exit(1)
})
