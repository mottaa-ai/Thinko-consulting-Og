"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import images from "@/content/images.json"

const teamImages: Record<string, string> = {
  "member-1": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AM-1gk2YUUURNiduPzgv81xntVDxqse6e.png",
  "member-2": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VC-Af4SdOCYx5iEhk3KmUTuh0xYyQcWtE.png",
  "member-3": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RS-i2nXSjJNbiYIbLUHHfHNOVzgVyAEbs.png",
  "member-4": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MJF-iJAlkgKjqM0QX754t6EJsgIb2D4AcY.png",
  "member-5": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JLK-2DvmgjvE4S0sfSr51GsAgYrv7rJ8d3.png",
  "member-6": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KE-iwe1nzdlk9lLQyBVuxlwsk9QbQAdKq.png",
  "member-7": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ALVME-9xkXBWw9CEHWvPC5uz9abLz1ZONB3q.png",
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
      <div className="aspect-[4/5] bg-surface-container-low mb-8 relative overflow-hidden">
        <img
          alt={`Portrait of ${member.name}`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          src={imageUrl}
        />
        <div className="absolute top-4 right-4 h-1 w-1 bg-tertiary-fixed-dim" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-3xl font-serif font-medium mb-2">{member.name}</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-on-primary-container mb-6">
          {member.role}
        </p>
        <div className="w-12 h-[1px] bg-outline-variant opacity-30 mb-6" />
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-[90%] font-body">
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
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight text-[#470053]">
                {t.hero.title}
              </h1>
            </div>
            <div className="md:col-span-4 flex items-end">
              <p className="text-on-surface-variant font-body leading-relaxed text-lg italic opacity-80">
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
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-12">
            {t.cta.title}
          </h2>
          <p className="font-body text-on-surface-variant max-w-2xl mx-auto mb-12 uppercase tracking-widest text-xs leading-loose">
            {t.cta.description}
          </p>
          <div className="flex justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-4 text-[#470053] font-bold uppercase text-xs tracking-widest group"
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
