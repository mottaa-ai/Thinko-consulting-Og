import { BarChart3, Landmark, Target } from "lucide-react"

const services = [
  {
    number: "01",
    title: "Estudios de Opinión Pública",
    icon: BarChart3,
    items: [
      "Investigación Cualitativa",
      "Análisis Cuantitativo",
      "Mapeo de Percepciones",
    ],
  },
  {
    number: "02",
    title: "Asuntos Públicos y Política",
    icon: Landmark,
    items: [
      "Monitoreo Legislativo",
      "Análisis de Entorno Político",
      "Estrategias de Comunicación",
    ],
  },
  {
    number: "03",
    title: "Consultoría Empresarial",
    icon: Target,
    items: [
      "Marketing de Posicionamiento",
      "Contexto Competitivo",
      "Estrategia Corporativa",
    ],
  },
]

export function ServicesSection() {
  return (
    <section className="py-32 px-8 md:px-24 bg-surface" id="services">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-on-surface-variant">
            Soluciones
          </span>
          <h2 className="font-serif text-5xl font-light mt-4">Ejes Estratégicos</h2>
        </div>
        <div className="hidden md:block h-[1px] bg-outline-variant w-1/3 opacity-20 mb-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {services.map((service) => (
          <ServiceCard key={service.number} {...service} />
        ))}
      </div>
    </section>
  )
}

function ServiceCard({
  number,
  title,
  icon: Icon,
  items,
}: {
  number: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: string[]
}) {
  return (
    <div className="group p-12 bg-surface-container hover:bg-surface-container-highest transition-colors duration-500 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <Icon className="w-10 h-10" />
      </div>
      <div>
        <span className="text-xs font-bold text-on-primary-container tracking-widest uppercase">
          {number}
        </span>
        <h3 className="font-serif text-3xl font-light mt-8 mb-6">{title}</h3>
        <ul className="space-y-4 text-on-surface-variant font-light">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="w-1 h-1 bg-tertiary-fixed-dim" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12">
        <div className="w-4 h-4 bg-tertiary-fixed-dim" />
      </div>
    </div>
  )
}
