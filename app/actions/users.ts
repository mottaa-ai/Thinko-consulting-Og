"use server"

import { db } from "@/lib/db"
import { user as userTable } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq, asc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import {
  getSessionUser,
  assignableRoles,
  canManageUsers,
  canDeleteUsers,
  isValidRole,
  type Role,
} from "@/lib/permissions"

export interface AdminUserRow {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
}

/** Lists all admin users. Requires user-management access. */
export async function listUsers(): Promise<AdminUserRow[]> {
  const current = await getSessionUser()
  if (!current || !canManageUsers(current.role)) {
    throw new Error("No autorizado")
  }

  const rows = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      role: userTable.role,
      createdAt: userTable.createdAt,
    })
    .from(userTable)
    .orderBy(asc(userTable.createdAt))

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: (isValidRole(r.role) ? r.role : "content_manager") as Role,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }))
}

/** Creates a new user with a given role. Enforces role-assignment rules. */
export async function createUser(input: {
  name: string
  email: string
  password: string
  role: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const { writeFileSync } = await import("node:fs")
    writeFileSync("/tmp/v0-createuser-trace.txt", `called ${new Date().toISOString()} email=${input.email} role=${input.role}`)
  } catch {}
  const current = await getSessionUser()
  if (!current || !canManageUsers(current.role)) {
    return { ok: false, error: "No autorizado." }
  }

  if (!isValidRole(input.role)) {
    return { ok: false, error: "Rol inválido." }
  }

  const allowed = assignableRoles(current.role)
  if (!allowed.includes(input.role)) {
    return { ok: false, error: "No tienes permiso para asignar ese rol." }
  }

  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  if (!name || !email || input.password.length < 8) {
    return { ok: false, error: "Completa todos los campos. La contraseña debe tener al menos 8 caracteres." }
  }

  // Reject duplicates up front for a clean error message.
  const existing = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)
  if (existing.length > 0) {
    return { ok: false, error: "Ya existe un usuario con ese correo." }
  }

  try {
    // Use Better Auth's internal adapter so the user is created server-side
    // with the correct role and a hashed password, WITHOUT creating a session
    // or setting cookies (which would otherwise replace the current admin's
    // session). This is the robust way to provision accounts from an admin.
    const ctx = await auth.$context
    const hashed = await ctx.password.hash(input.password)

    const newUser = await ctx.internalAdapter.createUser({
      name,
      email,
      emailVerified: false,
      role: input.role,
    })

    await ctx.internalAdapter.createAccount({
      userId: newUser.id,
      providerId: "credential",
      accountId: newUser.id,
      password: hashed,
    })

    revalidatePath("/admin/usuarios")
    return { ok: true }
  } catch (e) {
    try {
      const { writeFileSync } = await import("node:fs")
      writeFileSync("/tmp/v0-createuser-error.txt", String(e instanceof Error ? e.stack : e))
    } catch {}
    const message = e instanceof Error ? e.message : "No se pudo crear el usuario."
    if (/exist|already|unique|duplicate/i.test(message)) {
      return { ok: false, error: "Ya existe un usuario con ese correo." }
    }
    return { ok: false, error: message }
  }
}

/** Updates a user's role. Enforces role-assignment rules. */
export async function updateUserRole(
  userId: string,
  role: string,
): Promise<{ ok: boolean; error?: string }> {
  const current = await getSessionUser()
  if (!current || !canManageUsers(current.role)) {
    return { ok: false, error: "No autorizado." }
  }
  if (!isValidRole(role)) {
    return { ok: false, error: "Rol inválido." }
  }

  // You cannot change your own role (avoid accidental self-lockout).
  if (userId === current.id) {
    return { ok: false, error: "No puedes cambiar tu propio rol." }
  }

  const target = await db
    .select({ role: userTable.role })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1)
  const targetRole = isValidRole(target[0]?.role) ? (target[0].role as Role) : "content_manager"

  // Only a superadmin may modify another superadmin.
  if (targetRole === "superadmin" && current.role !== "superadmin") {
    return { ok: false, error: "Solo un superadministrador puede modificar a otro superadministrador." }
  }

  const allowed = assignableRoles(current.role)
  if (!allowed.includes(role as Role)) {
    return { ok: false, error: "No tienes permiso para asignar ese rol." }
  }

  await db.update(userTable).set({ role }).where(eq(userTable.id, userId))
  revalidatePath("/admin/usuarios")
  return { ok: true }
}

/** Deletes a user. Superadmin only. */
export async function deleteUser(userId: string): Promise<{ ok: boolean; error?: string }> {
  const current = await getSessionUser()
  if (!current || !canDeleteUsers(current.role)) {
    return { ok: false, error: "No autorizado." }
  }
  if (userId === current.id) {
    return { ok: false, error: "No puedes eliminar tu propia cuenta." }
  }

  await db.delete(userTable).where(eq(userTable.id, userId))
  revalidatePath("/admin/usuarios")
  return { ok: true }
}
