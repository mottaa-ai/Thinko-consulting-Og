import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { getAllArticlesForAdmin } from "@/lib/notion"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/admin/login")

  const articles = await getAllArticlesForAdmin()

  return (
    <>
      <AdminHeader email={session.user.email} />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#00b8b4] transition-colors mb-6 inline-block"
        >
          ← Volver al panel
        </Link>

        <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="font-headline text-3xl font-light text-white mb-2">Publicaciones</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Crea y edita artículos. Se sincronizan con Notion.
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-[#00b8b4] text-[#0f172a] py-3 px-6 font-semibold uppercase tracking-wider text-xs hover:bg-[#00a39f] transition-colors whitespace-nowrap"
          >
            Nueva publicación
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="text-slate-500 text-sm border border-slate-800 p-8 text-center">
            No hay publicaciones todavía. Crea la primera con el botón de arriba.
          </p>
        ) : (
          <div className="border border-slate-800 divide-y divide-slate-800">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/admin/blog/${a.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[#1e293b]/50 transition-colors group"
              >
                <div className="min-w-0">
                  <h3 className="text-white font-medium truncate group-hover:text-[#00b8b4] transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {a.category || "Sin categoría"}
                    {a.publishedAt ? ` · ${a.publishedAt}` : ""}
                  </p>
                </div>
                <span
                  className={`text-xs uppercase tracking-wider px-3 py-1 whitespace-nowrap ${
                    a.status === "Publicado" || a.status === "Published"
                      ? "bg-[#00b8b4]/15 text-[#00b8b4]"
                      : "bg-slate-700/40 text-slate-400"
                  }`}
                >
                  {a.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
