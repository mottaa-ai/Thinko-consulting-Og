"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"

export function Footer() {
  const t = useTranslation('footer')

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1.5">
                <Image 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20iso_-Fj3tFLzmb3nWvuazVNDmAn32mQIk2w.png"
                  alt="Thinko Consulting"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-headline text-base font-semibold tracking-tight text-white">Thinko</span>
                <span className="font-headline text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium mt-0.5">
                  Consulting
                </span>
              </div>
            </Link>
            <p className="text-slate-400 font-light text-sm leading-relaxed max-w-sm">
              {t.tagline}
            </p>
          </div>
          
          {/* Navigation */}
          <div className="md:col-span-3 lg:col-span-3">
            <span className="uppercase tracking-[0.3em] text-[10px] font-semibold text-[#00b8b4] mb-6 block">
              {t.sections.navigation.title}
            </span>
            <ul className="space-y-3 text-sm font-light text-slate-300">
              {t.sections.navigation.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#00b8b4] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div className="md:col-span-2 lg:col-span-2">
            <span className="uppercase tracking-[0.3em] text-[10px] font-semibold text-[#00b8b4] mb-6 block">
              {t.sections.services.title}
            </span>
            <ul className="space-y-3 text-sm font-light text-slate-300">
              {t.sections.services.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#00b8b4] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-2 lg:col-span-3">
            <span className="uppercase tracking-[0.3em] text-[10px] font-semibold text-[#00b8b4] mb-6 block">
              {t.sections.contact.title}
            </span>
            <Link 
              href={`mailto:${t.sections.contact.email}`}
              className="text-sm font-light text-slate-300 hover:text-[#00b8b4] transition-colors break-all"
            >
              {t.sections.contact.email}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-800">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-medium">
            © {new Date().getFullYear()} {t.legal.copyright}
          </span>
          <div className="flex gap-6">
            {t.legal.links.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-[#00b8b4] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
