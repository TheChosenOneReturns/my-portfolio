"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"

// Fade in from bottom on scroll
export function FadeInOnScroll({ 
  children, 
  delay = 0,
  duration = 0.6,
  y = 60,
  className = ""
}: { 
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1
}: { 
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
        visible: { 
          opacity: 1, 
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax scroll effect
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = ""
}: { 
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  )
}

// Text reveal on scroll
export function TextReveal({ 
  text, 
  className = "",
  delay = 0
}: { 
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const words = text.split(" ")

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, rotateX: 90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            ease: [0.25, 0.4, 0.25, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// Scale up on scroll
export function ScaleOnScroll({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ scale: smoothScale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from side
export function SlideIn({ 
  children, 
  direction = "left",
  delay = 0,
  className = ""
}: { 
  children: ReactNode
  direction?: "left" | "right"
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        x: direction === "left" ? -100 : 100,
        filter: "blur(10px)"
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0,
        filter: "blur(0px)"
      } : {}}
      transition={{ 
        duration: 0.7, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover effect
export function MagneticHover({ 
  children, 
  className = "",
  strength = 0.3
}: { 
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0, 0)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  )
}

// Glow pulse effect
export function GlowPulse({ 
  children, 
  color = "cyan",
  className = ""
}: { 
  children: ReactNode
  color?: "cyan" | "pink" | "emerald"
  className?: string
}) {
  const colorMap = {
    cyan: "shadow-cyan-500/50",
    pink: "shadow-pink-500/50",
    emerald: "shadow-emerald-500/50"
  }

  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 20px 0px var(--tw-shadow-color)`,
          `0 0 40px 10px var(--tw-shadow-color)`,
          `0 0 20px 0px var(--tw-shadow-color)`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ 
        "--tw-shadow-color": color === "cyan" ? "rgba(34, 211, 238, 0.5)" : 
                            color === "pink" ? "rgba(236, 72, 153, 0.5)" : 
                            "rgba(16, 185, 129, 0.5)"
      } as React.CSSProperties}
    >
      {children}
    </motion.div>
  )
}

// Horizontal scroll progress bar
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  )
}

// Floating element animation
export function FloatingElement({ 
  children, 
  duration = 4,
  y = 20,
  className = ""
}: { 
  children: ReactNode
  duration?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      animate={{
        y: [-y/2, y/2, -y/2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 3D tilt effect on hover
export function TiltCard({ 
  children, 
  className = ""
}: { 
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -20
    const rotateY = (x - 0.5) * 20

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  )
}

// Counter animation
export function AnimatedCounter({ 
  value, 
  duration = 2,
  className = ""
}: { 
  value: number
  duration?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {isInView && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <CountUp end={value} duration={duration} />
          </motion.span>
        )}
      </motion.span>
    </motion.span>
  )
}

function CountUp({ end, duration }: { end: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      onAnimationStart={() => {
        if (!ref.current) return
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / (duration * 1000), 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(eased * end)
          if (ref.current) {
            ref.current.textContent = current.toString()
          }
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        animate()
      }}
    >
      0
    </motion.span>
  )
}
