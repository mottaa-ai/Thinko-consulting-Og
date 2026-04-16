"use client"

import { BarChart3, Landmark, Target } from "lucide-react"
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
    <section className="py-32 px-8 md:px-24 bg-surface" id="services">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-on-surface-variant">
            {t.label}
          </span>
          <h2 className="font-serif text-5xl font-light mt-4">{t.title}</h2>
        </div>
        <div className="hidden md:block h-[1px] bg-outline-variant w-1/3 opacity-20 mb-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {t.services.map((service, index) => (
          <ServiceCard 
            key={service.id} 
            number={String(index + 1).padStart(2, '0')}
            title={service.title}
            description={service.description}
            features={service.features}
            icon={iconMap[service.id] || BarChart3}
          />
        ))}
      </div>
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
    <div className="group p-12 bg-surface-container hover:bg-surface-container-highest transition-colors duration-500 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <Icon className="w-10 h-10" />
      </div>
      <div>
        <span className="text-xs font-bold text-on-primary-container tracking-widest uppercase">
          {number}
        </span>
        <h3 className="font-serif text-3xl font-light mt-8 mb-4">{title}</h3>
        <p className="text-on-surface-variant font-light mb-6 text-sm leading-relaxed">{description}</p>
        <ul className="space-y-4 text-on-surface-variant font-light">
          {features.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="w-1 h-1 bg-[#E1CEE1]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12">
        <div className="w-4 h-4 bg-[#E1CEE1]" />
      </div>
    </div>
  )
}
