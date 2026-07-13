"use server"

import { Resend } from "resend"

const FROM_EMAIL = "noreply@thinkoconsulting.com"
const SITE_URL = "https://thinkoconsulting.com"

export interface SendUserCredentialsEmailProps {
  toEmail: string
  userName: string
  password: string
  adminUrl?: string
  siteUrl?: string
}

export async function sendUserCredentialsEmail({
  toEmail,
  userName,
  password,
  adminUrl = `${SITE_URL}/admin`,
  siteUrl = SITE_URL,
}: SendUserCredentialsEmailProps): Promise<{ success: boolean; error?: string }> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: "Tus credenciales de acceso — Thinko Consulting",
      html: buildCredentialsHtml({ userName, toEmail, password, adminUrl, siteUrl }),
    })

    if (result.error) {
      console.error("[v0] Resend credentials error:", result.error)
      return { success: false, error: "No se pudo enviar el email de credenciales." }
    }

    return { success: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error desconocido"
    console.error("[v0] sendUserCredentialsEmail error:", message)
    return { success: false, error: message }
  }
}

function buildCredentialsHtml({
  userName,
  toEmail,
  password,
  adminUrl,
  siteUrl,
}: {
  userName: string
  toEmail: string
  password: string
  adminUrl: string
  siteUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden">
        <tr>
          <td style="background:#0f172a;padding:28px 36px;border-bottom:3px solid #00b8b4">
            <p style="margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#00b8b4;font-weight:600">Thinko Consulting</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff">Bienvenido al panel de administración</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px">
            <p style="margin:0 0 20px;color:#334155;line-height:1.6">
              Hola <strong>${userName}</strong>, tu cuenta de administrador ha sido creada.
              Usa las credenciales a continuación para ingresar.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;margin-bottom:24px">
              <tr>
                <td style="padding:12px 16px;background:#f8fafc;font-weight:600;color:#64748b;font-size:13px;white-space:nowrap">Email</td>
                <td style="padding:12px 16px;color:#0f172a;font-size:13px">${toEmail}</td>
              </tr>
              <tr style="border-top:1px solid #e2e8f0">
                <td style="padding:12px 16px;background:#f8fafc;font-weight:600;color:#64748b;font-size:13px;white-space:nowrap">Contraseña temporal</td>
                <td style="padding:12px 16px;color:#0f172a;font-size:13px;font-family:monospace;letter-spacing:.05em">${password}</td>
              </tr>
            </table>
            <a href="${adminUrl}" style="display:inline-block;background:#00b8b4;color:#0f172a;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:12px 28px;text-decoration:none;border-radius:2px">Ingresar al panel</a>
            <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">Por seguridad, cambia tu contraseña luego del primer acceso.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:14px 36px;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:12px;color:#94a3b8"><a href="${siteUrl}" style="color:#00b8b4;text-decoration:none">thinkoconsulting.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
