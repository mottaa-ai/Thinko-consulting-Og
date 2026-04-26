import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NotionBlocks } from "@/components/notion-blocks"
import {
  getArticleBySlug,
  getArticleBlocks,
  getAllSlugs,
  getPublishedArticles,
} from "@/lib/notion"

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

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
    title: `${article.seoTitle || article.title} | Thinko Consulting`,
    description: article.seoDescription || article.excerpt,
    keywords: article.tags.join(", "),
    authors: article.author ? [{ name: article.author }] : undefined,
    alternates: {
      canonical: article.canonicalUrl || url,
    },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: "article",
      url,
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
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

  const [blocks, allArticles] = await Promise.all([
    getArticleBlocks(article.id),
    getPublishedArticles(50),
  ])

  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: article.coverImage || undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
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
              {article.readingTime && (
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold mb-1 inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Lectura
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {article.readingTime} min
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cover image */}
          {article.coverImage && (
            <div className="max-w-5xl mx-auto px-6 md:px-8 my-12">
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
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
            <div className="prose-custom">
              <NotionBlocks blocks={blocks} />
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-slate-200">
                <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold mb-4 block">
                  Etiquetas
                </span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-widest font-semibold bg-slate-100 text-foreground px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source attribution */}
            {article.sourceUrl && article.source && (
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
                  {article.source}
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
                      {rel.coverImage ? (
                        <Image
                          src={rel.coverImage || "/placeholder.svg"}
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
