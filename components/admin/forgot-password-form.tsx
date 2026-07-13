"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStatus("loading")

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/admin/nueva-contrasena`,
    })

    if (error) {
      setError("No se pudo enviar el correo. Verifica que el email esté registrado.")
      setStatus("error")
      return
    }

    setStatus("sent")
  }

  return (
    <main className="min-h-svh bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="block text-xs uppercase tracking-[0.3em] text-[#00b8b4] mb-4 font-semibold">
            Panel de administración
          </span>
          <h1 className="font-headline text-3xl font-light text-white leading-tight">Recuperar contraseña</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        {status === "sent" ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00b8b4]/10 border border-[#00b8b4]/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10l4 4 8-8" stroke="#00b8b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-white font-medium mb-2">Correo enviado</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Revisa tu bandeja de entrada. El enlace expira en 1 hora.
            </p>
            <Link
              href="/admin/login"
              className="text-[#00b8b4] hover:underline text-sm"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-slate-300 text-xs uppercase tracking-wider">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
              />
            </div>

            {(status === "error" && error) && (
              <p className="text-sm text-red-400" role="alert">{error}</p>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#00b8b4] text-[#0f172a] hover:bg-[#00a39f] font-semibold uppercase tracking-wider text-xs h-11"
            >
              {status === "loading" ? "Enviando..." : "Enviar enlace de recuperación"}
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
