"use client"

import { useTranslation } from "@/lib/i18n"

export function VisionBanner() {
  const t = useTranslation('vision')

  return (
    <section className="py-24 px-8 md:px-24 bg-primary text-on-primary overflow-hidden relative">
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4">
        <h4 className="text-[15rem] font-black tracking-tighter italic select-none">
          {t.backgroundText}
        </h4>
      </div>
      <div className="max-w-4xl relative z-10">
        <blockquote className="font-serif text-3xl md:text-5xl font-light leading-tight italic">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </div>
    </section>
  )
}
