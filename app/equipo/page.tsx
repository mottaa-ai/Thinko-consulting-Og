"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import images from "@/content/images.json"

const teamImages: Record<string, string> = {
  "member-1": "https://lh3.googleusercontent.com/aida-public/AB6AXuDP_DU_Agxl1eALPp7pagu4vFfEZD0A81lHWAQJqr_-eldvXL280znmgMB1yJg8c8GPuJZJJUh7pe7AP27ekQXQm9wOygVx_aIPU1oqtFwlf7UcNjrezWeNvsnIgQ6ZnG-6rizbny8EvgU_AbihWjiDHPwzd5hL4DXbVh1ZTynlxrE3Zk9QFMHZAkPXR1xNXwujJLCEUq739zQz5xQtcLezABqKFlrsOmAOGiD_sBJYs_mwWCQyLAhWulz3EKmS945VWbU9zz09qxk",
  "member-2": "https://lh3.googleusercontent.com/aida-public/AB6AXuCMNQZebS9yV3tpI1_Xcm-vK2rkRLDkD5Hv1XKhfgzfFaGxIh3vGZ47Yp8kms-To9o1sXb99-YQDdFJQR8iTmLy8AnlCgH_A_NtEDDXPFznXJ5vPPrpy9QFiOnFAnivV6mGoYPPz16TWK1kuB0p1mDMMHBjrQH4nrbpKqodySUUj7gDGk4Vq5SPOHAu9qGZ4mcu3YJSfnjenfxqwIoRKXguzNtWlgD-74cFpY4WTLipQGmdg6exQOHIgqJjYyKVQo1VDed2EqI52gg",
  "member-3": "https://lh3.googleusercontent.com/aida-public/AB6AXuBV86W-qurU0MSba_qln94ihwe9x6uc0jFyAygDvWUhUUVzHLc0d4cSB_71yKF1ZY5JpGWzbR0k1bHezaIkTLb_DAMyGEzk-FfURU5MMbPDlM3_Kje4tf62NBFnUV5WKzLwe1n7QkQErxQeqZIcv3sF3kB49pl6Xg0Z6TEH59FP02NWlrgH9aEgzR1vRHL_0XEIFdoLK73FXEvCn-lBgun3gfg5Oa5HhXa0f-pvRUyRj1eM6UZdSsHUxlqcJxF7ZDhimN2l14OW-mw",
  "member-4": "https://lh3.googleusercontent.com/aida-public/AB6AXuCidyFbSeI-sIPsOPmLKxGY7OnP6lG4MNc1YFqTodTJwmrwX9SxDIDSlreE7n-0DFcXx0Ke93TUEoCzCJluqb5GaAmDqlTop7NHKJPH5QKSJm0-2yXDE7dMbUWGre6Y10HUOrMQqAyIER2p-RfflK9NuaKqyjoIbdvGsr52OvXGnJhJbh3RpTIhRjKg1oX2ik9haBH7-_Ops9kq_uwP17RxIAU2aitFWDKyCmM95EkWblL5Nd9h_gBVGst8Tn9BinUA1i64iYMlH0s",
  "member-5": "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-WFvfNQI5KLCTFQ8ISDy30pfhlMMsz4AL0bXDmEaRGX6UeOBifVwuX2_7EiBq77FbsyLZ_BGN0csRmXQ7fdSuEg0EvQ4-Ml-6mK4lgo0u-MF6M8ztk67252Bu9o1MMWsrt9ZcskSAQzhrY1eMN5UQ7A2kuK7A-1nObimsa65X-7iE9eglWwZ8V1-E0KT135x-ZmvonTMhDFlFAfPVmSABsMk_jwOKDDymO0zEF3xfi1xkS6Xy4v6oGaHJwQ4-dqT1upk_b4NLow",
  "member-6": "https://lh3.googleusercontent.com/aida-public/AB6AXuC68YAdnMWMHCB9JuDhqYhqS5S2g4C7rnjOhqf7whtK8pg8M_X1cUnyUh9eqznLsc1AlDrlLhVb1CXEr-AsGNjHG7eyl6oFZzSJOy7DpFPtA_2InOeXfX3HziN57fz68zsvMrsV0Jq-Ln7twKc5RExxD4p-0eXEEFCUWtt7o0_Qhttq2Cm-MzT1j7XyYPjLHhJkcuvkR2wCupaQZxSAqWLvZmlw6vJ0NUH5BqHjAeUfrejKEwLF7XfeghS0MFqOXMwyjavH4Na9FEc",
  "member-7": "https://lh3.googleusercontent.com/aida-public/AB6AXuB1uYe2mfHQjKrAlwLuqqbO5rFw13tJGh7qQQtdfeV5IC28gjblgP4OdqHwtw8NwaycHeBSeO71cUtSR7BJ2MkOwb5edlRx4HsMU0kYEPq-tXXOb8dskZHfuQltQmDEph1G9r2dDAm_F21qOLd3v2HM521AOzC1BrNWrP9p479nx8GKYlxD1fG6MVi7iPNgSDrz5Nqslq5MNyYNXjt6FnPhweOG3OKw8HACN-joyysy9rFRfidlM8LIJhrx-ktW-rwOYS3KJ1XpJ1M",
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
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight text-primary">
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
              className="inline-flex items-center gap-4 text-primary font-bold uppercase text-xs tracking-widest group"
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
