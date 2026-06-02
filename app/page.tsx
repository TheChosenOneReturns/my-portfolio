import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { StackSection } from "@/components/stack-section"
import { BioSection } from "@/components/bio-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { ClientWrapper } from "@/components/client-wrapper"
import { AnimatedTitle } from "@/components/animated-title"
import { ScrollProgress } from "@/components/scroll-animations"

export default function Home() {
  return (
    <ClientWrapper>
      <main className="relative min-h-screen overflow-hidden">
        <AnimatedTitle
          baseTitle="DEV & AI | Ariel Balmaceda"
          emojis={["⚡", "🚀", "💻", "🤖", "✨", "🔥", "💡", "🎯"]}
          interval={2000}
        />
        <ScrollProgress />
        <ParticlesBackground />
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
