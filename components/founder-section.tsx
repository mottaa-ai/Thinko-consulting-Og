"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n"

const founderContent = {
  es: {
    label: "Liderazgo",
    name: "Alejandro Motta Nicolicchia",
    title: "Socio Director",
    description: [
      "22 años de experiencia apoyando a organizaciones públicas y privadas en el diseño de soluciones basadas en información confiable, análisis riguroso y visión estratégica.",
      "A lo largo de su trayectoria, la firma ha trabajado para más de 80 clientes combinando investigación y comunicación estratégica; consolidando experiencia en distintos sectores y contextos. Alejandro ha participado en proyectos en Hispanoamérica, lo que le permite integrar perspectivas globales con conocimiento local."
    ]
  },
  en: {
    label: "Leadership",
    name: "Alejandro Motta Nicolicchia",
    title: "Managing Partner",
    description: [
      "22 years of experience supporting public and private organizations in designing solutions based on reliable information, rigorous analysis, and strategic vision.",
      "Throughout his career, the firm has worked for more than 80 clients combining research and strategic communication; consolidating experience in different sectors and contexts. Alejandro has participated in projects throughout Latin America, which allows him to integrate global perspectives with local knowledge."
    ]
  }
}

export function FounderSection() {
  const { locale } = useI18n()
  const t = founderContent[locale] || founderContent.es

  return (
    <section className="py-32 px-8 md:px-24 bg-[#0f172a] text-white" id="founder">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Photo */}
        <div className="md:col-span-5">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:mx-0 overflow-hidden group">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alejandro%20Motta%20Nicolicchia-FLtoQSD04EfBzsHHcIfvMa6n866Bry.png"
              alt={t.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 right-4 h-2 w-2 bg-[#00b8b4]" />
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-6 md:col-start-7 space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#00b8b4] mb-4 block font-semibold">
            {t.label}
          </span>
          <div className="space-y-2">
            <h2 className="font-headline text-4xl md:text-5xl font-light text-white leading-tight">
              {t.name}
            </h2>
            <p className="text-base text-slate-300 font-medium uppercase tracking-widest">
              {t.title}
            </p>
          </div>
          <div className="h-[2px] w-16 bg-[#00b8b4] my-6" />
          <div className="space-y-6">
            {t.description.map((paragraph, index) => (
              <p key={index} className="text-lg text-slate-200 leading-relaxed font-light">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
