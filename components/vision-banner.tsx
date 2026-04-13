export function VisionBanner() {
  return (
    <section className="py-24 px-8 md:px-24 bg-primary text-on-primary overflow-hidden relative">
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4">
        <h4 className="text-[15rem] font-black tracking-tighter italic select-none">
          VISION
        </h4>
      </div>
      <div className="max-w-4xl relative z-10">
        <span className="text-xs tracking-[0.4em] uppercase text-on-primary-container mb-8 block">
          Proyección 2029
        </span>
        <blockquote className="font-serif text-3xl md:text-5xl font-light leading-tight italic">
          &ldquo;Nuestra visión es consolidarnos como el referente indiscutido en 
          estudios sociológicos de alto impacto, transformando la complejidad social 
          en claridad estratégica para los líderes del mañana.&rdquo;
        </blockquote>
      </div>
    </section>
  )
}
