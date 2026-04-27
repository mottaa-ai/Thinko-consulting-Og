import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const NOTION_VERSION = "2022-06-28"
const NOTION_BASE = "https://api.notion.com/v1"

async function notionCall(
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(`${NOTION_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    })
    const text = await res.text()
    let data: any = null
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }
    return { ok: res.ok, status: res.status, data }
  } catch (err: any) {
    return { ok: false, status: 0, data: { error: err.message } }
  }
}

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY
  const rawDbId = process.env.NOTION_CMS_DB_ID

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      NOTION_API_KEY: apiKey
        ? `set (length: ${apiKey.length}, prefix: ${apiKey.slice(0, 7)}...)`
        : "MISSING",
      NOTION_CMS_DB_ID: rawDbId || "MISSING",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "MISSING",
      SYNC_SECRET: process.env.SYNC_SECRET ? "set" : "MISSING",
    },
  }

  if (!apiKey || !rawDbId) {
    return NextResponse.json(
      { ok: false, error: "Missing environment variables", ...diagnostics },
      { status: 500 },
    )
  }

  // Normalize DB ID (accept both with and without dashes)
  const dbId = rawDbId.replace(/-/g, "").trim()
  diagnostics.normalizedDbId = dbId

  // 1. Verify auth via /users/me
  const me = await notionCall(apiKey, `/users/me`)
  diagnostics.botUser = me.ok
    ? {
        ok: true,
        id: me.data.id,
        name: me.data.name,
        type: me.data.type,
        bot: me.data.bot ? "ok" : null,
      }
    : { ok: false, status: me.status, error: me.data?.message || me.data }

  // 2. Search what the integration can see
  const search = await notionCall(apiKey, `/search`, {
    method: "POST",
    body: JSON.stringify({ page_size: 25 }),
  })
  diagnostics.searchResults = search.ok
    ? {
        ok: true,
        total: search.data.results?.length || 0,
        objects: (search.data.results || []).map((r: any) => ({
          id: r.id,
          object: r.object,
          title:
            r.object === "database"
              ? r.title?.[0]?.plain_text
              : r.properties?.title?.title?.[0]?.plain_text ||
                r.properties?.Name?.title?.[0]?.plain_text ||
                "(no title)",
        })),
      }
    : { ok: false, status: search.status, error: search.data?.message }

  // 3. databases.retrieve
  const dbRetrieve = await notionCall(apiKey, `/databases/${dbId}`)
  diagnostics.databaseRetrieve = dbRetrieve.ok
    ? {
        ok: true,
        id: dbRetrieve.data.id,
        object: dbRetrieve.data.object,
        title: dbRetrieve.data.title?.[0]?.plain_text || "(no title)",
        propertyKeys: Object.keys(dbRetrieve.data.properties || {}),
        propertyCount: Object.keys(dbRetrieve.data.properties || {}).length,
        propertyTypes: Object.fromEntries(
          Object.entries(dbRetrieve.data.properties || {}).map(([k, v]: any) => [k, v.type]),
        ),
      }
    : {
        ok: false,
        status: dbRetrieve.status,
        error: dbRetrieve.data?.message || dbRetrieve.data,
        code: dbRetrieve.data?.code,
      }

  // 4. pages.retrieve in case ID is actually a page
  const pageRetrieve = await notionCall(apiKey, `/pages/${dbId}`)
  diagnostics.pageRetrieve = pageRetrieve.ok
    ? {
        ok: true,
        id: pageRetrieve.data.id,
        object: pageRetrieve.data.object,
        parentType: pageRetrieve.data.parent?.type,
        parentId:
          pageRetrieve.data.parent?.database_id || pageRetrieve.data.parent?.page_id,
      }
    : {
        ok: false,
        status: pageRetrieve.status,
        error: pageRetrieve.data?.message,
      }

  // 5. Query database (no filter, just to see pages)
  const dbQuery = await notionCall(apiKey, `/databases/${dbId}/query`, {
    method: "POST",
    body: JSON.stringify({ page_size: 5 }),
  })
  diagnostics.databaseQuery = dbQuery.ok
    ? {
        ok: true,
        totalReturned: dbQuery.data.results?.length || 0,
        hasMore: dbQuery.data.has_more,
        samplePages: (dbQuery.data.results || []).map((page: any) => {
          const props = page.properties || {}
          return {
            id: page.id,
            allPropertyKeys: Object.keys(props),
            name: props["Name"]?.title?.[0]?.plain_text || "(no name)",
            slug: props["Slug"]?.rich_text?.[0]?.plain_text || "(no slug)",
            statusType: props["Status"]?.type,
            statusValue:
              props["Status"]?.status?.name ||
              props["Status"]?.select?.name ||
              "(no status)",
            destacado: props["Destacado"]?.checkbox || false,
          }
        }),
      }
    : {
        ok: false,
        status: dbQuery.status,
        error: dbQuery.data?.message || dbQuery.data,
        code: dbQuery.data?.code,
      }

  return NextResponse.json(diagnostics, { status: 200 })
}
