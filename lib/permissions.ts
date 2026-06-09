import "server-only"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { user as userTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { isValidRole, type Role } from "@/lib/roles"

// Re-export pure helpers so existing server-side imports keep working.
export {
  ROLE_LABELS,
  ALL_ROLES,
  isValidRole,
  assignableRoles,
  canManageUsers,
  canDeleteUsers,
  canEditContent,
  type Role,
} from "@/lib/roles"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
}

/**
 * Returns the current session user with its role, or null if not authenticated.
 * The role is read fresh from the DB so changes take effect immediately.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const rows = await db
    .select({ role: userTable.role })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)

  const role = isValidRole(rows[0]?.role) ? (rows[0].role as Role) : "content_manager"
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role,
  }
}
