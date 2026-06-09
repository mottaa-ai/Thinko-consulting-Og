"use server"

import { Resend } from "resend"
import { UserCredentialsEmail } from "@/lib/emails/user-credentials"
import { render } from "@react-email/components"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendUserCredentialsEmailProps {
  toEmail: string
  userName: string
  password: string
  adminUrl: string
  siteUrl: string
}

/**
 * Sends credentials email to a newly created user.
 * The email contains their temporary password and instructions to access the admin panel.
 */
export async function sendUserCredentialsEmail({
  toEmail,
  userName,
  password,
  adminUrl,
  siteUrl,
}: SendUserCredentialsEmailProps): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(
      UserCredentialsEmail({
        userName,
        email: toEmail,
        password,
        adminUrl,
        siteUrl,
      })
    )

    const result = await resend.emails.send({
      from: "noreply@thinkoconsulting.com",
      to: toEmail,
      subject: "Tus credenciales de acceso - Thinko Consulting",
      html,
    })

    if (result.error) {
      console.error("[v0] Resend error:", result.error)
      return { success: false, error: "No se pudo enviar el email de credenciales" }
    }

    return { success: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido"
    console.error("[v0] sendUserCredentialsEmail error:", message)
    return { success: false, error: message }
  }
}
