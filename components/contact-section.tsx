"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Linkedin, Github, MessageCircle, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

const socialLinks = [
  {
    name: "Email",
    icon: Mail,
    href: "mailto:ariebalmacedafunez@gmail.com",
    color: "#22d3ee",
    hoverColor: "hover:border-cyan-500/50",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ariel-balmaceda-9a5b422a4/",
    color: "#0077B5",
    hoverColor: "hover:border-blue-500/50",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/TheChosenOneReturns",
    color: "#f0f0f0",
    hoverColor: "hover:border-foreground/50",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/5492615338541",
    color: "#10b981",
    hoverColor: "hover:border-emerald-500/50",
  },
]

export function ContactSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const { t } = useLanguage()

  return (
    <section id="contacto" className="relative py-32 px-4 overflow-hidden" ref={containerRef}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <motion.h2 
            className="text-4xl md:text-5xl font-bold"
            suppressHydrationWarning
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              {t("contact.title")}{" "}
            </motion.span>
            <motion.span 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("contact.titleHighlight")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ?
            </motion.span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            suppressHydrationWarning
          >
            {t("contact.description")}
          </motion.p>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 text-muted-foreground transition-all duration-300 group ${link.hoverColor}`}
                aria-label={link.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                  style={{ background: `${link.color}33` }}
                />
                <link.icon 
                  className="w-6 h-6 relative z-10 transition-colors duration-300" 
                  style={{ color: link.color }}
                />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white rounded-full px-8 py-6 text-lg font-semibold overflow-hidden group"
              >
                <a 
                  href="https://wa.me/5492615338541" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2" 
                  suppressHydrationWarning
                >
                  <MessageCircle className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{t("contact.sendMessage")}</span>
                  <ArrowUpRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decoration lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </section>
  )
}
