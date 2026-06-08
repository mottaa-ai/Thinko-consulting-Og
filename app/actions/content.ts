"use server"

import { db } from "@/lib/db"
import { siteContent } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { Locale } from "@/lib/i18n/types"

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

/**
 * Returns the stored override for a section/locale, or null when none exists.
 */
export async function loadSection(section: string, locale: Locale) {
  await requireUser()
  const rows = await db
    .select()
    .from(siteContent)
    .where(and(eq(siteContent.section, section), eq(siteContent.locale, locale)))
  return rows[0]?.data ?? null
}

/**
 * Upserts a section's content for a given locale.
 */
export async function saveSection(section: string, locale: Locale, data: unknown) {
  const user = await requireUser()

  await db
    .insert(siteContent)
    .values({
      section,
      locale,
      data: data as object,
      updatedBy: user.email,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [siteContent.section, siteContent.locale],
      set: {
        data: data as object,
        updatedBy: user.email,
        updatedAt: new Date(),
      },
    })

  // Refresh the public site so the new content shows up everywhere.
  revalidatePath("/", "layout")
  return { ok: true }
}

/**
 * Removes a section override, restoring the bundled JSON default.
 */
export async function resetSection(section: string, locale: Locale) {
  await requireUser()
  await db
    .delete(siteContent)
    .where(and(eq(siteContent.section, section), eq(siteContent.locale, locale)))
  revalidatePath("/", "layout")
  return { ok: true }
}
