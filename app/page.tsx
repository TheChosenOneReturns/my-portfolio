import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { StackSection } from "@/components/stack-section"
import { BioSection } from "@/components/bio-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WebGLBackground } from "@/components/webgl-background"
import { ClientWrapper } from "@/components/client-wrapper"
import { SmoothScroll } from "@/components/smooth-scroll"
import { SectionDivider } from "@/components/section-divider"
import { SectionIndex } from "@/components/section-index"
import { GlitchSoundBridge } from "@/components/glitch-sound-bridge"

export default function Home() {
  return (
    <SmoothScroll>
      <ClientWrapper>
        <GlitchSoundBridge />
        <WebGLBackground />
        <main className="relative min-h-screen overflow-hidden">
          <Navbar />
          <SectionIndex />
          <HeroSection />
          <SectionDivider />
          <AboutSection />
          <SectionDivider />
          <ProjectsSection />
          <SectionDivider />
          <StackSection />
          <SectionDivider />
          <BioSection />
          <SectionDivider />
          <ContactSection />
          <Footer />
        </main>
      </ClientWrapper>
    </SmoothScroll>
  )
}
