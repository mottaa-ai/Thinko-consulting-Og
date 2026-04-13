"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useI18n, useTranslation } from "@/lib/i18n"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { locale, setLocale } = useI18n()
  const t = useTranslation('navbar')

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-full">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50"
        >
          Thinko Consulting
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          <Link 
            href="/#philosophy" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            {t.links.philosophy}
          </Link>
          <Link 
            href="/#services" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            {t.links.services}
          </Link>
          <Link 
            href="/equipo" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            {t.links.team}
          </Link>
          <Link 
            href="/#insights" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            {t.links.insights}
          </Link>
          <Link 
            href="/#contact" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            {t.links.contact}
          </Link>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setLocale('es')}
              className={`px-2 py-1 transition-colors ${locale === 'es' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ES
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-1 transition-colors ${locale === 'en' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-outline-variant/20">
          <div className="flex flex-col px-8 py-6 gap-6">
            <Link 
              href="/#philosophy" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.links.philosophy}
            </Link>
            <Link 
              href="/#services" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.links.services}
            </Link>
            <Link 
              href="/equipo" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.links.team}
            </Link>
            <Link 
              href="/#insights" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.links.insights}
            </Link>
            <Link 
              href="/#contact" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.links.contact}
            </Link>
            
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-2 text-sm font-medium pt-4 border-t border-outline-variant/20">
              <button
                onClick={() => { setLocale('es'); setMobileMenuOpen(false); }}
                className={`px-3 py-2 transition-colors ${locale === 'es' ? 'text-slate-900 dark:text-white bg-surface-container' : 'text-slate-400'}`}
              >
                ES
              </button>
              <button
                onClick={() => { setLocale('en'); setMobileMenuOpen(false); }}
                className={`px-3 py-2 transition-colors ${locale === 'en' ? 'text-slate-900 dark:text-white bg-surface-container' : 'text-slate-400'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
