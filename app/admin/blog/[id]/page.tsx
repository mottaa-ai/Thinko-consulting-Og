import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { ArticleForm } from "@/components/admin/article-form"
import { getAdminArticleById } from "@/lib/notion"

export const dynamic = "force-dynamic"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/admin/login")

  const article = await getAdminArticleById(id)
  if (!article) notFound()

  return (
    <>
      <AdminHeader email={session.user.email} />
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
          pageId={article.id}
          initial={{
            title: article.title,
            slug: article.slug,
            author: article.author,
            category: article.category,
            excerpt: article.excerpt,
            coverImage: article.coverImage ?? "",
            status: article.status,
            seoTitle: article.seoTitle,
            seoDescription: article.seoDescription,
          }}
        />
      </main>
    </>
  )
}
