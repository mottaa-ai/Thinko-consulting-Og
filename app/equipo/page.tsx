import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Equipo | Thinko Consulting",
  description: "Conoce al equipo de liderazgo y capital intelectual de Thinko Consulting.",
}

const teamMembers = [
  {
    name: "José Antonio Lozano",
    role: "Miembro del comité directivo",
    description: "Arquitecto de estructuras de gobernanza transformadoras. Aprovechando décadas de experiencia consultiva para dirigir la visión estratégica de la firma y la alineación para entidades globales de primer nivel.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP_DU_Agxl1eALPp7pagu4vFfEZD0A81lHWAQJqr_-eldvXL280znmgMB1yJg8c8GPuJZJJUh7pe7AP27ekQXQm9wOygVx_aIPU1oqtFwlf7UcNjrezWeNvsnIgQ6ZnG-6rizbny8EvgU_AbihWjiDHPwzd5hL4DXbVh1ZTynlxrE3Zk9QFMHZAkPXR1xNXwujJLCEUq739zQz5xQtcLezABqKFlrsOmAOGiD_sBJYs_mwWCQyLAhWulz3EKmS945VWbU9zz09qxk",
  },
  {
    name: "Álvaro Mejía",
    role: "Estadístico",
    description: "Descifra el ruido de la volatilidad mediante modelado cuantitativo riguroso. Álvaro proporciona la base empírica sobre la cual se construyen nuestras recomendaciones estratégicas más críticas.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMNQZebS9yV3tpI1_Xcm-vK2rkRLDkD5Hv1XKhfgzfFaGxIh3vGZ47Yp8kms-To9o1sXb99-YQDdFJQR8iTmLy8AnlCgH_A_NtEDDXPFznXJ5vPPrpy9QFiOnFAnivV6mGoYPPz16TWK1kuB0p1mDMMHBjrQH4nrbpKqodySUUj7gDGk4Vq5SPOHAu9qGZ4mcu3YJSfnjenfxqwIoRKXguzNtWlgD-74cFpY4WTLipQGmdg6exQOHIgqJjYyKVQo1VDed2EqI52gg",
  },
  {
    name: "José Luis Kannarek",
    role: "Consultor Senior",
    description: "Maestro en diplomacia institucional y gestión del cambio. Especializado en navegar la compleja intersección entre la empresa privada y los paisajes de política pública.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV86W-qurU0MSba_qln94ihwe9x6uc0jFyAygDvWUhUUVzHLc0d4cSB_71yKF1ZY5JpGWzbR0k1bHezaIkTLb_DAMyGEzk-FfURU5MMbPDlM3_Kje4tf62NBFnUV5WKzLwe1n7QkQErxQeqZIcv3sF3kB49pl6Xg0Z6TEH59FP02NWlrgH9aEgzR1vRHL_0XEIFdoLK73FXEvCn-lBgun3gfg5Oa5HhXa0f-pvRUyRj1eM6UZdSsHUxlqcJxF7ZDhimN2l14OW-mw",
  },
  {
    name: "Verónica C",
    role: "Consultora Senior",
    description: "Impulsando la excelencia operativa a través de marcos tácticos personalizados. Verónica conecta la teoría de alto nivel con resultados corporativos tangibles.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCidyFbSeI-sIPsOPmLKxGY7OnP6lG4MNc1YFqTodTJwmrwX9SxDIDSlreE7n-0DFcXx0Ke93TUEoCzCJluqb5GaAmDqlTop7NHKJPH5QKSJm0-2yXDE7dMbUWGre6Y10HUOrMQqAyIER2p-RfflK9NuaKqyjoIbdvGsr52OvXGnJhJbh3RpTIhRjKg1oX2ik9haBH7-_Ops9kq_uwP17RxIAU2aitFWDKyCmM95EkWblL5Nd9h_gBVGst8Tn9BinUA1i64iYMlH0s",
  },
  {
    name: "Abraham",
    role: "Analista",
    description: "Síntesis de datos con precisión. Abraham transforma la inteligencia de mercado en bruto en dashboards accionables que impulsan las ventajas competitivas de nuestros clientes.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-WFvfNQI5KLCTFQ8ISDy30pfhlMMsz4AL0bXDmEaRGX6UeOBifVwuX2_7EiBq77FbsyLZ_BGN0csRmXQ7fdSuEg0EvQ4-Ml-6mK4lgo0u-MF6M8ztk67252Bu9o1MMWsrt9ZcskSAQzhrY1eMN5UQ7A2kuK7A-1nObimsa65X-7iE9eglWwZ8V1-E0KT135x-ZmvonTMhDFlFAfPVmSABsMk_jwOKDDymO0zEF3xfi1xkS6Xy4v6oGaHJwQ4-dqT1upk_b4NLow",
  },
  {
    name: "Majo Favela",
    role: "Analista",
    description: "Especialista en economía del comportamiento y tendencias de consumo. Majo proporciona la profundidad cualitativa necesaria para comprender las dinámicas cambiantes del mercado.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC68YAdnMWMHCB9JuDhqYhqS5S2g4C7rnjOhqf7whtK8pg8M_X1cUnyUh9eqznLsc1AlDrlLhVb1CXEr-AsGNjHG7eyl6oFZzSJOy7DpFPtA_2InOeXfX3HziN57fz68zsvMrsV0Jq-Ln7twKc5RExxD4p-0eXEEFCUWtt7o0_Qhttq2Cm-MzT1j7XyYPjLHhJkcuvkR2wCupaQZxSAqWLvZmlw6vJ0NUH5BqHjAeUfrejKEwLF7XfeghS0MFqOXMwyjavH4Na9FEc",
  },
  {
    name: "Kenia",
    role: "Analista",
    description: "Ejecutando investigación de mercado crítica y estudios de factibilidad. Kenia asegura que cada hoja de ruta estratégica sea verificada contra la realidad actual.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1uYe2mfHQjKrAlwLuqqbO5rFw13tJGh7qQQtdfeV5IC28gjblgP4OdqHwtw8NwaycHeBSeO71cUtSR7BJ2MkOwb5edlRx4HsMU0kYEPq-tXXOb8dskZHfuQltQmDEph1G9r2dDAm_F21qOLd3v2HM521AOzC1BrNWrP9p479nx8GKYlxD1fG6MVi7iPNgSDrz5Nqslq5MNyYNXjt6FnPhweOG3OKw8HACN-joyysy9rFRfidlM8LIJhrx-ktW-rwOYS3KJ1XpJ1M",
  },
]

function TeamMemberCard({ member }: { member: typeof teamMembers[0] }) {
  return (
    <div className="group">
      <div className="aspect-[4/5] bg-surface-container-low mb-8 relative overflow-hidden">
        <img
          alt={`Retrato de ${member.name}`}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          src={member.image}
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
          {member.description}
        </p>
      </div>
    </div>
  )
}

export default function EquipoPage() {
  return (
    <main className="bg-surface text-on-surface">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-48 pb-24">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-8">
              <span className="text-xs uppercase tracking-[0.4em] text-on-primary-container mb-6 block">
                Nuestro Capital Intelectual
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight text-primary">
                Liderazgo y Capital Intelectual
              </h1>
            </div>
            <div className="md:col-span-4 flex items-end">
              <p className="text-on-surface-variant font-body leading-relaxed text-lg italic opacity-80">
                &ldquo;La inteligencia colectiva de Thinko Consulting está anclada en precisión, rigor académico y ejecución estratégica implacable.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-[1600px] mx-auto px-8 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      {/* Recruitment/CTA Section */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-12">
            Expandiendo Thinko
          </h2>
          <p className="font-body text-on-surface-variant max-w-2xl mx-auto mb-12 uppercase tracking-widest text-xs leading-loose">
            Buscamos permanentemente individuos que posean una síntesis de capacidad analítica rigurosa y presencia ejecutiva.
          </p>
          <div className="flex justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-4 text-primary font-bold uppercase text-xs tracking-widest group"
            >
              Únete al colectivo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
