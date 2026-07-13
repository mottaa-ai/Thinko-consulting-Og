import { pgTable, text, timestamp, boolean, serial, jsonb, unique, integer } from "drizzle-orm/pg-core"

// ---- Better Auth tables (do not rename columns) ----
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // App role: "superadmin" | "admin" | "content_manager"
  role: text("role").notNull().default("content_manager"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// ---- App tables ----
// Stores editable site content per section + locale as JSON.
export const siteContent = pgTable(
  "site_content",
  {
    id: serial("id").primaryKey(),
    section: text("section").notNull(),
    locale: text("locale").notNull(),
    data: jsonb("data").notNull(),
    updatedBy: text("updatedBy"),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (t) => ({
    sectionLocaleUnique: unique().on(t.section, t.locale),
  }),
)

// Blog articles from CMS (imported from CSV or managed manually)
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content"), // Optional: full article body (can be left empty if using excerpt + source link)
  author: text("author"),
  category: text("category"),
  imageUrl: text("imageUrl"),
  sourceUrl: text("sourceUrl"), // Original article source
  sourceName: text("sourceName"), // e.g., "La Razón", "ACE Prensa"
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  updatedBy: text("updatedBy"),
  isPublished: boolean("isPublished").notNull().default(false),
})

// Contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  phone: text("phone"),
  company: text("company"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
})

// Sync metadata for article imports (tracks CSV import state)
export const articleSyncs = pgTable("article_syncs", {
  id: serial("id").primaryKey(),
  sourceFile: text("sourceFile").notNull(), // e.g., "csv_import_2026_01_13"
  totalCount: integer("totalCount").notNull(),
  importedCount: integer("importedCount").notNull().default(0),
  failedCount: integer("failedCount").notNull().default(0),
  syncedAt: timestamp("syncedAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
