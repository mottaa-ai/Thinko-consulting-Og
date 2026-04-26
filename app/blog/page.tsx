import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPublishedArticles } from "@/lib/notion"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Publicaciones | Thinko Consulting",
  description:
    "Análisis, perspectivas y publicaciones editoriales de Thinko Consulting sobre estrategia, opinión pública y consultoría política.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog`,
  },
  openGraph: {
    title: "Publicaciones | Thinko Consulting",
    description:
      "Análisis, perspectivas y publicaciones editoriales de Thinko Consulting.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blog`,
  },
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default async function BlogPage() {
  const articles = await getPublishedArticles(50)
  const featured = articles.find((a) => a.featured) || articles[0]
  const rest = articles.filter((a) => a.id !== featured?.id)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-48 pb-16 px-8 md:px-12">
          <div className="max-w-[1600px] mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-6 block">
              Publicaciones
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-light leading-tight text-foreground tracking-tight max-w-5xl">
              Análisis y perspectivas
            </h1>
            <div className="mt-8 h-[2px] w-16 bg-[#00b8b4]" />
            <p className="mt-8 max-w-2xl text-lg text-on-surface-variant font-light leading-relaxed">
              Investigación rigurosa, opinión informada y contenido editorial
              elaborado por nuestro equipo de expertos.
            </p>
          </div>
        </section>

        {articles.length === 0 ? (
          <section className="py-32 px-8 md:px-12">
            <div className="max-w-[1600px] mx-auto text-center">
              <p className="text-on-surface-variant font-light text-lg">
                Próximamente publicaremos nuevos artículos.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <section className="px-8 md:px-12 mb-24">
                <div className="max-w-[1600px] mx-auto">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-b border-slate-200 py-12"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      {featured.coverImage ? (
                        <Image
                          src={featured.coverImage || "/placeholder.svg"}
                          alt={featured.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                      )}
                      <div className="absolute top-4 left-4 bg-[#00b8b4] text-white text-[10px] uppercase tracking-[0.3em] font-semibold px-3 py-1.5">
                        Destacado
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-[10px] tracking-[0.3em] text-[#00b8b4] uppercase font-semibold">
                          {featured.category || "Editorial"}
                        </span>
                        <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold">
                          {formatDate(featured.publishedAt)}
                        </span>
                      </div>
                      <h2 className="font-headline text-3xl md:text-5xl font-medium text-foreground group-hover:text-[#00b8b4] transition-colors leading-tight tracking-tight mb-6">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-on-surface-variant font-light leading-relaxed text-lg mb-8 line-clamp-3">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-foreground font-semibold group-hover:text-[#00b8b4] transition-colors">
                        Leer artículo
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* Grid of articles */}
            {rest.length > 0 && (
              <section className="px-8 md:px-12 pb-32">
                <div className="max-w-[1600px] mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {rest.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

function ArticleCard({
  article,
  formatDate,
}: {
  article: any
  formatDate: (s: string) => string
}) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] bg-slate-100 mb-6 overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
        )}
      </div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] tracking-[0.3em] text-[#00b8b4] uppercase font-semibold">
          {article.category || "Editorial"}
        </span>
        <span className="w-1 h-1 bg-on-surface-variant rounded-full" />
        <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold">
          {formatDate(article.publishedAt)}
        </span>
      </div>
      <h3 className="font-headline text-xl md:text-2xl font-medium text-foreground group-hover:text-[#00b8b4] transition-colors leading-snug tracking-tight mb-3">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-sm text-on-surface-variant font-light leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  )
}
