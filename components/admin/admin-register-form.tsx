"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminRegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    setLoading(true)

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(
        error.message === "User already exists"
          ? "Ya existe una cuenta con ese correo."
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
          <h1 className="font-headline text-3xl font-light text-white leading-tight">Crear cuenta</h1>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Registra tu usuario para acceder al administrador.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-slate-300 text-xs uppercase tracking-wider">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Tu nombre completo"
              className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
            />
          </div>

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
              placeholder="admin@ejemplo.com"
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
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className="bg-[#1e293b] border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-[#00b8b4]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" className="text-slate-300 text-xs uppercase tracking-wider">
              Confirmar contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Repite la contraseña"
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/admin/login" className="text-[#00b8b4] hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </main>
  )
}
