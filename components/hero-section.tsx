"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ChevronDown, Github, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  }

  const title1 = t("hero.title1")
  const title2 = t("hero.title2")

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden"
      ref={containerRef}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 50%)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div style={{ y: smoothY, opacity, scale }}>
        {/* Open to Work Badge */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium backdrop-blur-sm"
            whileHover={{ scale: 1.05, borderColor: "rgba(16, 185, 129, 0.5)" }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(16, 185, 129, 0.2)",
                "0 0 40px rgba(16, 185, 129, 0.3)",
                "0 0 20px rgba(16, 185, 129, 0.2)"
              ]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            suppressHydrationWarning
          >
            <motion.span 
              className="w-2.5 h-2.5 rounded-full bg-emerald-400"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {t("hero.badge")}
          </motion.span>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            {/* Animated Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              variants={titleVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              suppressHydrationWarning
            >
              <span className="block text-foreground">
                {title1.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={letterVariants}
                    className="inline-block"
                    style={{ marginRight: char === " " ? "0.25em" : "0" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
              <span className="block mt-2">
                {title2.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    variants={letterVariants}
                    className="inline-block bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                    style={{ 
                      marginRight: char === " " ? "0.25em" : "0",
                      animationDelay: `${i * 0.1}s`
                    }}
                    animate={{
                      backgroundPosition: ["0% center", "200% center"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              dangerouslySetInnerHTML={{ __html: t("hero.description") }}
              suppressHydrationWarning
            />

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white rounded-full px-8 py-6 text-lg font-semibold overflow-hidden group"
                >
                  <a href="#proyectos" className="flex items-center gap-2" suppressHydrationWarning>
                    <span className="relative z-10">{t("hero.explorePortfolio")}</span>
                    <ChevronDown className="w-5 h-5 relative z-10 group-hover:translate-y-1 transition-transform" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-semibold border-border/50 hover:bg-secondary/50 bg-background/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
                >
                  <a
                    href="https://github.com/TheChosenOneReturns"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Visual - AI Themed */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Animated rings */}
              <motion.div 
                className="absolute inset-0 rounded-full border border-cyan-500/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-4 rounded-full border border-emerald-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-8 rounded-full border border-cyan-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Main image container */}
              <motion.div 
                className="absolute inset-12 rounded-full overflow-hidden border-2 border-cyan-500/40"
                animate={{
                  boxShadow: [
                    "0 0 40px rgba(34, 211, 238, 0.3)",
                    "0 0 80px rgba(34, 211, 238, 0.4)",
                    "0 0 40px rgba(34, 211, 238, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="/futuristic-developer-working-with-ai-holographic-i.png" 
                  alt="AI Developer" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating data points */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-cyan-400"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>

            {/* Floating Badges */}
            <motion.div 
              className="absolute top-1/4 -right-4 lg:right-0"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-cyan-500/30 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.05, borderColor: "rgba(34, 211, 238, 0.5)" }}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium" suppressHydrationWarning>{t("hero.badge.n8n")}</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="absolute bottom-1/3 -left-4 lg:left-0"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-emerald-500/30 backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.05, borderColor: "rgba(16, 185, 129, 0.5)" }}
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium" suppressHydrationWarning>{t("hero.badge.ai")}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
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
