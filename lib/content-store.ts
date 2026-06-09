import { db } from "@/lib/db"
import { siteContent } from "@/lib/db/schema"
import type { AllContent, Locale } from "@/lib/i18n/types"

export type ContentOverrides = {
  es: Partial<AllContent>
  en: Partial<AllContent>
}

/**
 * Loads all editable content overrides from the database, grouped by locale.
 * These are merged on top of the static JSON defaults so any section that
 * hasn't been edited falls back to the bundled content.
 */
export async function getContentOverrides(): Promise<ContentOverrides> {
  const overrides: ContentOverrides = { es: {}, en: {} }

  try {
    const rows = await db.select().from(siteContent)
    for (const row of rows) {
      const locale = row.locale as Locale
      if (locale !== "es" && locale !== "en") continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(overrides[locale] as Record<string, unknown>)[row.section] = row.data as any
    }
  } catch (e) {
    console.log("[v0] getContentOverrides error:", e)
  }

  return overrides
}

/**
 * Loads a single section's data for a given locale, or null if not overridden.
 */
export async function getSectionContent(section: string, locale: Locale) {
  try {
    const rows = await db.select().from(siteContent)
    const match = rows.find((r) => r.section === section && r.locale === locale)
    return match?.data ?? null
  } catch (e) {
    console.log("[v0] getSectionContent error:", e)
    return null
  }
}

export type TrackingCodes = {
  metaPixel: string
  googleAnalytics: string
  googleTagManager: string
}

/**
 * Loads the public tracking codes (Meta Pixel, Google Analytics, Tag Manager)
 * that get injected into the site header. Safe to call from the root layout —
 * returns empty strings when nothing is configured.
 */
export async function getTrackingCodes(): Promise<TrackingCodes> {
  const empty: TrackingCodes = { metaPixel: "", googleAnalytics: "", googleTagManager: "" }
  try {
    const rows = await db.select().from(siteContent)
    const match = rows.find((r) => r.section === "tracking" && r.locale === "global")
    const d = (match?.data ?? {}) as Partial<TrackingCodes>
    return {
      metaPixel: typeof d.metaPixel === "string" ? d.metaPixel : "",
      googleAnalytics: typeof d.googleAnalytics === "string" ? d.googleAnalytics : "",
      googleTagManager: typeof d.googleTagManager === "string" ? d.googleTagManager : "",
    }
  } catch (e) {
    console.log("[v0] getTrackingCodes error:", e)
    return empty
  }
}
