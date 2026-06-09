"use server"

import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { sql, eq } from "drizzle-orm"

/**
 * Returns true if at least one admin user already exists.
 * Used to lock down the initial setup page after the first account is created.
 */
export async function adminAccountExists(): Promise<boolean> {
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(user)
  return (result[0]?.count ?? 0) > 0
}

/**
 * Creates the first admin account. Only succeeds when no users exist yet.
 * After the first account, this becomes a no-op for security.
 */
export async function createInitialAdmin(formData: {
  name: string
  email: string
  password: string
}): Promise<{ ok: boolean; error?: string }> {
  const exists = await adminAccountExists()
  if (exists) {
    return { ok: false, error: "Ya existe una cuenta de administrador. El registro inicial está deshabilitado." }
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      headers: await headers(),
    })

    // The very first account is always the superadmin.
    const newUserId = (result as { user?: { id?: string } })?.user?.id
    if (newUserId) {
      await db.update(user).set({ role: "superadmin" }).where(eq(user.id, newUserId))
    } else {
      await db
        .update(user)
        .set({ role: "superadmin" })
        .where(eq(user.email, formData.email.trim().toLowerCase()))
    }
    return { ok: true }
  } catch (e) {
    console.log("[v0] createInitialAdmin error:", e)
    const message = e instanceof Error ? e.message : "No se pudo crear la cuenta."
    return { ok: false, error: message }
  }
}
