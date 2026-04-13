import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-8 md:px-24 pt-20 overflow-hidden bg-surface">
      <div className="z-10 max-w-4xl">
        <span className="block text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-6 font-semibold">
          Alejandro Motta &bull; Estrategia &amp; Asuntos Públicos
        </span>
        <h1 className="font-serif text-6xl md:text-9xl font-light leading-[0.9] tracking-tight text-primary mb-12">
          Trabajos <br /> <span className="italic font-normal">TaylorMade</span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-xl font-light leading-relaxed mb-12">
          Consultoría de alta precisión en estrategia, opinión pública y análisis 
          político para quienes exigen exclusividad y rigor metodológico.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12">
          <Link 
            href="#contact" 
            className="bg-primary text-on-primary px-10 py-4 text-sm font-bold tracking-widest uppercase inline-block hover:opacity-80 transition-opacity"
          >
            Consultar
          </Link>
          <Link 
            href="#philosophy" 
            className="group flex items-center gap-3 text-sm font-bold tracking-widest uppercase"
          >
            Nuestra Visión 
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
      
      {/* Abstract Architectural Visual */}
      <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block bg-surface-container-low">
        <Image
          src="/images/hero-architecture.jpg"
          alt="Líneas arquitectónicas abstractas de una fachada de rascacielos moderno"
          fill
          className="object-cover grayscale opacity-40 mix-blend-multiply"
          priority
        />
      </div>
    </section>
  )
}
