import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { getSessionUser, canManageUsers, canEditTracking, ROLE_LABELS } from "@/lib/permissions"

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
  const current = await getSessionUser()
  if (!current) redirect("/admin/login")

  const manageUsers = canManageUsers(current.role)
  const editTracking = canEditTracking(current.role)

  return (
    <>
      <AdminHeader
        email={current.email}
        roleLabel={ROLE_LABELS[current.role]}
        canManageUsers={manageUsers}
      />
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

        {(manageUsers || editTracking) && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-5">
              Administración
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {manageUsers && (
                <Link
                  href="/admin/usuarios"
                  className="group block border border-slate-800 bg-[#1e293b]/50 p-6 hover:border-[#00b8b4] transition-colors"
                >
                  <h3 className="font-headline text-lg font-light text-white mb-2 group-hover:text-[#00b8b4] transition-colors">
                    Gestión de usuarios
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Crea cuentas, asigna roles y administra los accesos al panel.
                  </p>
                </Link>
              )}
              {editTracking && (
                <Link
                  href="/admin/tracking"
                  className="group block border border-slate-800 bg-[#1e293b]/50 p-6 hover:border-[#00b8b4] transition-colors"
                >
                  <h3 className="font-headline text-lg font-light text-white mb-2 group-hover:text-[#00b8b4] transition-colors">
                    Códigos de seguimiento
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Configura Meta Pixel, Google Analytics y Tag Manager en el encabezado del sitio.
                  </p>
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
