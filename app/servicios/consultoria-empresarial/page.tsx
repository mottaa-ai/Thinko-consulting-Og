"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function ConsultoriaEmpresarialPage() {
  const t = useTranslation('services')
  const service = t.services[2] // consultoria-empresarial

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-32 px-8 md:px-24 bg-slate-950 scroll-mt-20">
          <Link 
            href="/servicios"
            className="flex items-center gap-2 text-[#00b8b4] hover:text-teal-400 transition-colors mb-12 font-semibold text-sm uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Servicios
          </Link>
          
          <div className="max-w-4xl">
            <span className="text-[5rem] font-light text-[#00b8b4]/20 block">03</span>
            <h1 className="font-headline text-6xl md:text-7xl font-light text-white mb-8 tracking-tight">
              {service.title}
            </h1>
            <div className="h-[2px] w-16 bg-[#00b8b4] mb-8" />
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-3xl">
              {service.description}
            </p>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-32 px-8 md:px-24 bg-white">
          <div className="max-w-5xl">
            <span className="text-xs uppercase tracking-widest text-[#00b8b4] font-semibold block mb-4">
              {service.sectionTitle}
            </span>
            <h2 className="font-headline text-4xl md:text-5xl font-light text-foreground mb-16 tracking-tight">
              {service.sectionTitle}
            </h2>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {(service.items ?? []).map((item: any, index: number) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#00b8b4] text-white font-semibold text-sm flex-shrink-0 mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-headline text-2xl font-medium text-foreground">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-on-surface-variant font-light text-base leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-8 md:px-24 bg-surface-container-low">
          <div className="max-w-5xl">
            <h3 className="font-headline text-2xl font-medium text-foreground mb-8">Áreas de Especialización</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {service.features.map((feature: string, index: number) => (
                <div key={index} className="p-6 bg-white border border-slate-200 hover:border-[#00b8b4] transition-colors">
                  <p className="text-sm font-semibold text-foreground text-center">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
