'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Locale, AllContent } from './types'

// Import all content
import navbarEs from '@/content/es/navbar.json'
import navbarEn from '@/content/en/navbar.json'
import heroEs from '@/content/es/hero.json'
import heroEn from '@/content/en/hero.json'
import philosophyEs from '@/content/es/philosophy.json'
import philosophyEn from '@/content/en/philosophy.json'
import servicesEs from '@/content/es/services.json'
import servicesEn from '@/content/en/services.json'
import visionEs from '@/content/es/vision.json'
import visionEn from '@/content/en/vision.json'
import insightsEs from '@/content/es/insights.json'
import insightsEn from '@/content/en/insights.json'
import contactEs from '@/content/es/contact.json'
import contactEn from '@/content/en/contact.json'
import footerEs from '@/content/es/footer.json'
import footerEn from '@/content/en/footer.json'
import teamEs from '@/content/es/team.json'
import teamEn from '@/content/en/team.json'

const contentMap: Record<Locale, AllContent> = {
  es: {
    navbar: navbarEs,
    hero: heroEs,
    philosophy: philosophyEs,
    services: servicesEs,
    vision: visionEs,
    insights: insightsEs,
    contact: contactEs,
    footer: footerEs,
    team: teamEs,
  },
  en: {
    navbar: navbarEn,
    hero: heroEn,
    philosophy: philosophyEn,
    services: servicesEn,
    vision: visionEn,
    insights: insightsEn,
    contact: contactEn,
    footer: footerEn,
    team: teamEn,
  },
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  content: AllContent
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  
  const stored = localStorage.getItem('thinko-locale') as Locale | null
  if (stored && (stored === 'es' || stored === 'en')) {
    return stored
  }
  
  const browserLang = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || 'es'
  const langCode = browserLang.split('-')[0].toLowerCase()
  
  return langCode === 'en' ? 'en' : 'es'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const detected = detectBrowserLocale()
    setLocaleState(detected)
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('thinko-locale', newLocale)
  }

  // Always use the current locale for content
  const content = contentMap[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, content }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function useTranslation<K extends keyof AllContent>(section: K): AllContent[K] {
  const { content } = useI18n()
  return content[section]
}
