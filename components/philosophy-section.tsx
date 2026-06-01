"use client"

import { useTranslation } from "@/lib/i18n"

export function PhilosophySection() {
  const t = useTranslation('philosophy')

  return (
    <section className="py-24 md:py-32 px-8 md:px-24 bg-surface-container-low scroll-mt-20" id="nuestro-enfoque">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <span className="text-xs uppercase tracking-widest text-[#00b8b4] mb-4 block font-semibold">
            {t.label}
          </span>
          <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight">
            {t.title}
          </h2>
          <div className="mt-8 h-[2px] w-16 bg-[#00b8b4]" />
        </div>
        <div className="lg:col-span-7 lg:col-start-6 space-y-8">
          <p className="text-lg md:text-xl lg:text-2xl font-light text-on-surface leading-relaxed">
            {t.description}
          </p>
        </div>
      </div>
    </section>
  )
}
