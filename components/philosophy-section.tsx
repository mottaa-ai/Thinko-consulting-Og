export function PhilosophySection() {
  return (
    <section className="py-32 px-8 md:px-24 bg-surface-container-low" id="philosophy">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-primary leading-tight">
            Filosofía de <br />Análisis Social
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 space-y-8">
          <p className="font-serif text-2xl font-light text-on-surface leading-relaxed italic">
            &ldquo;No creemos en soluciones prefabricadas. Cada desafío requiere una 
            arquitectura de datos única y una sensibilidad política quirúrgica.&rdquo;
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div>
              <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                Data-Driven Approach
              </h3>
              <p className="text-on-surface-variant font-light leading-relaxed">
                Combinamos análisis cualitativo profundo con métricas cuantitativas 
                para capturar el pulso real de la opinión pública.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                Injerencia Estratégica
              </h3>
              <p className="text-on-surface-variant font-light leading-relaxed">
                Asesoramos en el centro de la toma de decisiones, anticipando escenarios 
                de crisis y detectando ventanas de oportunidad política.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
