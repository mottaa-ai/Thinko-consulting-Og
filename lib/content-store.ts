import 'server-only';
import { db } from './db';
import { siteContent } from './db/schema';
import { eq, and } from 'drizzle-orm';
import type { Locale } from './i18n/types';

export interface ContentOverrides {
  [key: string]: any;
}

/**
 * Get all content overrides for a section/locale.
 * Falls back to empty object if none exist.
 */
export async function getContentOverrides(): Promise<ContentOverrides> {
  try {
    // For now, return empty overrides.
    // In the future, this could read from the database based on locale.
    return {};
  } catch (err) {
    console.error('[v0] Error loading content overrides:', err);
    return {};
  }
}

/**
 * Get tracking codes (Meta Pixel, Google Analytics, GTM)
 */
export async function getTrackingCodes() {
  return {
    metaPixel: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
    googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    googleTagManager: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '',
  };
}

/**
 * Load a content section by name and locale
 */
export async function loadSection(section: string, locale: Locale) {
  try {
    const rows = await db
      .select()
      .from(siteContent)
      .where(
        and(
          eq(siteContent.section, section),
          eq(siteContent.locale, locale)
        )
      );
    return rows[0]?.data ?? null;
  } catch (err) {
    console.error('[v0] Error loading section:', err);
    return null;
  }
}

/**
 * Save or update a section's content
 */
export async function saveSection(
  section: string,
  locale: Locale,
  data: unknown,
  updatedBy?: string
) {
  try {
    await db
      .insert(siteContent)
      .values({
        section,
        locale,
        data: data as object,
        updatedBy,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [siteContent.section, siteContent.locale],
        set: {
          data: data as object,
          updatedBy,
          updatedAt: new Date(),
        },
      });
    return { ok: true };
  } catch (err) {
    console.error('[v0] Error saving section:', err);
    throw err;
  }
}

/**
 * Reset a section to remove overrides
 */
export async function resetSection(section: string, locale: Locale) {
  try {
    await db
      .delete(siteContent)
      .where(
        and(
          eq(siteContent.section, section),
          eq(siteContent.locale, locale)
        )
      );
    return { ok: true };
  } catch (err) {
    console.error('[v0] Error resetting section:', err);
    throw err;
  }
}
