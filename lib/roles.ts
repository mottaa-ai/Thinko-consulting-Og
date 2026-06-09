// Pure role definitions and permission helpers.
// Safe to import from both client and server components (no server-only deps).

export type Role = "superadmin" | "admin" | "content_manager"

/** A user row as displayed in the admin users management table. */
export interface AdminUserRow {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
}

export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Superadministrador",
  admin: "Administrador",
  content_manager: "Gestor de contenido",
}

export const ALL_ROLES: Role[] = ["superadmin", "admin", "content_manager"]

export function isValidRole(value: unknown): value is Role {
  return value === "superadmin" || value === "admin" || value === "content_manager"
}

/** Roles that the given role is allowed to assign when creating users. */
export function assignableRoles(role: Role): Role[] {
  if (role === "superadmin") return ["superadmin", "admin", "content_manager"]
  if (role === "admin") return ["admin", "content_manager"]
  return []
}

/** Can this role access the user management section at all? */
export function canManageUsers(role: Role): boolean {
  return role === "superadmin" || role === "admin"
}

/** Can this role delete users? */
export function canDeleteUsers(role: Role): boolean {
  return role === "superadmin"
}

/** Can this role edit site content + blog? */
export function canEditContent(role: Role): boolean {
  return role === "superadmin" || role === "admin" || role === "content_manager"
}

/** Can this role edit tracking/analytics codes that live in the site header? */
export function canEditTracking(role: Role): boolean {
  return role === "superadmin" || role === "admin"
}
