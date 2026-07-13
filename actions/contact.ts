"use server"

import { Resend } from "resend"
import { createContact } from "@/lib/contacts"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "formulario@thinkoconsulting.com"
const CONTACT_EMAIL = "amotta@thinkoconsulting.com"
const WEBHOOK_URL = "https://hook.us2.make.com/r8r6fwmz5z0421iyoazgcf8rlfxc105y"

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  phone?: string
  subject?: string
}

function generateEmailHTML(data: ContactFormData): string {
  const rows = [
    ["Nombre", data.name],
    ["Email", `<a href="mailto:${data.email}" style="color:#00b8b4;text-decoration:none">${data.email}</a>`],
    data.company ? ["Empresa", data.company] : null,
    data.phone   ? ["Teléfono", data.phone]   : null,
    data.subject ? ["Asunto", data.subject]   : null,
  ]
    .filter(Boolean)
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 16px;background:#f8fafc;font-weight:600;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
        <td style="padding:10px 16px;color:#0f172a;font-size:13px;border-left:1px solid #e2e8f0">${value}</td>
      </tr>`)
    .join('<tr style="border-top:1px solid #e2e8f0"><td colspan="2"></td></tr>')

  const timestamp = new Date().toLocaleString("es-ES", { timeZone: "America/Bogota", dateStyle: "long", timeStyle: "short" })

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
            <h1 style="margin:6px 0 4px;font-size:20px;font-weight:700;color:#ffffff">Nuevo mensaje de contacto</h1>
            <p style="margin:0;font-size:12px;color:#64748b">${timestamp}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px 0">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;border-collapse:collapse">
              ${rows}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 0">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:600;color:#64748b">Mensaje</p>
            <div style="background:#f8fafc;border-left:3px solid #00b8b4;padding:16px 20px;border-radius:0 4px 4px 0;color:#0f172a;font-size:14px;line-height:1.7;white-space:pre-wrap">${data.message}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px">
            <a href="mailto:${data.email}" style="display:inline-block;background:#00b8b4;color:#0f172a;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:12px 24px;text-decoration:none;border-radius:2px">Responder a ${data.name}</a>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:14px 36px;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:12px;color:#94a3b8">Generado desde el formulario de <a href="https://thinkoconsulting.com" style="color:#00b8b4;text-decoration:none">thinkoconsulting.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    // Save to database first (optional - continue even if this fails)
    const contactResult = await createContact({
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
      phone: data.phone,
      subject: data.subject,
    })
    
    if (!contactResult) {
      console.warn("[v0] Failed to save contact to database, continuing with email...")
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: data.email,
      subject: `Nuevo contacto: ${data.name}${data.company ? ` — ${data.company}` : ""}`,
      html: generateEmailHTML(data),
    })

    if (emailResult.error) {
      console.error("[v0] Email error:", emailResult.error)
      return {
        success: false,
        error: "Error al enviar el email",
      }
    }

    // Send to webhook (Make) if configured
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: "thinko-consulting-website",
        }),
      })
    } catch (webhookError) {
      console.error("[v0] Webhook error:", webhookError)
      // Don't fail the whole request if webhook fails
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Contact form submission error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido" 
    }
  }
}
