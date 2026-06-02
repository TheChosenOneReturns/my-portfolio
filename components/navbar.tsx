"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, toggleLanguage, t, isHydrated } = useLanguage()

  const navLinks = [
    { href: "#inicio", labelKey: "nav.inicio" },
    { href: "#proyectos", labelKey: "nav.proyectos" },
    { href: "#stack", labelKey: "nav.stack" },
    { href: "#sobre-mi", labelKey: "nav.sobreMi" },
  ]

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
          className={`mx-auto max-w-7xl px-6 sm:px-8 py-5 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group z-50">
            <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#7c3aed] group-hover:glow-violet">
              <span className="text-sm font-bold text-[#00f5ff] tracking-tight">AB</span>
            </div>
            <span className="text-base font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
              ABDEV
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-base font-medium text-white/60 hover:text-white transition-colors duration-200 group"
              >
                {t(link.labelKey)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00f5ff] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              aria-label="Toggle language"
            >
              <span className={language === "es" ? "text-[#00f5ff]" : ""}>ES</span>
              <span className="text-white/30">/</span>
              <span className={language === "en" ? "text-[#00f5ff]" : ""}>EN</span>
            </button>

            <a
              href="#contacto"
              className="text-base font-medium px-5 py-2.5 rounded-full border border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all duration-200 glow-cyan"
            >
              {t("nav.contactar")}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors z-50"
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
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-2xl font-medium text-white/80 hover:text-[#00f5ff] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </motion.a>
              ))}
              <motion.a
                href="#contacto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-medium px-8 py-3 rounded-full border border-[#00f5ff]/40 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.contactar")}
              </motion.a>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false) }}
                className="flex items-center gap-2 text-sm font-medium text-white/60 mt-4"
              >
                <span className={language === "es" ? "text-[#00f5ff]" : ""}>ES</span>
                <span className="text-white/30">/</span>
                <span className={language === "en" ? "text-[#00f5ff]" : ""}>EN</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
