"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

// ============================================
// SPOTLIGHT CARD - Mouse following spotlight
// ============================================

interface SpotlightCardProps {
    children: ReactNode
    className?: string
    spotlightColor?: string
}

export function SpotlightCard({
    children,
    className = "",
    spotlightColor = "rgba(139, 92, 246, 0.15)"
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return

        const div = divRef.current
        const rect = div.getBoundingClientRect()

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const handleFocus = () => {
        setIsFocused(true)
        setOpacity(1)
    }

    const handleBlur = () => {
        setIsFocused(false)
        setOpacity(0)
    }

    const handleMouseEnter = () => {
        setOpacity(1)
    }

    const handleMouseLeave = () => {
        setOpacity(0)
    }

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            {children}
        </div>
    )
}

// ============================================
// ANIMATED GRADIENT BACKGROUND
// ============================================

interface AnimatedGradientBackgroundProps {
    children?: ReactNode
    className?: string
    colors?: string[]
    speed?: number
}

export function AnimatedGradientBackground({
    children,
    className = "",
    colors = ["#4f46e5", "#7c3aed", "#ec4899", "#06b6d4"],
    speed = 10
}: AnimatedGradientBackgroundProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        `radial-gradient(circle at 0% 0%, ${colors[0]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 100% 0%, ${colors[1]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 100% 100%, ${colors[2]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 0% 100%, ${colors[3]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 0% 0%, ${colors[0]} 0%, transparent 50%)`,
                    ],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                    background: [
                        `radial-gradient(circle at 100% 100%, ${colors[2]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 0% 100%, ${colors[3]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 0% 0%, ${colors[0]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 100% 0%, ${colors[1]} 0%, transparent 50%)`,
                        `radial-gradient(circle at 100% 100%, ${colors[2]} 0%, transparent 50%)`,
                    ],
                }}
                transition={{
                    duration: speed * 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    )
}

// ============================================
// AURORA BACKGROUND
// ============================================

interface AuroraBackgroundProps {
    children?: ReactNode
    className?: string
}

export function AuroraBackground({ children, className = "" }: AuroraBackgroundProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0">
                <motion.div
                    className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-30 blur-3xl"
                    style={{
                        background: "linear-gradient(180deg, #4f46e5, #7c3aed)",
                    }}
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-30 blur-3xl"
                    style={{
                        background: "linear-gradient(180deg, #ec4899, #f97316)",
                    }}
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full opacity-20 blur-3xl"
                    style={{
                        background: "linear-gradient(180deg, #06b6d4, #22d3ee)",
                    }}
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    )
}

// ============================================
// ANIMATED BORDER
// ============================================

interface AnimatedBorderProps {
    children: ReactNode
    className?: string
    borderWidth?: number
    duration?: number
    colors?: string[]
}

export function AnimatedBorder({
    children,
    className = "",
    borderWidth = 2,
    duration = 4,
    colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f97316", "#4f46e5"]
}: AnimatedBorderProps) {
    return (
        <div className={`relative rounded-2xl p-[${borderWidth}px] ${className}`}>
            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                    background: `linear-gradient(90deg, ${colors.join(", ")})`,
                    backgroundSize: "300% 100%",
                }}
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <div className="relative bg-background rounded-2xl z-10">
                {children}
            </div>
        </div>
    )
}

// ============================================
// GLOWING ORB
// ============================================

interface GlowingOrbProps {
    className?: string
    color?: string
    size?: number
}

export function GlowingOrb({
    className = "",
    color = "#7c3aed",
    size = 200
}: GlowingOrbProps) {
    return (
        <motion.div
            className={`absolute rounded-full pointer-events-none ${className}`}
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                filter: "blur(40px)",
            }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    )
}

// ============================================
// METEORS
// ============================================

interface MeteorsProps {
    number?: number
}

export function Meteors({ number = 20 }: MeteorsProps) {
    const meteors = Array.from({ length: number }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 2 + 2,
    }))

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {meteors.map((meteor) => (
                <motion.div
                    key={meteor.id}
                    className="absolute w-0.5 h-20 rotate-45"
                    style={{
                        top: `${meteor.top}%`,
                        left: `${meteor.left}%`,
                        background: "linear-gradient(to bottom, rgba(139, 92, 246, 0.8), transparent)",
                    }}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: ["0vh", "100vh"],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: meteor.duration,
                        delay: meteor.delay,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 5 + 5,
                    }}
                />
            ))}
        </div>
    )
}

// ============================================
// GRID PATTERN
// ============================================

interface GridPatternProps {
    className?: string
    cellSize?: number
    strokeColor?: string
}

export function GridPattern({
    className = "",
    cellSize = 40,
    strokeColor = "rgba(255, 255, 255, 0.05)"
}: GridPatternProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <pattern
                        id="grid"
                        width={cellSize}
                        height={cellSize}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <motion.div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
                }}
            />
        </div>
    )
}

// ============================================
// PARALLAX MOUSE MOVEMENT
// ============================================

interface ParallaxMouseProps {
    children: ReactNode
    className?: string
    strength?: number
}

export function ParallaxMouse({ children, className = "", strength = 20 }: ParallaxMouseProps) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { stiffness: 150, damping: 15 }
    const xSpring = useSpring(x, springConfig)
    const ySpring = useSpring(y, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            x.set((e.clientX - centerX) / strength)
            y.set((e.clientY - centerY) / strength)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [x, y, strength])

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                x: xSpring,
                y: ySpring,
            }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// TEXT GRADIENT ANIMATION
// ============================================

interface AnimatedTextGradientProps {
    text: string
    className?: string
    colors?: string[]
}

export function AnimatedTextGradient({
    text,
    className = "",
    colors = ["#4f46e5", "#7c3aed", "#ec4899", "#f97316"]
}: AnimatedTextGradientProps) {
    return (
        <motion.span
            className={`bg-clip-text text-transparent ${className}`}
            style={{
                backgroundImage: `linear-gradient(90deg, ${colors.join(", ")}, ${colors[0]})`,
                backgroundSize: "200% 100%",
            }}
            animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {text}
        </motion.span>
    )
}

// ============================================
// RIPPLE EFFECT
// ============================================

interface RippleProps {
    className?: string
    color?: string
}

export function Ripple({ className = "", color = "rgba(139, 92, 246, 0.3)" }: RippleProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{ borderColor: color }}
                    initial={{ width: 0, height: 0, opacity: 1 }}
                    animate={{
                        width: ["0%", "150%"],
                        height: ["0%", "150%"],
                        opacity: [0.8, 0],
                    }}
                    transition={{
                        duration: 3,
                        delay: i * 1,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    )
}
