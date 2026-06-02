"use client"

import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { t } = useLanguage()

  return (
    <section id="sobre-mi-intro" className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-relaxed text-white/90">
            <span className="text-[#00f5ff]/50 text-6xl md:text-7xl leading-none">&ldquo;</span>
            {t("about.statement")}
            <span className="text-[#00f5ff]/50 text-6xl md:text-7xl leading-none">&rdquo;</span>
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-lg font-medium text-[#00f5ff] hover:text-[#00f5ff]/80 transition-colors group"
          >
            {t("about.cta")}
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
