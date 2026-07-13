import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/admin/reset-password-form"

export const metadata = {
  title: "Nueva contraseña | Thinko Consulting",
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
