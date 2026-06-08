import { redirect } from "next/navigation"
import { adminAccountExists } from "@/app/actions/admin-auth"
import { AdminSetupForm } from "@/components/admin/admin-setup-form"

export const metadata = {
  title: "Configuración inicial | Thinko Admin",
  robots: { index: false, follow: false },
}

export default async function AdminSetupPage() {
  // Once an admin exists, this page is locked down.
  const exists = await adminAccountExists()
  if (exists) redirect("/admin/login")

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-headline text-3xl font-light text-white mb-3">Configuración inicial</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Crea la primera cuenta de administrador para gestionar el contenido del sitio. Esta página se
            deshabilita automáticamente una vez creada.
          </p>
        </div>
        <div className="bg-surface border border-outline/30 p-8">
          <AdminSetupForm />
        </div>
      </div>
    </main>
  )
}
