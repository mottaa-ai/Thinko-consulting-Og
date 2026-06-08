"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(
        error.message === "Invalid email or password"
          ? "Correo o contraseña incorrectos."
          : (error.message ?? "Ocurrió un error. Intenta de nuevo."),
      )
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="block text-xs uppercase tracking-[0.3em] text-[#00b8b4] mb-4 font-semibold">
            Panel de administración
          </span>
          <h1 className="font-headline text-3xl font-light text-white leading-tight">Thinko Consulting</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Ingresa para editar los contenidos del sitio.
          </p>
        </div>

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
              className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-slate-300 text-xs uppercase tracking-wider">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00b8b4] text-[#0f172a] hover:bg-[#00a39f] font-semibold uppercase tracking-wider text-xs h-11"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </main>
  )
}
