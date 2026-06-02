"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
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
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={`mx-auto max-w-6xl px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/30"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center transition-colors group-hover:border-primary/40">
            <span className="text-xs font-bold text-primary tracking-tight">AB</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
            ABDEV
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              {t(link.labelKey)}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle language"
          >
            <span className={language === "es" ? "text-primary" : ""}>ES</span>
            <span className="text-border">/</span>
            <span className={language === "en" ? "text-primary" : ""}>EN</span>
          </button>

          {/* Contact link */}
          <a
            href="#contacto"
            className="text-sm font-medium px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            {t("nav.contactar")}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mx-4 mb-4 p-5 rounded-xl glass">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t(link.labelKey)}
              </a>
            ))}
            <a
              href="#contacto"
              className="text-sm font-medium text-center px-4 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.contactar")}
            </a>
            <button
              onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false) }}
              className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <span className={language === "es" ? "text-primary" : ""}>ES</span>
              <span className="text-border">/</span>
              <span className={language === "en" ? "text-primary" : ""}>EN</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
