"use client"

import { useTranslation } from "@/lib/i18n"

export function PhilosophySection() {
  const t = useTranslation('philosophy')

  return (
    <section className="py-32 px-8 md:px-24 bg-surface-container-low" id="philosophy">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <span className="text-xs uppercase tracking-widest text-on-surface-variant mb-4 block">
            {t.label}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-primary leading-tight">
            {t.title}
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-8">
          <p className="font-serif text-2xl font-light text-on-surface leading-relaxed italic">
            {t.description}
          </p>
        </div>
      </div>
    </section>
  )
}
