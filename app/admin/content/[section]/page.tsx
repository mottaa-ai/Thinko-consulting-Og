import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { ContentEditor } from "@/components/admin/content-editor"
import { loadSection } from "@/app/actions/content"

// Bundled defaults per locale
import heroEs from "@/content/es/hero.json"
import heroEn from "@/content/en/hero.json"
import philosophyEs from "@/content/es/philosophy.json"
import philosophyEn from "@/content/en/philosophy.json"
import servicesEs from "@/content/es/services.json"
import servicesEn from "@/content/en/services.json"
import visionEs from "@/content/es/vision.json"
import visionEn from "@/content/en/vision.json"
import contactEs from "@/content/es/contact.json"
import contactEn from "@/content/en/contact.json"
import footerEs from "@/content/es/footer.json"
import footerEn from "@/content/en/footer.json"

export const dynamic = "force-dynamic"

const SECTIONS: Record<string, { label: string; defaults: { es: unknown; en: unknown } }> = {
  hero: { label: "Hero principal", defaults: { es: heroEs, en: heroEn } },
  philosophy: { label: "Nuestro enfoque", defaults: { es: philosophyEs, en: philosophyEn } },
  services: { label: "Servicios", defaults: { es: servicesEs, en: servicesEn } },
  vision: { label: "Visión", defaults: { es: visionEs, en: visionEn } },
  contact: { label: "Contacto", defaults: { es: contactEs, en: contactEn } },
  footer: { label: "Pie de página", defaults: { es: footerEs, en: footerEn } },
}

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const config = SECTIONS[section]
  if (!config) notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/admin/login")

  const [storedEs, storedEn] = await Promise.all([
    loadSection(section, "es"),
    loadSection(section, "en"),
  ])

  return (
    <>
      <AdminHeader email={session.user.email} />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#00b8b4] transition-colors mb-6 inline-block"
        >
          ← Volver al panel
        </Link>
        <h1 className="font-headline text-3xl font-light text-white mb-2">{config.label}</h1>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed">
          Edita los textos para cada idioma. Usa el selector para cambiar entre español e inglés.
        </p>

        <ContentEditor
          section={section}
          label={config.label}
          defaults={config.defaults as { es: unknown; en: unknown }}
          stored={{ es: storedEs, en: storedEn }}
        />
      </main>
    </>
  )
}
