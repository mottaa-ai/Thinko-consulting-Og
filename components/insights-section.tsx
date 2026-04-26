"use client"

import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Article {
  id: string
  title: string
  slug?: string
  link: string
  date: string
  category: string
  author?: string
  excerpt?: string
  coverImage?: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function InsightsSection() {
  const t = useTranslation("insights")
  const { data, isLoading } = useSWR<{ articles: Article[] }>("/api/insights", fetcher, {
    revalidateOnFocus: false,
  })

  const liveArticles = data?.articles ?? []
  const fallbackArticles: Article[] = (t.articles ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    link: "#",
    date: a.date,
    category: a.category,
    excerpt: a.excerpt,
  }))
  const articles = liveArticles.length > 0 ? liveArticles.slice(0, 4) : fallbackArticles

  return (
    <section className="py-32 px-8 md:px-12 bg-white" id="insights">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold">
              {t.label}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-light mt-4 text-foreground tracking-tight">
              {t.title}
            </h2>
            <div className="mt-8 h-[2px] w-16 bg-[#00b8b4]" />
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground hover:text-[#00b8b4] transition-colors font-semibold"
          >
            Ver todas las publicaciones
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-slate-100 mb-6" />
                <div className="h-3 bg-slate-100 w-32 mb-4" />
                <div className="h-6 bg-slate-100 w-full mb-2" />
                <div className="h-6 bg-slate-100 w-3/4" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-on-surface-variant font-light text-lg">
              Próximamente publicaremos nuevos artículos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {articles.map((article) => (
              <InsightCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function InsightCard({ article }: { article: Article }) {
  const isExternal = article.link.startsWith("http")

  return (
    <Link
      href={article.link}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block"
    >
      <div className="relative aspect-[16/10] bg-slate-100 mb-6 overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="font-headline text-7xl text-slate-300">T</span>
          </div>
        )}
        <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/0 group-hover:bg-[#00b8b4] transition-all">
          <ArrowUpRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] tracking-[0.3em] text-[#00b8b4] uppercase font-semibold">
          {article.category}
        </span>
        <span className="w-1 h-1 bg-on-surface-variant rounded-full" />
        <span className="text-[10px] tracking-[0.3em] text-on-surface-variant uppercase font-semibold">
          {article.date}
        </span>
      </div>
      <h3 className="font-headline text-2xl md:text-3xl font-medium text-foreground group-hover:text-[#00b8b4] transition-colors leading-snug tracking-tight mb-3">
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
