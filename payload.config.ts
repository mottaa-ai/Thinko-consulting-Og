import sharp from "sharp"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { buildConfig } from "payload"
import { Articles } from "./payload/collections/Articles"
import { Media } from "./payload/collections/Media"

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Articles, Media],
  secret: process.env.PAYLOAD_SECRET || "thinko-consulting-secret-change-in-production-2024",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    // Payload will use its own tables alongside the existing Drizzle/Better Auth tables
    schemaName: "payload",
  }),
  sharp,
  admin: {
    // Disable Payload's own admin since we have a custom one
    // The Payload admin at /admin will still work for content editors
    meta: {
      titleSuffix: "| Thinko CMS",
    },
  },
  serverURL:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  cors: [
    "http://localhost:3000",
    ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  telemetry: false,
})
