"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-28"
    >
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
            <span className="text-sm font-mono text-white/60 uppercase tracking-widest">
              {t("hero.label")}
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants} className="space-y-2 mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]">
              <span className="text-white">Ariel</span>
              <br />
              <span className="text-gradient text-glow">Balmaceda</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p 
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl text-white/80 font-light leading-relaxed max-w-2xl mb-6"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
          >
            {t("hero.tagline")}
          </motion.p>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl mb-10"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            {t("hero.description")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
            <a
              href="#proyectos"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-[#00f5ff]/40 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all duration-300 text-base font-medium glow-cyan"
            >
              {t("hero.ctaPrimary")}
              <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="https://github.com/TheChosenOneReturns"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-medium text-white/70 hover:text-white transition-colors"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.5 : 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs font-mono uppercase tracking-widest text-white/50">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  )
}
