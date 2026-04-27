import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY
  const rawDbId = process.env.NOTION_CMS_DB_ID

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      NOTION_API_KEY: apiKey ? `set (length: ${apiKey.length}, prefix: ${apiKey.slice(0, 7)}...)` : "MISSING",
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

  const notion = new Client({ auth: apiKey })

  // 1. Verify auth by listing the bot user
  try {
    const me = await notion.users.me({})
    diagnostics.botUser = {
      id: (me as any).id,
      name: (me as any).name,
      type: (me as any).type,
      bot: (me as any).bot ? "ok" : null,
    }
  } catch (err: any) {
    diagnostics.botUserError = { message: err.message, code: err.code, status: err.status }
  }

  // 2. Search for any object the integration can see (database or page)
  try {
    const search = await notion.search({ page_size: 25 })
    diagnostics.searchResults = {
      total: search.results.length,
      objects: search.results.map((r: any) => ({
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
  } catch (err: any) {
    diagnostics.searchError = { message: err.message, code: err.code, status: err.status }
  }

  // 3. Try databases.retrieve
  try {
    const database: any = await notion.databases.retrieve({ database_id: dbId })
    diagnostics.databaseRetrieve = {
      ok: true,
      id: database.id,
      object: database.object,
      title: database.title?.[0]?.plain_text || "(no title)",
      propertyKeys: Object.keys(database.properties || {}),
      propertyCount: Object.keys(database.properties || {}).length,
      rawPropertiesPreview: JSON.stringify(database.properties || {}).slice(0, 500),
    }
  } catch (err: any) {
    diagnostics.databaseRetrieve = {
      ok: false,
      error: err.message,
      code: err.code,
      status: err.status,
    }
  }

  // 4. Try pages.retrieve in case the ID is actually a page
  try {
    const page: any = await notion.pages.retrieve({ page_id: dbId })
    diagnostics.pageRetrieve = {
      ok: true,
      id: page.id,
      object: page.object,
      parentType: page.parent?.type,
      parentId: page.parent?.database_id || page.parent?.page_id,
      propertyKeys: Object.keys(page.properties || {}),
    }
  } catch (err: any) {
    diagnostics.pageRetrieve = {
      ok: false,
      error: err.message,
      code: err.code,
    }
  }

  // 5. Try a simple query
  try {
    const allResults = await notion.databases.query({
      database_id: dbId,
      page_size: 5,
    })
    diagnostics.databaseQuery = {
      ok: true,
      totalReturned: allResults.results.length,
      hasMore: allResults.has_more,
      samplePages: allResults.results.map((page: any) => {
        const props = page.properties || {}
        const keys = Object.keys(props)
        return {
          id: page.id,
          allPropertyKeys: keys,
          name: props["Name"]?.title?.[0]?.plain_text || "(no name)",
          slug: props["Slug"]?.rich_text?.[0]?.plain_text || "(no slug)",
          status: props["Status"]?.select?.name || "(no status)",
          destacado: props["Destacado"]?.checkbox || false,
        }
      }),
    }
  } catch (err: any) {
    diagnostics.databaseQuery = {
      ok: false,
      error: err.message,
      code: err.code,
      status: err.status,
    }
  }

  return NextResponse.json(diagnostics)
}
