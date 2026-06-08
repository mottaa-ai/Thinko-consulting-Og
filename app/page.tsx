import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { FounderSection } from "@/components/founder-section"
import { ServicesSection } from "@/components/services-section"
import { InsightsSection } from "@/components/insights-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollSpy } from "@/components/scroll-spy"

const SECTION_IDS = ["nuestro-enfoque", "founder", "services", "proyectos-tailor-made", "contact"]

export default function Home() {
  return (
    <>
      <ScrollSpy sectionIds={SECTION_IDS} />
      <Navbar />
      <main>
        <HeroSection />
        <PhilosophySection />
        <FounderSection />
        <ServicesSection />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
