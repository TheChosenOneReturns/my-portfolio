import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { StackSection } from "@/components/stack-section"
import { BioSection } from "@/components/bio-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { HeroEnergyBackground } from "@/components/hero-energy-background"
import { AmbientBackground } from "@/components/ambient-background"
import { ClientWrapper } from "@/components/client-wrapper"

export default function Home() {
  return (
    <ClientWrapper>
      <HeroEnergyBackground />
      <AmbientBackground />
      <main className="relative min-h-screen overflow-hidden">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <StackSection />
        <BioSection />
        <ContactSection />
        <Footer />
      </main>
    </ClientWrapper>
  )
}
