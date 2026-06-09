"use client"

import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { Mail, MessageCircle, type LucideIcon } from "lucide-react"
import { siGithub } from "simple-icons"
import { useLanguage } from "@/lib/language-context"

const linkedInPath = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"

type SocialLink =
  | { name: string; icon: LucideIcon; href: string; path?: never }
  | { name: string; path: string; href: string; icon?: never }

const socialLinks = [
  { name: "Email", icon: Mail, href: "mailto:ariebalmacedafunez@gmail.com" },
  { name: "LinkedIn", path: linkedInPath, href: "https://www.linkedin.com/in/ariel-balmaceda-9a5b422a4/" },
  { name: "GitHub", path: siGithub.path, href: "https://github.com/TheChosenOneReturns" },
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/5492615338541" },
] satisfies SocialLink[]

export function ContactSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="contacto" className="section-fog relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {t("contact.title")}
          </h2>

          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            {t("contact.description")}
          </p>

          <div className="flex justify-center gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glitch-hover p-4 rounded-full bg-white/[0.035] border border-white/10 text-white/55 transition-all duration-300 hover:text-[var(--hot-white)] hover:border-[var(--spectral-cyan)]/45 hover:bg-[var(--spectral-cyan)]/10 hover:shadow-[0_0_30px_rgba(0,245,255,0.18)]"
                aria-label={link.name}
              >
                {link.icon ? (
                  <link.icon className="w-6 h-6" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
                    <path d={link.path} />
                  </svg>
                )}
              </a>
            ))}
          </div>

          <a
            href="https://wa.me/5492615338541"
            target="_blank"
            rel="noopener noreferrer"
            className="spectral-button glitch-hover inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 text-lg font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="glitch-text" data-text={t("contact.sendMessage")}>{t("contact.sendMessage")}</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
