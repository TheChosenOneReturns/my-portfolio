"use client"

import { useInView } from "@/hooks/use-in-view"
import { Mail, Linkedin, Github, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  {
    name: "Email",
    icon: Mail,
    href: "mailto:ariebalmacedafunez@gmail.com",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ariel-balmaceda-9a5b422a4/",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/TheChosenOneReturns",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/5492615338541",
  },
]

export function ContactSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="contacto" className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <div
          className={`space-y-10 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {t("contact.title")}
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("contact.description")}
          </p>

          <div className="flex justify-center gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-secondary/30 border border-border/30 text-muted-foreground transition-all duration-300 hover:text-primary hover:border-primary/40 hover:bg-primary/5 bloom-sm hover:bloom-md"
                aria-label={link.name}
              >
                <link.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <a
            href="https://wa.me/5492615338541"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-medium bloom-sm hover:bloom-md"
          >
            <MessageCircle className="w-5 h-5" />
            {t("contact.sendMessage")}
          </a>
        </div>
      </div>
    </section>
  )
}
