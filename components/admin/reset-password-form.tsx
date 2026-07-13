"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (!token) {
      setError("Enlace inválido o expirado. Solicita uno nuevo.")
      return
    }

    setStatus("loading")

    const { error } = await authClient.resetPassword({ newPassword: password, token })

    if (error) {
      setError(
        error.message?.includes("expired") || error.message?.includes("invalid")
          ? "El enlace expiró o no es válido. Solicita uno nuevo."
          : (error.message ?? "Ocurrió un error. Intenta de nuevo.")
      )
      setStatus("error")
      return
    }

    setStatus("done")
    setTimeout(() => router.push("/admin/login"), 2500)
  }

  return (
    <main className="min-h-svh bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="block text-xs uppercase tracking-[0.3em] text-[#00b8b4] mb-4 font-semibold">
            Panel de administración
          </span>
          <h1 className="font-headline text-3xl font-light text-white leading-tight">Nueva contraseña</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Elige una contraseña segura para tu cuenta.
          </p>
        </div>

        {status === "done" ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00b8b4]/10 border border-[#00b8b4]/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10l4 4 8-8" stroke="#00b8b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-white font-medium mb-2">Contraseña actualizada</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : !token ? (
          <div className="text-center">
            <p className="text-red-400 text-sm mb-4">Enlace inválido o expirado.</p>
            <Link href="/admin/olvide-contrasena" className="text-[#00b8b4] hover:underline text-sm">
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-slate-300 text-xs uppercase tracking-wider">
                Nueva contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm" className="text-slate-300 text-xs uppercase tracking-wider">
                Confirmar contraseña
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">{error}</p>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#00b8b4] text-[#0f172a] hover:bg-[#00a39f] font-semibold uppercase tracking-wider text-xs h-11"
            >
              {status === "loading" ? "Guardando..." : "Guardar nueva contraseña"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              <Link href="/admin/login" className="text-[#00b8b4] hover:underline">
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
