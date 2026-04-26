"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import images from "@/content/images.json"

const teamImages: Record<string, string> = {
  "member-1": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jose%CC%81%20Antonio%20Lozano-sDk7qz60OVFGkPEl5R8sVBCv93MUBt.png",  // José Antonio Lozano
  "member-2": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%CC%81lvaro%20Meji%CC%81a-vgX7D6uPc3mu6jSOSFuZKOE0FF6rKo.png",  // Álvaro Mejía
  "member-3": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jose%CC%81%20Luis%20Kannarek-EW6kAOxN7aw9967rw7El9IGF0KUpMb.png",  // José Luis Kannarek
  "member-4": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Octavio%20Sanz-czb9h2BIIrJZKItkzgl6DIddY5Xq69.png",  // Octavio Sanz
  "member-5": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ruddyard%20Villalobos-lUNYTfZeqomNu6l49Hhz52pCVnULDL.png",  // Ruddyard Villalobos
  "member-6": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rodrigo%20Salas-uVEbdwVCzJ3ol2UVOOkc9Ld1z10AtX.png",  // Rodrigo Salas
  "member-7": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vero%CC%81nica%20Calderaro-KFQJXbu9hu7VjxVCF89GixrcPSh5hj.png",  // Verónica Calderaro
  "member-8": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Abraham%20Marti%CC%81nez-GdNo0FdzzRGqXCnRJBtFfoZLNNSmCj.png",  // Abraham Martínez
  "member-9": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mari%CC%81a%20Jose%CC%81%20Favela-leaSfWnAEsQA7iPWQKI6Epv9oLMcyb.png",  // María José Favela
  "member-10": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kenia%20Estrada-vYAPivDbVCLQl0G31hPGexSRoDAuXm.png", // Kenia Estrada
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const imageUrl = teamImages[member.id] || images.team[member.id as keyof typeof images.team]
  
  return (
    <div className="group">
      <div className="aspect-[4/5] bg-slate-100 mb-6 relative overflow-hidden">
        <img
          alt={`Portrait of ${member.name}`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          src={imageUrl}
        />
        <div className="absolute top-4 right-4 h-2 w-2 bg-[#00b8b4]" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl md:text-3xl font-headline font-medium mb-3 text-foreground tracking-tight">{member.name}</h3>
        <p className="text-xs uppercase tracking-[0.25em] text-[#00b8b4] mb-6 font-semibold">
          {member.role}
        </p>
        <div className="w-12 h-[2px] bg-[#00b8b4] mb-6" />
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-[95%] font-light">
          {member.bio}
        </p>
      </div>
    </div>
  )
}

export default function EquipoPage() {
  const t = useTranslation('team')

  return (
    <main className="bg-surface text-on-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
              <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-6 block">
                Talento
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-light leading-tight text-foreground tracking-tight">
                {t.hero.title}
              </h1>
              <div className="mt-8 h-[2px] w-16 bg-[#00b8b4]" />
            </div>
            <div className="md:col-span-4 flex items-end">
              <p className="text-on-surface-variant font-light leading-relaxed text-lg">
                &ldquo;{t.hero.quote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-[1600px] mx-auto px-8 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
          {t.members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Recruitment/CTA Section */}
      <section className="py-32 bg-[#0f172a] text-white">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] font-semibold mb-6 block">
            Carreras
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-light mb-8 text-white tracking-tight">
            {t.cta.title}
          </h2>
          <p className="font-light text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed text-base">
            {t.cta.description}
          </p>
          <div className="flex justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-4 bg-[#00b8b4] text-white px-10 py-4 font-semibold uppercase text-xs tracking-widest hover:bg-white hover:text-[#0f172a] transition-colors group"
            >
              {t.cta.button}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
