import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { ArticleForm } from "@/components/admin/article-form"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSessionUser, canManageUsers, ROLE_LABELS } from "@/lib/permissions"

export const dynamic = "force-dynamic"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const current = await getSessionUser()
  if (!current) redirect("/admin/login")

  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, parseInt(id)))
  if (!article) notFound()

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
        <h1 className="font-headline text-3xl font-light text-white mb-2">Editar publicación</h1>
        <a
          href={`/blog/${article.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#00b8b4] hover:underline mb-8 inline-block"
        >
          Ver en el sitio →
        </a>
        <ArticleForm
          pageId={article.id.toString()}
          initial={{
            title: article.title,
            slug: article.slug,
            author: article.author ?? "",
            category: article.category ?? "",
            excerpt: article.excerpt ?? "",
            coverImage: article.imageUrl ?? "",
            status: article.isPublished ? "Publicado" : "Draft",
            seoTitle: "",
            seoDescription: "",
          }}
        />
      </main>
    </>
  )
}
