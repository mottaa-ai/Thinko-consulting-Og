"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useTranslation, useI18n } from "@/lib/i18n"

function TypewriterText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [displayText, setDisplayText] = useState(words[0] || "")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    const currentWord = words[index]
    if (!currentWord) return

    if (isPaused) {
      const pauseTimeout = setTimeout(() => setIsPaused(false), 2200)
      return () => clearTimeout(pauseTimeout)
    }

    const speed = isDeleting ? 52 : 113

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.substring(0, displayText.length + 1))
        } else {
          setIsDeleting(true)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentWord.substring(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setIndex((prev) => (prev + 1) % words.length)
          setIsPaused(true)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, index, words, isPaused])

  return (
    <span className="inline-flex items-baseline">
      <span>{displayText}</span>
      <span className="ml-1 inline-block h-[0.85em] w-[3px] bg-[#00b8b4] animate-pulse" aria-hidden="true" />
    </span>
  )
}

export function HeroSection() {
  const t = useTranslation('hero')
  const { locale } = useI18n()

  const rotatingWords = locale === 'en'
    ? ['tailor-made', 'Research', 'Analysis', 'Consulting']
    : ['Soluciones', 'Proyectos', 'Análisis', 'Consultorías']

  return (
    <section className="relative min-h-screen flex items-center px-8 md:px-24 pt-20 overflow-hidden bg-surface">
      <div className="z-10 max-w-4xl w-full">
        <span className="block text-xs uppercase tracking-[0.3em] text-[#00b8b4] mb-6 font-semibold">
          {t.tagline}
        </span>
        <h1 className="font-headline text-4xl md:text-6xl lg:text-8xl font-light leading-[0.95] tracking-tight text-foreground mb-10 md:mb-12">
          <TypewriterText words={rotatingWords} />
          <br />
          <span className="font-medium text-foreground">{t.titleHighlight}</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-on-surface-variant max-w-xl font-light leading-relaxed mb-10 md:mb-12">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
          <Link
            href="#contact"
            className="bg-foreground text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase inline-block hover:bg-[#00b8b4] transition-colors duration-300"
          >
            {locale === 'en' ? 'Consult' : 'Consultar'}
          </Link>
          <Link
            href="#nuestro-enfoque"
            className="group flex items-center gap-3 text-sm font-semibold tracking-widest uppercase text-foreground hover:text-[#00b8b4] transition-colors"
          >
            {locale === 'en' ? 'Our Approach' : 'Nuestro Enfoque'}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      {/* Visual */}
      <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block bg-surface-container-low">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compressedImage-GbVn12NLvMXh0PfpPlYemqiiJ4JpU3.jpeg"
          alt="Cruce peatonal concurrido en Ciudad de México con efecto de movimiento"
          fill
          className="object-cover grayscale opacity-40 mix-blend-multiply"
          priority
        />
      </div>
    </section>
  )
}
