import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ServicesSection } from "@/components/services-section"
import { VisionBanner } from "@/components/vision-banner"
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
        <ServicesSection />
        <VisionBanner />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
