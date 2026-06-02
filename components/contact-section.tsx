"use client"

import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { Mail, Linkedin, Github, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  { name: "Email", icon: Mail, href: "mailto:ariebalmacedafunez@gmail.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/ariel-balmaceda-9a5b422a4/" },
  { name: "GitHub", icon: Github, href: "https://github.com/TheChosenOneReturns" },
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/5492615338541" },
]

export function ContactSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="contacto" className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
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
                className="p-4 rounded-full bg-white/[0.03] border border-white/10 text-white/50 transition-all duration-300 hover:text-[#00f5ff] hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/5 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]"
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#00f5ff] text-black hover:bg-[#00f5ff]/90 transition-all duration-300 text-lg font-medium hover:shadow-[0_0_40px_rgba(0,245,255,0.3)]"
          >
            <MessageCircle className="w-5 h-5" />
            {t("contact.sendMessage")}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
