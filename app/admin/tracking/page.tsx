import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { TrackingEditor } from "@/components/admin/tracking-editor"
import { loadTrackingCodes } from "@/app/actions/tracking"
import { getSessionUser, canManageUsers, canEditTracking, ROLE_LABELS } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export default async function TrackingPage() {
  const session = await getSessionUser()
  if (!session) redirect("/admin/login")
  if (!canEditTracking(session.role)) redirect("/admin")

  const initial = await loadTrackingCodes()

  return (
    <>
      <AdminHeader
        email={session.email}
        roleLabel={ROLE_LABELS[session.role]}
        canManageUsers={canManageUsers(session.role)}
      />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#00b8b4] transition-colors mb-6 inline-block"
        >
          ← Volver al panel
        </Link>
        <h1 className="font-headline text-3xl font-light text-white mb-2">Códigos de seguimiento</h1>
        <p className="text-slate-400 text-sm mb-10 leading-relaxed">
          Agrega los scripts de analítica y seguimiento que se cargarán en el encabezado del sitio.
        </p>

        <TrackingEditor initial={initial} />
      </main>
    </>
  )
}
