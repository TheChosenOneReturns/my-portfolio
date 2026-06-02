"use client"

import { useInView } from "@/hooks/use-in-view"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.3 })
  const { t } = useLanguage()

  return (
    <section id="sobre-mi-intro" className="relative py-32 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <blockquote
          className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-foreground/90">
            <span className="text-primary/60 text-5xl leading-none">&ldquo;</span>
            {t("about.statement")}
            <span className="text-primary/60 text-5xl leading-none">&rdquo;</span>
          </p>
        </blockquote>

        <div
          className={`mt-12 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {t("about.cta")}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
