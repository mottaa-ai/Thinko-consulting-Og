/**
 * scripts/resend-credentials.mjs
 * Generates new temporary passwords for all users, updates them in the DB,
 * and sends credentials via Resend.
 *
 * Usage:
 *   node --env-file-if-exists=/vercel/share/.env.project scripts/resend-credentials.mjs
 */

import { scrypt, randomBytes } from "node:crypto"
import { promisify } from "node:util"
import { Resend } from "resend"
import pg from "pg"

const scryptAsync = promisify(scrypt)

// Better Auth default scrypt params
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  const derived = await scryptAsync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 256 * 1024 * 1024 })
  return `${salt}:${derived.toString("hex")}`
}

const { Pool } = pg

// ── Config ──────────────────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@thinkoconsulting.com"
const ADMIN_URL = "https://thinkoconsulting.com/admin"
const SITE_URL = "https://thinkoconsulting.com"

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set")
if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set")

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const resend = new Resend(RESEND_API_KEY)

// ── Password generator ────────────────────────────────────────────────────────
function generatePassword(length = 12) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$"
  let pwd = ""
  for (let i = 0; i < length; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)]
  }
  return pwd
}

function buildCredentialsHtml({ userName, toEmail, password }) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden">
        <tr>
          <td style="background:#0f172a;padding:28px 36px;border-bottom:3px solid #00b8b4">
            <p style="margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#00b8b4;font-weight:600">Thinko Consulting</p>
            <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff">Tus credenciales de acceso</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 36px">
            <p style="margin:0 0 20px;color:#334155;line-height:1.6">
              Hola <strong>${userName}</strong>, tu cuenta ha sido actualizada con una nueva contraseña temporal.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:4px;overflow:hidden;margin-bottom:24px;border-collapse:collapse">
              <tr>
                <td style="padding:12px 16px;background:#f8fafc;font-weight:600;color:#64748b;font-size:13px;white-space:nowrap">Email</td>
                <td style="padding:12px 16px;color:#0f172a;font-size:13px;border-left:1px solid #e2e8f0">${toEmail}</td>
              </tr>
              <tr style="border-top:1px solid #e2e8f0">
                <td style="padding:12px 16px;background:#f8fafc;font-weight:600;color:#64748b;font-size:13px;white-space:nowrap">Contraseña temporal</td>
                <td style="padding:12px 16px;color:#0f172a;font-size:13px;font-family:monospace;letter-spacing:.08em;border-left:1px solid #e2e8f0">${password}</td>
              </tr>
            </table>
            <a href="${ADMIN_URL}" style="display:inline-block;background:#00b8b4;color:#0f172a;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:12px 28px;text-decoration:none;border-radius:2px">Ingresar al panel</a>
            <p style="margin:20px 0 0;font-size:12px;color:#94a3b8">Por seguridad, cambia tu contraseña luego del primer acceso.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:14px 36px;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:12px;color:#94a3b8"><a href="${SITE_URL}" style="color:#00b8b4;text-decoration:none">thinkoconsulting.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const client = await pool.connect()
  try {
    // Fetch all users
    const { rows: users } = await client.query(
      `SELECT u.id, u.name, u.email, a.id as account_id
       FROM "user" u
       JOIN "account" a ON a."userId" = u.id AND a."providerId" = 'credential'
       ORDER BY u."createdAt" ASC`
    )

    console.log(`Found ${users.length} user(s). Processing...\n`)

    for (const user of users) {
      const tempPassword = generatePassword()
      const hashed = await hashPassword(tempPassword)

      // Update the hashed password in the account table
      await client.query(
        `UPDATE "account" SET password = $1 WHERE id = $2`,
        [hashed, user.account_id]
      )

      // Send email via Resend
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Tus credenciales de acceso — Thinko Consulting",
        html: buildCredentialsHtml({
          userName: user.name,
          toEmail: user.email,
          password: tempPassword,
        }),
      })

      if (result.error) {
        console.error(`  ERROR sending to ${user.email}:`, result.error)
      } else {
        console.log(`  Sent to ${user.name} <${user.email}> — email ID: ${result.data?.id}`)
      }
    }

    console.log("\nDone.")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
