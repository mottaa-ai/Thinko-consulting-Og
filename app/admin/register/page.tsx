import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AdminRegisterForm } from "@/components/admin/admin-register-form"

export const metadata = {
  title: "Crear cuenta | Thinko Consulting",
}

export default async function RegisterPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect("/admin")
  return <AdminRegisterForm />
}
