import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t-0">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-12 py-20 gap-8">
        <div className="max-w-sm">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-50 block mb-4">
            Thinko Consulting
          </span>
          <p className="text-slate-500 dark:text-slate-400 font-light text-sm leading-relaxed">
            Firma de consultoría boutique especializada en el análisis quirúrgico 
            de la realidad social y política.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-16">
          <div>
            <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
              Navegación
            </span>
            <ul className="space-y-4 text-sm font-light text-slate-500 dark:text-slate-400">
              <li>
                <Link href="#philosophy" className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                  Philosophy
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#insights" className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                  Insights
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
              Legal
            </span>
            <ul className="space-y-4 text-sm font-light text-slate-500 dark:text-slate-400">
              <li>
                <Link href="#" className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-amber-500 dark:hover:text-amber-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-8 md:mt-0">
          <span className="uppercase tracking-widest text-xs font-bold text-slate-900 dark:text-slate-50 mb-6 block">
            Social
          </span>
          <div className="flex gap-4">
            <Link 
              href="https://x.com/mottafocus" 
              target="_blank"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors"
            >
              <span className="text-xs font-bold">X</span>
            </Link>
            <Link 
              href="https://instagram.com/mottafocus" 
              target="_blank"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors"
            >
              <span className="text-xs font-bold">IG</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="px-12 py-8 border-t border-outline-variant/10 text-[10px] uppercase tracking-widest text-slate-400 text-center md:text-left">
        © 2024 Thinko Consulting. All Rights Reserved.
      </div>
    </footer>
  )
}
