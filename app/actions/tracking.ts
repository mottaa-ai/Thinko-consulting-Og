"use server"

import { db } from "@/lib/db"
import { siteContent } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getSessionUser, canEditTracking } from "@/lib/permissions"

const TRACKING_SECTION = "tracking"
// Tracking codes are language-agnostic, so we store them under a single row.
const TRACKING_LOCALE = "global"

export type TrackingCodes = {
  metaPixel: string
  googleAnalytics: string
  googleTagManager: string
}

const EMPTY: TrackingCodes = {
  metaPixel: "",
  googleAnalytics: "",
  googleTagManager: "",
}

function normalize(data: unknown): TrackingCodes {
  const d = (data ?? {}) as Partial<TrackingCodes>
  return {
    metaPixel: typeof d.metaPixel === "string" ? d.metaPixel : "",
    googleAnalytics: typeof d.googleAnalytics === "string" ? d.googleAnalytics : "",
    googleTagManager: typeof d.googleTagManager === "string" ? d.googleTagManager : "",
  }
}

/** Loads the saved tracking codes (admin/superadmin only). */
export async function loadTrackingCodes(): Promise<TrackingCodes> {
  const user = await getSessionUser()
  if (!user || !canEditTracking(user.role)) throw new Error("Unauthorized")

  const rows = await db
    .select()
    .from(siteContent)
    .where(and(eq(siteContent.section, TRACKING_SECTION), eq(siteContent.locale, TRACKING_LOCALE)))
  return normalize(rows[0]?.data ?? EMPTY)
}

/** Upserts the tracking codes. */
export async function saveTrackingCodes(input: TrackingCodes): Promise<{ ok: boolean }> {
  const user = await getSessionUser()
  if (!user || !canEditTracking(user.role)) throw new Error("Unauthorized")

  const data = normalize(input)

  await db
    .insert(siteContent)
    .values({
      section: TRACKING_SECTION,
      locale: TRACKING_LOCALE,
      data,
      updatedBy: user.email,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [siteContent.section, siteContent.locale],
      set: { data, updatedBy: user.email, updatedAt: new Date() },
    })

  // Refresh the whole site so the header scripts update everywhere.
  revalidatePath("/", "layout")
  return { ok: true }
}
