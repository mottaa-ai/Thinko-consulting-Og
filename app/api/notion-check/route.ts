import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY
  const dbId = process.env.NOTION_CMS_DB_ID

  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      NOTION_API_KEY: apiKey ? `set (${apiKey.slice(0, 10)}...)` : "MISSING",
      NOTION_CMS_DB_ID: dbId || "MISSING",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "MISSING",
      SYNC_SECRET: process.env.SYNC_SECRET ? "set" : "MISSING",
    },
  }

  if (!apiKey || !dbId) {
    return NextResponse.json(
      { ok: false, error: "Missing environment variables", ...diagnostics },
      { status: 500 }
    )
  }

  try {
    const notion = new Client({ auth: apiKey })

    // 1. Check database access
    const database = await notion.databases.retrieve({ database_id: dbId })
    diagnostics.database = {
      id: database.id,
      title: (database as any).title?.[0]?.plain_text || "(no title)",
      properties: Object.keys((database as any).properties || {}),
    }

    // 2. Try a simple query without filters
    const allResults = await notion.databases.query({
      database_id: dbId,
      page_size: 5,
    })
    diagnostics.totalPages = allResults.results.length
    diagnostics.samplePages = allResults.results.map((page: any) => {
      const props = page.properties || {}
      return {
        id: page.id,
        name: props["Name"]?.title?.[0]?.plain_text || "(no name)",
        slug: props["Slug"]?.rich_text?.[0]?.plain_text || "(no slug)",
        status: props["Status"]?.select?.name || "(no status)",
        destacado: props["Destacado"]?.checkbox || false,
      }
    })

    // 3. Try filtered query for Published
    try {
      const published = await notion.databases.query({
        database_id: dbId,
        filter: {
          property: "Status",
          select: { equals: "Published" },
        },
        page_size: 100,
      })
      diagnostics.publishedCount = published.results.length
    } catch (err: any) {
      diagnostics.publishedQueryError = err.message
    }

    return NextResponse.json({ ok: true, ...diagnostics })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Unknown error",
        code: error.code,
        status: error.status,
        ...diagnostics,
      },
      { status: 500 }
    )
  }
}
