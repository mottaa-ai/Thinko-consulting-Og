import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { UsersManager } from "@/components/admin/users-manager"
import { listUsers } from "@/app/actions/users"
import {
  getSessionUser,
  canManageUsers,
  canDeleteUsers,
  assignableRoles,
  ROLE_LABELS,
} from "@/lib/permissions"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const current = await getSessionUser()
  if (!current) redirect("/admin/login")
  if (!canManageUsers(current.role)) redirect("/admin")

  const users = await listUsers()
  const creatableRoles = assignableRoles(current.role)

  return (
    <>
      <AdminHeader email={current.email} roleLabel={ROLE_LABELS[current.role]} canManageUsers />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#00b8b4] transition-colors"
          >
            ← Volver al panel
          </Link>
        </div>
        <div className="mb-10">
          <h1 className="font-headline text-3xl font-light text-white mb-2">Gestión de usuarios</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Crea cuentas para el equipo y asígnales un rol. Cada rol define qué puede hacer dentro del
            panel.
          </p>
        </div>

        <UsersManager
          users={users}
          currentUserId={current.id}
          currentRole={current.role}
          creatableRoles={creatableRoles}
          canDelete={canDeleteUsers(current.role)}
        />
      </main>
    </>
  )
}
