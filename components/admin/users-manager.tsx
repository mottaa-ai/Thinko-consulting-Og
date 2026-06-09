"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createUser, updateUserRole, deleteUser, type AdminUserRow } from "@/app/actions/users"
import { ROLE_LABELS, type Role } from "@/lib/roles"

const ROLE_HINTS: Record<Role, string> = {
  superadmin: "Acceso total. Gestiona usuarios, roles y puede eliminar cuentas.",
  admin: "Gestiona contenido y blog. Crea administradores y gestores de contenido.",
  content_manager: "Edita los textos del sitio y administra el blog.",
}

export function UsersManager({
  users,
  currentUserId,
  currentRole,
  creatableRoles,
  canDelete,
}: {
  users: AdminUserRow[]
  currentUserId: string
  currentRole: Role
  creatableRoles: Role[]
  canDelete: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Create form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(creatableRoles[creatableRoles.length - 1] ?? "content_manager")
  const [formError, setFormError] = useState<string | null>(null)
  const [formOk, setFormOk] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  // Row-level feedback
  const [rowError, setRowError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormOk(null)
    setCreating(true)
    const result = await createUser({ name, email, password, role })
    setCreating(false)
    if (!result.ok) {
      setFormError(result.error ?? "No se pudo crear el usuario.")
      return
    }
    setFormOk(`Usuario "${email}" creado correctamente.`)
    setName("")
    setEmail("")
    setPassword("")
    setRole(creatableRoles[creatableRoles.length - 1] ?? "content_manager")
    startTransition(() => router.refresh())
  }

  function handleRoleChange(userId: string, newRole: string) {
    setRowError(null)
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
      if (!result.ok) {
        setRowError(result.error ?? "No se pudo actualizar el rol.")
        return
      }
      router.refresh()
    })
  }

  function handleDelete(userId: string, userEmail: string) {
    setRowError(null)
    if (!confirm(`¿Eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      const result = await deleteUser(userId)
      if (!result.ok) {
        setRowError(result.error ?? "No se pudo eliminar el usuario.")
        return
      }
      router.refresh()
    })
  }

  const inputClass =
    "w-full bg-[#0f172a] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[#00b8b4] focus:outline-none transition-colors"
  const labelClass = "text-xs uppercase tracking-widest text-slate-400 font-semibold"

  return (
    <div className="space-y-12">
      {/* Create user */}
      <section className="border border-slate-800 bg-[#1e293b]/50 p-6 sm:p-8">
        <h2 className="font-headline text-xl font-light text-white mb-6">Crear nuevo usuario</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="u-name" className={labelClass}>
              Nombre
            </label>
            <input
              id="u-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nombre completo"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="u-email" className={labelClass}>
              Correo electrónico
            </label>
            <input
              id="u-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="persona@thinkoconsulting.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="u-password" className={labelClass}>
              Contraseña
            </label>
            <input
              id="u-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="u-role" className={labelClass}>
              Rol
            </label>
            <select
              id="u-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className={inputClass}
            >
              {creatableRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 leading-relaxed">{ROLE_HINTS[role]}</p>
          </div>

          <div className="sm:col-span-2 space-y-3">
            {formError && <p className="text-sm text-red-400">{formError}</p>}
            {formOk && <p className="text-sm text-[#00b8b4]">{formOk}</p>}
            <button
              type="submit"
              disabled={creating}
              className="bg-[#00b8b4] text-white py-3 px-8 font-semibold uppercase tracking-widest text-sm hover:bg-[#009d99] transition-colors disabled:opacity-50"
            >
              {creating ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      </section>

      {/* Existing users */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-5">
          Usuarios existentes ({users.length})
        </h2>
        {rowError && <p className="text-sm text-red-400 mb-4">{rowError}</p>}
        <div className="border border-slate-800 divide-y divide-slate-800">
          {users.map((u) => {
            const isSelf = u.id === currentUserId
            // Roles this current user is allowed to assign, plus the target's
            // own current role so the select always shows a valid value.
            const roleOptions = Array.from(new Set([...creatableRoles, u.role])) as Role[]
            // A non-superadmin cannot edit a superadmin.
            const locked = u.role === "superadmin" && currentRole !== "superadmin"
            const canEditRow = !isSelf && !locked

            return (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1e293b]/30"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {u.name}
                    {isSelf && <span className="ml-2 text-xs text-slate-500">(tú)</span>}
                  </p>
                  <p className="text-slate-400 text-xs truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {canEditRow ? (
                    <select
                      value={u.role}
                      disabled={isPending}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-[#0f172a] border border-slate-700 px-3 py-2 text-white text-xs focus:border-[#00b8b4] focus:outline-none transition-colors disabled:opacity-50"
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs uppercase tracking-wider text-[#00b8b4] border border-slate-700 px-3 py-2">
                      {ROLE_LABELS[u.role]}
                    </span>
                  )}
                  {canDelete && !isSelf && u.role !== "superadmin" && (
                    <button
                      onClick={() => handleDelete(u.id, u.email)}
                      disabled={isPending}
                      className="text-xs uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
