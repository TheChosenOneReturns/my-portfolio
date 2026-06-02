"use client"

import { useInView } from "@/hooks/use-in-view"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="sobre-mi-intro" className="relative py-32 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          suppressHydrationWarning
        >
          <span className="text-foreground">{t("about.title1")}</span>
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            {t("about.title2")}
          </span>
        </h2>

        <p
          className={`text-lg text-muted-foreground max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          suppressHydrationWarning
        >
          {t("about.description")}
        </p>

        <div
          className={`transition-all duration-700 delay-400 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <a
            href="#contacto"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg hover:bg-foreground/90 transition-colors"
            suppressHydrationWarning
          >
            {t("about.cta")}
          </a>
        </div>
      </div>
    </section>
  )
}
