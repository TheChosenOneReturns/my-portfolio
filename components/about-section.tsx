"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { ArrowRight, Sparkles, Zap, Brain } from "lucide-react"

export function AboutSection() {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  const features = [
    { icon: Zap, label: "Automation", color: "cyan" },
    { icon: Brain, label: "AI/ML", color: "emerald" },
    { icon: Sparkles, label: "Innovation", color: "cyan" }
  ]

  return (
    <section 
      id="sobre-mi-intro" 
      className="relative py-32 px-4 overflow-hidden" 
      ref={containerRef}
    >
      {/* Background decorations */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 60%)",
          y: smoothY
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 60%)",
          y: useTransform(scrollYProgress, [0, 1], [-50, 50])
        }}
      />

      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        style={{ opacity, scale }}
      >
        {/* Title with stagger animation */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
          suppressHydrationWarning
        >
          <motion.span 
            className="text-foreground block"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {t("about.title1")}
          </motion.span>
          <motion.span 
            className="block mt-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {t("about.title2")}
            </span>
          </motion.span>
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          suppressHydrationWarning
        >
          {t("about.description")}
        </motion.p>

        {/* Feature icons */}
        <motion.div 
          className="flex justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className={`p-4 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20`}
                style={{
                  background: feature.color === "cyan" 
                    ? "rgba(34, 211, 238, 0.1)" 
                    : "rgba(16, 185, 129, 0.1)",
                  borderColor: feature.color === "cyan"
                    ? "rgba(34, 211, 238, 0.2)"
                    : "rgba(16, 185, 129, 0.2)"
                }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${feature.color === "cyan" ? "rgba(34, 211, 238, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                    `0 0 40px ${feature.color === "cyan" ? "rgba(34, 211, 238, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                    `0 0 20px ${feature.color === "cyan" ? "rgba(34, 211, 238, 0.2)" : "rgba(16, 185, 129, 0.2)"}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <feature.icon 
                  className={`w-6 h-6`}
                  style={{
                    color: feature.color === "cyan" ? "rgb(34, 211, 238)" : "rgb(16, 185, 129)"
                  }}
                />
              </motion.div>
              <span className="text-sm text-muted-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href="#contacto"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-lg relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            suppressHydrationWarning
          >
            <span className="relative z-10">{t("about.cta")}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
      </div>
    </section>
  )
}
