"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { BarChart3, Landmark, Target } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "opinion-publica": BarChart3,
  "asuntos-publicos": Landmark,
  "consultoria-empresarial": Target,
}

export default function ServiciosPage() {
  const t = useTranslation('services')

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-32 px-8 md:px-24 bg-slate-950 scroll-mt-20">
          <div className="max-w-4xl">
            <span className="text-xs uppercase tracking-widest text-[#00b8b4] font-semibold block mb-6">
              {t.label}
            </span>
            <h1 className="font-headline text-6xl md:text-7xl font-light text-white mb-8 tracking-tight">
              {t.title}
            </h1>
            <div className="h-[2px] w-16 bg-[#00b8b4] mb-8" />
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              Tres áreas de expertise integradas para resolver desafíos complejos en entornos políticos, sociales y corporativos.
            </p>
          </div>
        </section>

        {/* Services Cards */}
        <section className="py-32 px-8 md:px-24 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {t.services.map((service, index) => {
              const Icon = iconMap[service.id]
              return (
                <Link
                  key={service.id}
                  href={`/servicios/${service.id}`}
                  className="group no-underline"
                >
                  <div className="flex flex-col h-full">
                    {/* Number and Icon */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[4rem] font-light text-[#00b8b4]/20">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {Icon && (
                        <div className="w-12 h-12 flex items-center justify-center border border-slate-300 group-hover:border-[#00b8b4] group-hover:bg-[#00b8b4]/10 transition-all">
                          <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#00b8b4] transition-colors" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-headline text-3xl md:text-4xl font-medium text-foreground mb-4 group-hover:text-[#00b8b4] transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-on-surface-variant font-light text-base leading-relaxed mb-8 flex-grow min-h-[120px]">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-3 text-[#00b8b4] font-semibold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      Ver más <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
