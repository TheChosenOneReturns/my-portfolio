"use client"

import { useState, useEffect } from "react"
import { Bot, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useSound } from "@/lib/sound-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactActive, setIsContactActive] = useState(false)
  const { language, toggleLanguage, t, isHydrated } = useLanguage()
  const { playClick, playHover, playWhoosh, playToggle } = useSound()

  const navLinks = [
    { href: "#inicio", labelKey: "nav.inicio" },
    { href: "#proyectos", labelKey: "nav.proyectos" },
    { href: "#stack", labelKey: "nav.stack" },
    { href: "#sobre-mi", labelKey: "nav.sobreMi" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${isScrolled ? "w-[95%] max-w-6xl" : "w-[90%] max-w-5xl"
        }`}
    >
      <nav
        className={`flex items-center justify-between px-6 py-3 rounded-full border border-border/50 backdrop-blur-md transition-all duration-500 ${isScrolled ? "bg-card/90 shadow-lg shadow-pink-500/5" : "bg-card/70"
          }`}
      >
        {/* Logo - Redesigned */}
        <a href="#inicio" className="flex items-center gap-3 group" onMouseEnter={playHover} onClick={() => playClick()}>
          <div className="p-1.5 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg transition-all duration-300 group-hover:from-pink-500/30 group-hover:to-cyan-500/30 group-hover:shadow-lg group-hover:shadow-pink-500/30 group-hover:scale-110">
            <Bot className="w-5 h-5 text-pink-400 transition-all duration-300 group-hover:rotate-12" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-medium text-muted-foreground tracking-wider transition-colors duration-300 group-hover:text-foreground/80">
              ARIEL BALMACEDA
            </span>
            <span className="font-bold text-lg tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">DEV</span>
              {" "}
              <span className="text-pink-400 transition-all duration-300 group-hover:text-pink-300">{"&"}</span>
              {" "}
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-extrabold" suppressHydrationWarning>{language === "es" ? "IA" : "AI"}</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              onMouseEnter={playHover}
              onClick={() => playWhoosh()}
            >
              {t(link.labelKey)}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Language Toggle + Contact Button Container */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Toggle Switch */}
          <button
            onClick={() => {
              playToggle(language === 'es')
              toggleLanguage()
            }}
            className="relative flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 hover:border-cyan-500/30 transition-all duration-300 group"
            aria-label="Toggle language"
            onMouseEnter={playHover}
          >
            <span className={`text-xs font-bold transition-all duration-300 ${language === "es" ? "text-pink-400" : "text-muted-foreground"}`}>
              ES
            </span>
            <div className="relative w-8 h-4 rounded-full bg-background/50 border border-border/30">
              <div
                className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 ${language === "es"
                  ? "left-0.5 bg-gradient-to-r from-pink-500 to-pink-400"
                  : "left-[calc(100%-14px)] bg-gradient-to-r from-cyan-500 to-cyan-400"
                  }`}
              />
            </div>
            <span className={`text-xs font-bold transition-all duration-300 ${language === "en" ? "text-cyan-400" : "text-muted-foreground"}`}>
              EN
            </span>
          </button>

          {/* Contact Button - Enhanced Neon Travel with Click Effect */}
          <div className="relative group">
            {/* SVG for animated traveling border line */}
            <svg
              className="absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none"
              viewBox="0 0 152 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background subtle border */}
              <rect
                x="1"
                y="1"
                width="150"
                height="44"
                rx="22"
                stroke="rgba(34, 211, 238, 0.1)"
                strokeWidth="1"
                fill="none"
              />
              {/* Animated traveling light */}
              <rect
                x="1"
                y="1"
                width="150"
                height="44"
                rx="22"
                stroke={isContactActive ? 'url(#travelingLightPink)' : 'url(#travelingLightCyan)'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="40 310"
                className={isContactActive ? 'animate-border-travel-fast' : 'animate-border-travel'}
                fill="none"
                style={{
                  filter: `drop-shadow(0 0 8px ${isContactActive ? 'rgba(236, 72, 153, 0.8)' : 'rgba(34, 211, 238, 0.8)'}) drop-shadow(0 0 20px ${isContactActive ? 'rgba(236, 72, 153, 0.5)' : 'rgba(34, 211, 238, 0.5)'})`
                }}
              />
              <defs>
                {/* Cyan gradient with glow effect */}
                <linearGradient id="travelingLightCyan" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%" stopColor="rgba(34, 211, 238, 0.4)" />
                  <stop offset="50%" stopColor="rgba(34, 211, 238, 1)" />
                  <stop offset="70%" stopColor="rgba(34, 211, 238, 0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                {/* Pink gradient with glow effect */}
                <linearGradient id="travelingLightPink" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%" stopColor="rgba(236, 72, 153, 0.4)" />
                  <stop offset="50%" stopColor="rgba(236, 72, 153, 1)" />
                  <stop offset="70%" stopColor="rgba(236, 72, 153, 0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>

            {/* Additional glow layer for better visibility */}
            <div
              className={`absolute -inset-[2px] rounded-full blur-md transition-opacity duration-300 pointer-events-none`}
              style={{
                background: isContactActive
                  ? 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
                opacity: 0.6,
              }}
            />

            {/* Glow effect - appears on hover */}
            <div className={`absolute -inset-1 rounded-full ${isContactActive ? 'bg-gradient-to-r from-pink-500/0 via-pink-500/50 to-pink-500/0' : 'bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0'} opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />

            {/* Particle burst effect on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full ${isContactActive ? 'bg-pink-400' : 'bg-cyan-400'}`}
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-20px)`,
                    animation: 'particle-burst 0.6s ease-out forwards',
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>

            <Button
              asChild
              className={`relative bg-background/80 backdrop-blur-md transition-all duration-500 hover:scale-110 font-semibold tracking-wide ${isContactActive
                ? 'bg-gradient-to-r from-pink-500/90 to-rose-500/90 text-white shadow-[0_0_30px_rgba(236,72,153,0.6)] border border-pink-400/40'
                : 'hover:bg-gradient-to-r hover:from-cyan-500/90 hover:to-blue-500/90 text-foreground hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] border border-cyan-500/20 hover:border-cyan-400/40'
                } rounded-full px-6 py-2.5`}
            >
              <a
                href="#contacto"
                className="flex items-center gap-2"
                onMouseEnter={playHover}
                onClick={(e) => {
                  playClick()
                  setIsContactActive(true)
                  setTimeout(() => setIsContactActive(false), 2000)
                }}
              >
                <span className="relative">
                  {t("nav.contactar")}
                  <span className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t("nav.contactar")}
                  </span>
                </span>
                <span className={`inline-block transition-all duration-500 group-hover:translate-x-2 group-hover:scale-125 ${isContactActive ? 'text-pink-200' : 'group-hover:text-cyan-300'}`}>
                  →
                </span>
              </a>
            </Button>
          </div>
        </div>

        <style jsx>{`
          @keyframes particle-burst {
            0% {
              opacity: 0;
              transform: rotate(var(--rotation)) translateY(-20px) scale(0);
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: rotate(var(--rotation)) translateY(-35px) scale(1);
            }
          }
        `}</style>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-4">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-2 py-2 rounded-full bg-secondary/50 border border-border/50"
            >
              <span className={`text-sm font-bold ${language === "es" ? "text-pink-400" : "text-muted-foreground"}`}>ES</span>
              <div className="relative w-10 h-5 rounded-full bg-background/50 border border-border/30">
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${language === "es"
                    ? "left-0.5 bg-gradient-to-r from-pink-500 to-pink-400"
                    : "left-[calc(100%-18px)] bg-gradient-to-r from-cyan-500 to-cyan-400"
                    }`}
                />
              </div>
              <span className={`text-sm font-bold ${language === "en" ? "text-cyan-400" : "text-muted-foreground"}`}>EN</span>
            </button>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t(link.labelKey)}
              </a>
            ))}
            <Button asChild className="bg-secondary hover:bg-secondary/80 text-foreground rounded-full">
              <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>
                {t("nav.contactar")}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
