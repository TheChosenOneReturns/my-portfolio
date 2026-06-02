"use client"

import { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { HeroOrb } from "@/components/hero-orb"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-24"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Text Content */}
          <div className={`space-y-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Label */}
            <div className="inline-flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                {t("hero.label")}
              </span>
            </div>

            {/* Name */}
            <div className="space-y-3">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.95]">
                Ariel
                <br />
                <span className="text-gradient text-bloom">Balmaceda</span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              {t("hero.tagline")}
            </p>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground/80 leading-relaxed max-w-xl">
              {t("hero.description")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              <a
                href="#proyectos"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-base font-medium bloom-sm hover:bloom-md"
              >
                {t("hero.ctaPrimary")}
                <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="https://github.com/TheChosenOneReturns"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Orb */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <HeroOrb />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  )
}
