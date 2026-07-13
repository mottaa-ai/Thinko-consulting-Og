"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createUser, updateUserRole, deleteUser } from "@/app/actions/users"
import { ROLE_LABELS, type Role, type AdminUserRow } from "@/lib/roles"

// ─── Role metadata ────────────────────────────────────────────────────────────

const ROLE_META: Record<Role, { hint: string; color: string }> = {
  superadmin: {
    hint: "Acceso total. Puede gestionar usuarios, cambiar roles y eliminar cuentas.",
    color: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  },
  admin: {
    hint: "Gestiona contenido y blog. Puede crear y editar usuarios con roles menores.",
    color: "text-[#00b8b4] border-[#00b8b4]/30 bg-[#00b8b4]/5",
  },
  content_manager: {
    hint: "Edita textos del sitio y administra las publicaciones del blog.",
    color: "text-slate-300 border-slate-600 bg-slate-800/40",
  },
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const { color } = ROLE_META[role]
  return (
    <span className={`inline-block text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 border rounded-sm ${color}`}>
      {ROLE_LABELS[role]}
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  return (
    <div className="w-10 h-10 rounded-full bg-[#00b8b4]/10 border border-[#00b8b4]/20 flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-[#00b8b4]">{initials}</span>
    </div>
  )
}

// ─── Edit role modal ──────────────────────────────────────────────────────────

function EditRoleModal({
  user,
  creatableRoles,
  currentRole,
  onClose,
  onSave,
  isPending,
}: {
  user: AdminUserRow
  creatableRoles: Role[]
  currentRole: Role
  onClose: () => void
  onSave: (userId: string, role: Role) => void
  isPending: boolean
}) {
  // Include target's current role so the select always shows a valid value
  const roleOptions = Array.from(new Set([...creatableRoles, user.role])) as Role[]
  const [selected, setSelected] = useState<Role>(user.role)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-headline text-lg font-light text-white">Editar rol</h3>
            <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none mt-0.5">
            ×
          </button>
        </div>

        <div className="space-y-3">
          {roleOptions.map((r) => (
            <label
              key={r}
              className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                selected === r
                  ? "border-[#00b8b4] bg-[#00b8b4]/5"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="role-select"
                value={r}
                checked={selected === r}
                onChange={() => setSelected(r)}
                className="mt-0.5 accent-[#00b8b4]"
              />
              <div>
                <p className="text-sm font-medium text-white">{ROLE_LABELS[r]}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{ROLE_META[r].hint}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onSave(user.id, selected)}
            disabled={isPending || selected === user.role}
            className="flex-1 bg-[#00b8b4] text-[#0f172a] py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-[#009d99] transition-colors disabled:opacity-40"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs uppercase tracking-widest text-slate-400 border border-slate-700 hover:border-slate-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  // Create form
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(creatableRoles[creatableRoles.length - 1] ?? "content_manager")
  const [formError, setFormError] = useState<string | null>(null)
  const [formOk, setFormOk] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Row feedback
  const [rowError, setRowError] = useState<string | null>(null)

  // Edit modal
  const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null)

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
    setFormOk(`Usuario "${email}" creado correctamente. Se enviaron las credenciales por email.`)
    setName("")
    setEmail("")
    setPassword("")
    setRole(creatableRoles[creatableRoles.length - 1] ?? "content_manager")
    setShowForm(false)
    startTransition(() => router.refresh())
  }

  function handleRoleChange(userId: string, newRole: Role) {
    setRowError(null)
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
      setEditingUser(null)
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
    "w-full bg-[#0f172a] border border-slate-700 px-4 py-3 text-white text-sm focus:border-[#00b8b4] focus:outline-none transition-colors placeholder:text-slate-600"
  const labelClass = "text-[10px] uppercase tracking-widest text-slate-400 font-semibold"

  return (
    <>
      {/* Edit role modal */}
      {editingUser && (
        <EditRoleModal
          user={editingUser}
          creatableRoles={creatableRoles}
          currentRole={currentRole}
          onClose={() => setEditingUser(null)}
          onSave={handleRoleChange}
          isPending={isPending}
        />
      )}

      <div className="space-y-10">

        {/* Header + toggle create form */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm">
              {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
            </p>
          </div>
          {creatableRoles.length > 0 && (
            <button
              onClick={() => { setShowForm((v) => !v); setFormError(null); setFormOk(null) }}
              className="flex items-center gap-2 bg-[#00b8b4] text-[#0f172a] px-5 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-[#009d99] transition-colors"
            >
              {showForm ? "Cancelar" : "+ Nuevo usuario"}
            </button>
          )}
        </div>

        {/* Success feedback (outside form, persists after close) */}
        {formOk && (
          <p className="text-sm text-[#00b8b4] border border-[#00b8b4]/20 bg-[#00b8b4]/5 px-4 py-3">
            {formOk}
          </p>
        )}

        {/* Create form (collapsible) */}
        {showForm && (
          <section className="border border-slate-700 bg-[#1e293b]/60 p-6 sm:p-8">
            <h2 className="font-headline text-xl font-light text-white mb-1">Nuevo usuario</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              El usuario recibirá sus credenciales de acceso por correo electrónico.
            </p>

            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="u-name" className={labelClass}>Nombre completo</label>
                <input
                  id="u-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Ana García"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="u-email" className={labelClass}>Correo electrónico</label>
                <input
                  id="u-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="ana@thinkoconsulting.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="u-password" className={labelClass}>Contraseña temporal</label>
                <input
                  id="u-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="u-role" className={labelClass}>Rol</label>
                <select
                  id="u-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className={inputClass}
                >
                  {creatableRoles.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 leading-relaxed pt-0.5">{ROLE_META[role].hint}</p>
              </div>

              <div className="sm:col-span-2 flex items-center gap-4 pt-2">
                {formError && <p className="text-sm text-red-400 flex-1">{formError}</p>}
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#00b8b4] text-[#0f172a] py-3 px-8 text-xs font-bold uppercase tracking-widest hover:bg-[#009d99] transition-colors disabled:opacity-50 ml-auto"
                >
                  {creating ? "Creando..." : "Crear usuario"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Role legend */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-4">
            Roles del sistema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["content_manager", "admin", "superadmin"] as Role[]).map((r) => (
              <div key={r} className="border border-slate-800 bg-[#1e293b]/30 p-4 space-y-1.5">
                <RoleBadge role={r} />
                <p className="text-xs text-slate-400 leading-relaxed">{ROLE_META[r].hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Users list */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-4">
            Usuarios ({users.length})
          </h2>
          {rowError && (
            <p className="text-sm text-red-400 border border-red-400/20 bg-red-400/5 px-4 py-3 mb-4">
              {rowError}
            </p>
          )}

          <div className="border border-slate-800 divide-y divide-slate-800">
            {users.map((u) => {
              const isSelf = u.id === currentUserId
              const locked = u.role === "superadmin" && currentRole !== "superadmin"
              const canEditRow = !isSelf && !locked && creatableRoles.length > 0
              const canDeleteRow = canDelete && !isSelf && u.role !== "superadmin"

              return (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1e293b]/20 hover:bg-[#1e293b]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar name={u.name} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm font-medium truncate">{u.name}</p>
                        {isSelf && (
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 border border-slate-700 px-1.5 py-0.5">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{u.email}</p>
                      <div className="mt-1.5">
                        <RoleBadge role={u.role} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 sm:pl-4">
                    {canEditRow && (
                      <button
                        onClick={() => setEditingUser(u)}
                        disabled={isPending}
                        className="text-xs uppercase tracking-wider text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 transition-colors disabled:opacity-50"
                      >
                        Editar rol
                      </button>
                    )}
                    {canDeleteRow && (
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
                        disabled={isPending}
                        className="text-xs uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
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
    </>
  )
}
