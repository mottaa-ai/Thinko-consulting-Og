import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  getArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return { title: "Artículo no encontrado | Thinko Consulting" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  const url = `${baseUrl}/blog/${article.slug}`

  return {
    title: `${article.title} | Thinko Consulting`,
    description: article.excerpt,
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      type: "article",
      url,
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.author ? [article.author] : undefined,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || "",
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  }
}

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const allArticles = await getPublishedArticles()
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl || undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: article.author || "Thinko Consulting",
    },
    publisher: {
      "@type": "Organization",
      name: "Thinko Consulting",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${article.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Article Header */}
        <article className="pt-40 pb-24">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-on-surface-variant hover:text-[#00b8b4] transition-colors font-semibold mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Todas las publicaciones
            </Link>

            <div className="flex items-center gap-4 mb-8">
              {article.category && (
                <span className="text-[10px] tracking-[0.3em] text-[#00b8b4] uppercase font-semibold">
                  {article.category}
                </span>
              )}
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-light leading-tight text-foreground tracking-tight mb-8">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed mb-12">
                {article.excerpt}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pb-8 border-b border-slate-200">
              {article.author && (
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold mb-1">
                    Autor
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {article.author}
                  </span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold mb-1 inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Publicado
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              )}
              {article.sourceName && (
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold mb-1">
                    Fuente
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {article.sourceName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cover image */}
          {article.imageUrl && (
            <div className="max-w-5xl mx-auto px-6 md:px-8 my-12">
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="max-w-3xl mx-auto px-6 md:px-8 mt-12">
            {article.content ? (
              <div className="prose-custom max-w-none">
                <div className="text-base leading-relaxed text-on-surface-variant">
                  {article.content}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 mb-8">
                <p className="text-on-surface-variant font-medium mb-3">
                  Este artículo proviene de una fuente externa.
                </p>
                {article.sourceUrl && (
                  <Link
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00b8b4] hover:text-[#009899] font-medium transition-colors"
                  >
                    Leer artículo original en {article.sourceName}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}

            {/* Source attribution */}
            {article.sourceUrl && article.sourceName && (
              <div className="mt-12 p-6 bg-slate-50 border-l-4 border-[#00b8b4]">
                <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold mb-2 block">
                  Publicado originalmente en
                </span>
                <Link
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:text-[#00b8b4] transition-colors"
                >
                  {article.sourceName}
                </Link>
              </div>
            )}
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-slate-50 py-24 px-8 md:px-12">
            <div className="max-w-[1600px] mx-auto">
              <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-4 block">
                Continúa leyendo
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-light text-foreground tracking-tight mb-12">
                Artículos relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] bg-white mb-6 overflow-hidden">
                      {rel.imageUrl ? (
                        <Image
                          src={rel.imageUrl}
                          alt={rel.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                      )}
                    </div>
                    <span className="text-[10px] tracking-[0.3em] text-[#00b8b4] uppercase font-semibold mb-2 block">
                      {rel.category}
                    </span>
                    <h3 className="font-headline text-xl font-medium text-foreground group-hover:text-[#00b8b4] transition-colors leading-snug tracking-tight">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
