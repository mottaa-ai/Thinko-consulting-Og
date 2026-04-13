import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const insights = [
  {
    date: "14 Oct, 2024",
    category: "Opinión Pública",
    title: "La mutación del voto joven en contextos de crisis económica",
  },
  {
    date: "02 Sep, 2024",
    category: "Estrategia",
    title: "Arquitectura de marca para empresarios en la arena política",
  },
  {
    date: "18 Ago, 2024",
    category: "Asuntos Públicos",
    title: "El impacto de la regulación IA en el monitoreo legislativo local",
  },
]

export function InsightsSection() {
  return (
    <section className="py-32 px-8 md:px-24 bg-surface" id="insights">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-on-surface-variant">
            Editorial
          </span>
          <h2 className="font-serif text-5xl font-light mt-4">Perspectivas Estratégicas</h2>
        </div>
        <Link 
          href="#" 
          className="text-sm font-bold tracking-widest uppercase border-b border-primary pb-2 hover:opacity-60 transition-opacity"
        >
          Ver todas las publicaciones
        </Link>
      </div>
      
      <div className="space-y-0">
        {insights.map((insight, index) => (
          <InsightPost key={insight.title} {...insight} isLast={index === insights.length - 1} />
        ))}
      </div>
    </section>
  )
}

function InsightPost({
  date,
  category,
  title,
  isLast,
}: {
  date: string
  category: string
  title: string
  isLast: boolean
}) {
  return (
    <div 
      className={`group border-t ${isLast ? 'border-b' : ''} border-outline-variant/20 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:bg-surface-container-low transition-colors px-4 -mx-4`}
    >
      <div className="md:col-span-2 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
        {date}
      </div>
      <div className="md:col-span-7">
        <span className="text-[10px] tracking-widest text-tertiary uppercase mb-2 block">
          {category}
        </span>
        <h3 className="font-serif text-2xl font-light group-hover:italic transition-all">
          {title}
        </h3>
      </div>
      <div className="md:col-span-3 flex justify-start md:justify-end">
        <Link 
          href="#" 
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase group"
        >
          Leer Más 
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
