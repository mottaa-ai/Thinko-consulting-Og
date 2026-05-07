"use client"

import { useTranslation } from "@/lib/i18n"

export function PhilosophySection() {
  const t = useTranslation('philosophy')

  return (
    <section className="py-32 px-8 md:px-24 bg-surface-container-low scroll-mt-20" id="nuestro-enfoque">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <span className="text-xs uppercase tracking-widest text-[#00b8b4] mb-4 block font-semibold">
            {t.label}
          </span>
          <h2 className="font-headline text-4xl md:text-5xl font-light text-foreground leading-tight">
            {t.title}
          </h2>
          <div className="mt-8 h-[2px] w-16 bg-[#00b8b4]" />
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-8">
          <p className="text-xl md:text-2xl font-light text-on-surface leading-relaxed">
            {t.description}
          </p>
        </div>
      </div>
    </section>
  )
}
