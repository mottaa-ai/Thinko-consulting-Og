"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { createInitialAdmin } from "@/app/actions/admin-auth"

export function AdminSetupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      setLoading(false)
      return
    }

    const result = await createInitialAdmin({ name, email, password })

    if (!result.ok) {
      setError(result.error ?? "No se pudo crear la cuenta.")
      setLoading(false)
      return
    }

    // Sign in immediately after creating the account
    const signIn = await authClient.signIn.email({ email, password })
    if (signIn.error) {
      // Account created but sign-in failed; send to login
      router.push("/admin/login")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface border border-outline/40 px-4 py-3 text-foreground focus:border-[#00b8b4] focus:outline-none transition-colors"
          placeholder="Nombre del administrador"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface border border-outline/40 px-4 py-3 text-foreground focus:border-[#00b8b4] focus:outline-none transition-colors"
          placeholder="admin@thinkoconsulting.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface border border-outline/40 px-4 py-3 text-foreground focus:border-[#00b8b4] focus:outline-none transition-colors"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#00b8b4] text-white py-3 px-6 font-semibold uppercase tracking-widest text-sm hover:bg-[#009d99] transition-colors disabled:opacity-50"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta de administrador"}
      </button>
    </form>
  )
}
