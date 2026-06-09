"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function AdminHeader({
  email,
  roleLabel,
  canManageUsers = false,
}: {
  email: string
  roleLabel?: string
  canManageUsers?: boolean
}) {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="border-b border-slate-800 bg-[#0f172a] sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="font-headline text-lg font-light text-white">Thinko</span>
          <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold">Admin</span>
        </Link>
        <div className="flex items-center gap-6">
          {canManageUsers && (
            <Link
              href="/admin/usuarios"
              className="text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              Usuarios
            </Link>
          )}
          <Link
            href="/"
            target="_blank"
            className="text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            Ver sitio
          </Link>
          <span className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-xs text-slate-400">{email}</span>
            {roleLabel && (
              <span className="text-[10px] uppercase tracking-wider text-[#00b8b4]">{roleLabel}</span>
            )}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#00b8b4] transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
