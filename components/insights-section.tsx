"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function InsightsSection() {
  const t = useTranslation('insights')

  return (
    <section className="py-32 px-8 md:px-24 bg-surface" id="insights">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-on-surface-variant">
            {t.label}
          </span>
          <h2 className="font-serif text-5xl font-light mt-4">{t.title}</h2>
        </div>
      </div>
      
      <div className="space-y-0">
        {t.articles.map((article, index) => (
          <InsightPost 
            key={article.id} 
            date={article.date}
            category={article.category}
            title={article.title}
            isLast={index === t.articles.length - 1} 
          />
        ))}
      </div>
    </section>
  )
}

function InsightPost({
  date,
  category,
  title,
  isLast,
}: {
  date: string
  category: string
  title: string
  isLast: boolean
}) {
  return (
    <div 
      className={`group border-t ${isLast ? 'border-b' : ''} border-outline-variant/20 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:bg-surface-container-low transition-colors px-4 -mx-4`}
    >
      <div className="md:col-span-2 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
        {date}
      </div>
      <div className="md:col-span-7">
        <span className="text-[10px] tracking-widest text-tertiary uppercase mb-2 block">
          {category}
        </span>
        <h3 className="font-serif text-2xl font-light group-hover:italic transition-all">
          {title}
        </h3>
      </div>
      <div className="md:col-span-3 flex justify-start md:justify-end">
        <Link 
          href="#" 
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase group"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
