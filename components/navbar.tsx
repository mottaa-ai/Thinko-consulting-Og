"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useI18n, useTranslation } from "@/lib/i18n"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { locale, setLocale } = useI18n()
  const t = useTranslation('navbar')

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="flex justify-between items-center w-full px-8 py-5 max-w-full">
        <Link 
          href="/" 
          className="flex items-center gap-3 text-foreground"
        >
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20iso_-Fj3tFLzmb3nWvuazVNDmAn32mQIk2w.png"
            alt="Thinko Consulting"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="font-headline text-base font-semibold tracking-tight">Thinko</span>
            <span className="font-headline text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-medium mt-0.5">
              Consulting
            </span>
          </div>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link 
            href="/#philosophy" 
            className="text-sm font-medium tracking-tight text-on-surface-variant hover:text-[#00b8b4] transition-colors duration-300"
          >
            {t.links.philosophy}
          </Link>
          <Link 
            href="/#services" 
            className="text-sm font-medium tracking-tight text-on-surface-variant hover:text-[#00b8b4] transition-colors duration-300"
          >
            {t.links.services}
          </Link>
          <Link 
            href="/equipo" 
            className="text-sm font-medium tracking-tight text-on-surface-variant hover:text-[#00b8b4] transition-colors duration-300"
          >
            {t.links.team}
          </Link>
          <Link 
            href="/#insights" 
            className="text-sm font-medium tracking-tight text-on-surface-variant hover:text-[#00b8b4] transition-colors duration-300"
          >
            {t.links.insights}
          </Link>
          <Link 
            href="/#contact" 
            className="bg-foreground text-white px-5 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-[#00b8b4] transition-colors duration-300"
          >
            {t.links.contact}
          </Link>
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest">
            <button
              onClick={() => setLocale('es')}
              className={`px-1 py-1 transition-colors ${locale === 'es' ? 'text-[#00b8b4]' : 'text-slate-400 hover:text-foreground'}`}
            >
              ES
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => setLocale('en')}
              className={`px-1 py-1 transition-colors ${locale === 'en' ? 'text-[#00b8b4]' : 'text-slate-400 hover:text-foreground'}`}
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
