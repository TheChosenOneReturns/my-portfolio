"use client"

import { useInView } from "@/hooks/use-in-view"
import { Mail, Linkedin, Github, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  {
    name: "Email",
    icon: Mail,
    href: "mailto:ariebalmacedafunez@gmail.com",
    color: "hover:text-pink-400",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ariel-balmaceda-9a5b422a4/",
    color: "hover:text-cyan-400",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/TheChosenOneReturns",
    color: "hover:text-foreground",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/5492615338541",
    color: "hover:text-emerald-400",
  },
]

export function ContactSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="contacto" className="relative py-24 px-4" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <div
          className={`space-y-8 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold" suppressHydrationWarning>
            {t("contact.title")}{" "}
            <span className="bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">{t("contact.titleHighlight")}</span>?
          </h2>

          <p className="text-muted-foreground text-lg" suppressHydrationWarning>
            {t("contact.description")}
          </p>

          <div className="flex justify-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-full bg-secondary/50 border border-border/50 text-muted-foreground transition-all hover:scale-110 ${link.color}`}
                aria-label={link.name}
              >
                <link.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full px-8 py-6 text-lg font-semibold mt-4"
          >
            <a href="https://wa.me/5492615338541" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" suppressHydrationWarning>
              <MessageCircle className="w-5 h-5" />
              {t("contact.sendMessage")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
