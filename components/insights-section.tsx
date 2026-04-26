"use client"

import Link from "next/link"
import useSWR from "swr"
import { ArrowUpRight } from "lucide-react"
import { useTranslation, useI18n } from "@/lib/i18n"

interface Article {
  id: string
  title: string
  link: string
  date: string
  category: string
  author?: string
  excerpt?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function InsightsSection() {
  const t = useTranslation("insights")
  const { locale } = useI18n()
  const { data, isLoading } = useSWR<{ articles: Article[] }>("/api/insights", fetcher, {
    revalidateOnFocus: false,
  })

  const liveArticles = data?.articles ?? []
  // Use live articles if available, otherwise show fallback i18n articles
  const fallbackArticles: Article[] = (t.articles ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    link: "#",
    date: a.date,
    category: a.category,
    excerpt: a.excerpt,
  }))
  const articles = liveArticles.length > 0 ? liveArticles : fallbackArticles
  const isLive = liveArticles.length > 0

  return (
    <section className="py-32 px-8 md:px-24 bg-white" id="insights">
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
        {isLive && (
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-on-surface-variant font-semibold">
            <span className="w-2 h-2 bg-[#00b8b4] animate-pulse" />
            {locale === "en" ? "Live from La Razón" : "En vivo desde La Razón"}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-t border-slate-200 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-pulse"
            >
              <div className="md:col-span-2 h-3 bg-slate-200 w-24" />
              <div className="md:col-span-7 space-y-3">
                <div className="h-3 bg-slate-200 w-32" />
                <div className="h-6 bg-slate-200 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {articles.map((article, index) => (
            <InsightPost
              key={article.id}
              article={article}
              isLast={index === articles.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function InsightPost({ article, isLast }: { article: Article; isLast: boolean }) {
  const isExternal = article.link.startsWith("http")
  
  return (
    <Link
      href={article.link}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`group block border-t ${isLast ? "border-b" : ""} border-slate-200 py-10 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start hover:bg-slate-50 transition-colors px-4 -mx-4`}
    >
      <div className="md:col-span-2 text-[10px] font-semibold tracking-[0.3em] text-on-surface-variant uppercase pt-1">
        {article.date}
      </div>
      <div className="md:col-span-8">
        <span className="text-[10px] tracking-[0.3em] text-[#00b8b4] uppercase mb-3 block font-semibold">
          {article.category}
        </span>
        <h3 className="font-headline text-xl md:text-2xl font-medium text-foreground group-hover:text-[#00b8b4] transition-colors leading-snug tracking-tight">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-3 text-sm text-on-surface-variant font-light leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
      <div className="md:col-span-2 flex justify-start md:justify-end pt-1">
        <div className="w-10 h-10 flex items-center justify-center border border-slate-200 group-hover:border-[#00b8b4] group-hover:bg-[#00b8b4] transition-all">
          <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  )
}
