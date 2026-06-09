import { redirect } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { ArticleForm } from "@/components/admin/article-form"
import { getSessionUser, canManageUsers, ROLE_LABELS } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export default async function NewArticlePage() {
  const current = await getSessionUser()
  if (!current) redirect("/admin/login")

  return (
    <>
      <AdminHeader
        email={current.email}
        roleLabel={ROLE_LABELS[current.role]}
        canManageUsers={canManageUsers(current.role)}
      />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/admin/blog"
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#00b8b4] transition-colors mb-6 inline-block"
        >
          ← Volver a publicaciones
        </Link>
        <h1 className="font-headline text-3xl font-light text-white mb-8">Nueva publicación</h1>
        <ArticleForm />
      </main>
    </>
  )
}
