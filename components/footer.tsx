"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

export function Footer() {
  const t = useTranslation('footer')

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t-0">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-12 py-20 gap-8">
        <div className="max-w-sm">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-50 block mb-4">
            Thinko Consulting
          </span>
          <p className="text-slate-500 dark:text-slate-400 font-light text-sm leading-relaxed">
            {t.tagline}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
          <div>
            <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
              {t.sections.navigation.title}
            </span>
            <ul className="space-y-4 text-sm font-light text-slate-500 dark:text-slate-400">
              {t.sections.navigation.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
              {t.sections.services.title}
            </span>
            <ul className="space-y-4 text-sm font-light text-slate-500 dark:text-slate-400">
              {t.sections.services.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
              {t.sections.contact.title}
            </span>
            <ul className="space-y-4 text-sm font-light text-slate-500 dark:text-slate-400">
              <li>{t.sections.contact.email}</li>
              <li>{t.sections.contact.location}</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-8 md:mt-0">
          <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
            Social
          </span>
          <div className="flex gap-4">
            <Link 
              href={t.social.twitter}
              target="_blank"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors"
            >
              <span className="text-xs font-bold">X</span>
            </Link>
            <Link 
              href={t.social.linkedin}
              target="_blank"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors"
            >
              <span className="text-xs font-bold">IN</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="px-12 py-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[10px] uppercase tracking-widest text-slate-400">
          © {new Date().getFullYear()} {t.legal.copyright}
        </span>
        <div className="flex gap-6">
          {t.legal.links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
