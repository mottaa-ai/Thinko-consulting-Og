"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-full">
        <Link 
          href="#" 
          className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50"
        >
          Thinko Consulting
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          <Link 
            href="#philosophy" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Philosophy
          </Link>
          <Link 
            href="#services" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Services
          </Link>
          <Link 
            href="#insights" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Insights
          </Link>
          <Link 
            href="#contact" 
            className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Contact
          </Link>
          <button className="bg-primary text-on-primary px-6 py-2 text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-all duration-200">
            Get Started
          </button>
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
              href="#philosophy" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Philosophy
            </Link>
            <Link 
              href="#services" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="#insights" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insights
            </Link>
            <Link 
              href="#contact" 
              className="text-sm font-medium tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <button className="bg-primary text-on-primary px-6 py-3 text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-all duration-200 w-full">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
