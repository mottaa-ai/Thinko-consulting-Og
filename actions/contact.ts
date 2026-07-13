"use server"

import { Resend } from "resend"
import { createContact } from "@/lib/contacts"

const resend = new Resend(process.env.RESEND_API_KEY)
const WEBHOOK_URL = "https://hook.us2.make.com/r8r6fwmz5z0421iyoazgcf8rlfxc105y"
const CONTACT_EMAIL = "amotta@thinkoconsulting.com"

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  phone?: string
  subject?: string
}

function generateEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { border-bottom: 2px solid #00b8b4; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #0f172a; font-size: 24px; }
          .header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
          .content { margin: 30px 0; }
          .field { margin-bottom: 20px; }
          .label { font-weight: 600; color: #00b8b4; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { margin-top: 5px; padding: 12px; background-color: #f5f5f5; border-left: 3px solid #00b8b4; }
          .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #00b8b4; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
          .timestamp { color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nuevo Contacto desde el Sitio Web</h1>
            <p class="timestamp">${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">Nombre</div>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">Empresa</div>
              <div class="value">${data.company || "No especificada"}</div>
            </div>
            
            <div class="field">
              <div class="label">Mensaje</div>
              <div class="message-box">${data.message.replace(/\n/g, "<br>")}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Este email fue generado automáticamente por el formulario de contacto del sitio web de Thinko Consulting.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Save to database first
    await createContact({
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
      phone: data.phone,
      subject: data.subject,
    })

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: "formulario@thinkoconsulting.com",
      to: CONTACT_EMAIL,
      subject: `Nuevo contacto: ${data.name} (${data.company || "Sin empresa"})`,
      html: generateEmailHTML(data),
      replyTo: data.email,
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
