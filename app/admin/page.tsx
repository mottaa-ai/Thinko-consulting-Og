import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"

export const dynamic = "force-dynamic"

const EDITABLE_SECTIONS = [
  { key: "hero", label: "Hero principal", description: "Título, subtítulo y etiqueta de la portada." },
  { key: "philosophy", label: "Nuestro enfoque", description: "Texto de la sección de enfoque." },
  { key: "services", label: "Servicios", description: "Listado de servicios y sus descripciones." },
  { key: "vision", label: "Visión", description: "Cita y texto de fondo de la sección de visión." },
  { key: "contact", label: "Contacto", description: "Encabezados e información de contacto." },
  { key: "footer", label: "Pie de página", description: "Tagline y enlaces del footer." },
]

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/admin/login")

  return (
    <>
      <AdminHeader email={session.user.email} />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-headline text-3xl font-light text-white mb-2">Gestión de contenido</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Edita los textos del sitio y administra las publicaciones del blog. Los cambios se publican
            automáticamente en el sitio.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-5">
            Textos del sitio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EDITABLE_SECTIONS.map((s) => (
              <Link
                key={s.key}
                href={`/admin/content/${s.key}`}
                className="group border border-slate-800 bg-[#1e293b]/50 p-6 hover:border-[#00b8b4] transition-colors"
              >
                <h3 className="font-headline text-lg font-light text-white mb-2 group-hover:text-[#00b8b4] transition-colors">
                  {s.label}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-5">
            Publicaciones
          </h2>
          <Link
            href="/admin/blog"
            className="group block border border-slate-800 bg-[#1e293b]/50 p-6 hover:border-[#00b8b4] transition-colors max-w-md"
          >
            <h3 className="font-headline text-lg font-light text-white mb-2 group-hover:text-[#00b8b4] transition-colors">
              Blog y publicaciones
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Crea y edita artículos. Se sincronizan con Notion.
            </p>
          </Link>
        </section>
      </main>
    </>
  )
}
