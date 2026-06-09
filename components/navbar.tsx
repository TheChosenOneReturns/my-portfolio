"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { portfolioSections } from "@/lib/sections"
import { useActiveSection } from "@/hooks/use-active-section"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, toggleLanguage, t, isHydrated } = useLanguage()
  const { activeSection } = useActiveSection()

  const desktopLinks = portfolioSections.filter((section) =>
    ["sobre-mi-intro", "proyectos", "stack", "sobre-mi"].includes(section.id)
  )

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isHydrated) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          className={`hud-navbar mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-7xl px-4 sm:w-[calc(100%-2rem)] sm:px-6 py-3 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? "glass-spectral"
              : "bg-black/18"
          }`}
        >
          {/* Logo */}
          <a href="#inicio" className="glitch-hover flex items-center gap-3 group z-50 rounded-full px-2 py-1">
            <div className="w-9 h-9 rounded-lg bg-[var(--spectral-violet)]/20 border border-[var(--spectral-magenta)]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[var(--spectral-cyan)] group-hover:glow-violet">
              <span className="text-sm font-bold text-[var(--spectral-cyan)] tracking-tight">AB</span>
            </div>
            <span className="glitch-text text-base font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors" data-text="ABDEV">
              ABDEV
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1">
            {desktopLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`glitch-hover relative rounded-full px-4 py-2 text-sm font-mono uppercase tracking-[0.18em] transition-all duration-200 group ${
                  activeSection === link.id
                    ? "bg-white/10 text-white shadow-[0_0_24px_rgba(0,245,255,0.14)]"
                    : "text-white/55 hover:text-white"
                }`}
                aria-current={activeSection === link.id ? "page" : undefined}
              >
                <span className="glitch-text" data-text={t(link.labelKey)}>{t(link.labelKey)}</span>
                <span className={`absolute inset-x-3 bottom-1 h-px bg-[linear-gradient(90deg,var(--spectral-cyan),var(--spectral-magenta),var(--accretion-orange))] transition-all duration-300 ${activeSection === link.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5">

            <button
              onClick={toggleLanguage}
              className="glitch-hover flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              aria-label="Toggle language"
            >
              <span className={`glitch-text ${language === "es" ? "text-[var(--spectral-cyan)]" : ""}`} data-text="ES">ES</span>
              <span className="text-white/30">/</span>
              <span className={`glitch-text ${language === "en" ? "text-[var(--spectral-cyan)]" : ""}`} data-text="EN">EN</span>
            </button>

            <a
              href="#contacto"
              className={`spectral-button glitch-hover text-base font-medium px-5 py-2.5 rounded-full transition-all duration-200 ${
                activeSection === "contacto" ? "text-[var(--hot-white)] glow-cyan" : ""
              }`}
            >
              <span className="glitch-text" data-text={t("nav.contactar")}>{t("nav.contactar")}</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="glitch-hover md:hidden rounded-full border border-[var(--spectral-cyan)]/45 bg-[var(--spectral-cyan)]/12 p-2 text-[var(--spectral-cyan)] shadow-[0_0_22px_rgba(0,245,255,0.18)] hover:text-[var(--hot-white)] hover:border-[var(--hot-white)]/60 transition-colors z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden section-fog"
          >
            <div className="flex h-full flex-col items-center justify-center gap-7 px-8">
              {portfolioSections.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glitch-hover w-full max-w-xs border-b border-white/10 pb-3 text-center text-2xl font-medium transition-colors ${
                    activeSection === link.id ? "text-[var(--hot-white)] text-glow" : "text-white/80 hover:text-[var(--spectral-cyan)]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="glitch-text" data-text={t(link.labelKey)}>{t(link.labelKey)}</span>
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false) }}
                className="flex items-center gap-2 text-sm font-medium text-white/60 mt-4"
              >
                <span className={language === "es" ? "text-[var(--spectral-cyan)]" : ""}>ES</span>
                <span className="text-white/30">/</span>
                <span className={language === "en" ? "text-[var(--spectral-cyan)]" : ""}>EN</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
