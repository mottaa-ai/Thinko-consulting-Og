"use client"

import Link from "next/link"
import { BarChart3, Landmark, Target, ArrowUpRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "opinion-publica": BarChart3,
  "public-opinion": BarChart3,
  "asuntos-publicos": Landmark,
  "public-affairs": Landmark,
  "consultoria-empresarial": Target,
  "business-consulting": Target,
}

export function ServicesSection() {
  const t = useTranslation('services')

  return (
    <section className="py-32 px-8 md:px-24 bg-surface scroll-mt-20" id="services">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#00b8b4] font-semibold">
            {t.label}
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-light mt-4 text-foreground tracking-tight">
            {t.title}
          </h2>
          <div className="mt-8 h-[2px] w-16 bg-[#00b8b4]" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-slate-200">
        {t.services.map((service, index) => (
          <Link
            key={service.id}
            href={`/servicios/${service.id}`}
            className="no-underline"
          >
            <ServiceCard 
              number={String(index + 1).padStart(2, '0')}
              title={service.title}
              description={service.description}
              features={service.features}
              icon={iconMap[service.id] || BarChart3}
            />
          </Link>
        ))}
      </div>
      
      {/* TODO: Insert PPT content here */}
    </section>
  )
}

function ServiceCard({
  number,
  title,
  description,
  features,
  icon: Icon,
}: {
  number: string
  title: string
  description: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="group p-12 bg-white hover:bg-[#0f172a] transition-colors duration-500 min-h-[520px] flex flex-col justify-between relative overflow-hidden cursor-pointer">
      {/* Icon */}
      <div className="absolute top-6 right-6 transition-all duration-500">
        <div className="w-12 h-12 flex items-center justify-center border border-slate-300 group-hover:border-[#00b8b4] group-hover:bg-[#00b8b4]/10 transition-all">
          <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#00b8b4] transition-colors" />
        </div>
      </div>

      <div>
        <span className="text-xs font-bold text-[#00b8b4] tracking-[0.3em] uppercase">
          {number}
        </span>
        <h3 className="font-headline text-2xl md:text-3xl font-medium mt-8 mb-4 text-foreground group-hover:text-white transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-on-surface-variant group-hover:text-slate-300 font-light mb-8 text-sm leading-relaxed transition-colors">
          {description}
        </p>
        <ul className="space-y-3 text-on-surface-variant group-hover:text-slate-300 font-light text-sm transition-colors">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#00b8b4] mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-200 group-hover:border-slate-700 transition-colors">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-on-surface-variant group-hover:text-[#00b8b4] transition-colors">
          Expertise
        </span>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00b8b4] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </div>
  )
}
