"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ChevronDown, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { language, t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      {/* Open to Work Badge */}
      <div
        className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/50 bg-green-500/10 text-green-400 text-sm font-medium" suppressHydrationWarning>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {t("hero.badge")}
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div
          className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" suppressHydrationWarning>
            <span className="text-foreground">{t("hero.title1")}</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              {t("hero.title2")}
            </span>
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t("hero.description") }}
            suppressHydrationWarning
          />

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full px-8 py-6 text-lg font-semibold"
            >
              <a href="#proyectos" className="flex items-center gap-2" suppressHydrationWarning>
                {t("hero.explorePortfolio")}
                <ChevronDown className="w-5 h-5" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 py-6 text-lg font-semibold border-border/50 hover:bg-secondary bg-transparent"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div
          className={`relative transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
        >
          <div className="relative">
            {/* Circular frame with glow */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-8 rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(34,211,238,0.3)]">
                <img src="/futuristic-developer-working-with-ai-holographic-i.jpg" alt="AI Developer" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-1/4 -right-4 lg:right-0 animate-float">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-border/50 backdrop-blur-sm shadow-lg">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-sm font-medium" suppressHydrationWarning>{t("hero.badge.n8n")}</span>
              </div>
            </div>

            <div className="absolute bottom-1/3 -left-4 lg:left-0 animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-border/50 backdrop-blur-sm shadow-lg">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium" suppressHydrationWarning>{t("hero.badge.ai")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  )
}

function Bot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}
