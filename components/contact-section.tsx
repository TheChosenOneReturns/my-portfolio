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
    <section id="contacto" className="relative py-24 px-4" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <div
          className={`space-y-8 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("contact.title")}
          </h2>

          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t("contact.description")}
          </p>

          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full bg-secondary/40 border border-border/40 text-muted-foreground transition-all duration-200 hover:text-primary hover:border-primary/30 hover:bg-primary/5"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <a
            href="https://wa.me/5492615338541"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            {t("contact.sendMessage")}
          </a>
        </div>
      </div>
    </section>
  )
}
