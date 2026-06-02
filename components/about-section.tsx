"use client"

import { useInView } from "@/hooks/use-in-view"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="sobre-mi-intro" className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <blockquote
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-relaxed text-foreground/90">
            <span className="text-primary/50 text-6xl md:text-7xl leading-none">&ldquo;</span>
            {t("about.statement")}
            <span className="text-primary/50 text-6xl md:text-7xl leading-none">&rdquo;</span>
          </p>
        </blockquote>

        <div
          className={`mt-16 transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {t("about.cta")}
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}
