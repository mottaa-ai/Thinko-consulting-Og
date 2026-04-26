import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { FounderSection } from "@/components/founder-section"
import { ServicesSection } from "@/components/services-section"
import { InsightsSection } from "@/components/insights-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
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
