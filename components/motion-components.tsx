"use client"

import { motion, type Variants, type HTMLMotionProps } from "framer-motion"
import { forwardRef, type ReactNode } from "react"

// ============================================
// ANIMATION VARIANTS
// ============================================

export const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
}

export const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
}

export const fadeInDownVariants: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
}

export const fadeInLeftVariants: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
}

export const fadeInRightVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
}

export const scaleUpVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
}

export const scaleDownVariants: Variants = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1 },
}

export const rotateInVariants: Variants = {
    hidden: { opacity: 0, rotate: -15, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
}

export const blurInVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
}

export const slideInBottomVariants: Variants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
}

export const expandVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 },
}

// ============================================
// STAGGER CONTAINER
// ============================================

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    staggerChildren?: number
    delayChildren?: number
    className?: string
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
    ({ children, staggerChildren = 0.1, delayChildren = 0, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren,
                            delayChildren,
                        },
                    },
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
StaggerContainer.displayName = "StaggerContainer"

// ============================================
// FADE IN COMPONENT
// ============================================

type Direction = "up" | "down" | "left" | "right" | "none"

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    direction?: Direction
    delay?: number
    duration?: number
    className?: string
    once?: boolean
}

const directionVariants: Record<Direction, Variants> = {
    up: fadeInUpVariants,
    down: fadeInDownVariants,
    left: fadeInLeftVariants,
    right: fadeInRightVariants,
    none: fadeInVariants,
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
    ({ children, direction = "up", delay = 0, duration = 0.6, className, once = true, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                whileInView="visible"
                viewport={{ once, margin: "-50px" }}
                variants={directionVariants[direction]}
                transition={{
                    duration,
                    delay,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
FadeIn.displayName = "FadeIn"

// ============================================
// SCALE UP COMPONENT
// ============================================

interface ScaleUpProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
}

export const ScaleUp = forwardRef<HTMLDivElement, ScaleUpProps>(
    ({ children, delay = 0, duration = 0.5, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={scaleUpVariants}
                transition={{
                    duration,
                    delay,
                    ease: [0.34, 1.56, 0.64, 1],
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
ScaleUp.displayName = "ScaleUp"

// ============================================
// BLUR IN COMPONENT
// ============================================

interface BlurInProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
}

export const BlurIn = forwardRef<HTMLDivElement, BlurInProps>(
    ({ children, delay = 0, duration = 0.8, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={blurInVariants}
                transition={{
                    duration,
                    delay,
                    ease: "easeOut",
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
BlurIn.displayName = "BlurIn"

// ============================================
// MAGNETIC HOVER COMPONENT (Dynamic!)
// ============================================

interface MagneticProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    strength?: number
}

export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
    ({ children, className, strength = 0.3, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={className}
                whileHover={{ scale: 1 + strength * 0.16 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
Magnetic.displayName = "Magnetic"

// ============================================
// FLOAT ANIMATION (Continuous)
// ============================================

interface FloatProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    duration?: number
    distance?: number
}

export const Float = forwardRef<HTMLDivElement, FloatProps>(
    ({ children, className, duration = 3, distance = 10, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={className}
                animate={{
                    y: [-distance, distance, -distance],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
Float.displayName = "Float"

// ============================================
// PULSE GLOW ANIMATION
// ============================================

interface PulseGlowProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    glowColor?: string
}

export const PulseGlow = forwardRef<HTMLDivElement, PulseGlowProps>(
    ({ children, className, glowColor = "rgba(139, 92, 246, 0.5)", ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={className}
                animate={{
                    boxShadow: [
                        `0 0 20px ${glowColor}`,
                        `0 0 60px ${glowColor}`,
                        `0 0 20px ${glowColor}`,
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
PulseGlow.displayName = "PulseGlow"

// ============================================
// REVEAL TEXT (Character by character)
// ============================================

interface RevealTextProps {
    text: string
    className?: string
    delay?: number
    charDelay?: number
}

export function RevealText({ text, className, delay = 0, charDelay = 0.03 }: RevealTextProps) {
    const characters = text.split("")

    return (
        <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{
                        duration: 0.4,
                        delay: delay + index * charDelay,
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    style={{ display: "inline-block", whiteSpace: "pre" }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    )
}

// ============================================
// SHIMMER EFFECT
// ============================================

interface ShimmerProps {
    children: ReactNode
    className?: string
}

export function Shimmer({ children, className }: ShimmerProps) {
    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            initial={{ backgroundPosition: "-200% 0" }}
            animate={{ backgroundPosition: "200% 0" }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                backgroundSize: "200% 100%",
            }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// TILT 3D CARD
// ============================================

interface Tilt3DProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    perspective?: number
    maxTilt?: number
}

export const Tilt3D = forwardRef<HTMLDivElement, Tilt3DProps>(
    ({ children, className, perspective = 1000, maxTilt = 15, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={className}
                style={{ perspective }}
                whileHover={{
                    rotateX: maxTilt,
                    rotateY: maxTilt,
                    transition: { duration: 0.3 },
                }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
Tilt3D.displayName = "Tilt3D"

// ============================================
// TYPEWRITER EFFECT
// ============================================

interface TypewriterProps {
    text: string
    className?: string
    delay?: number
    speed?: number
}

export function Typewriter({ text, className, delay = 0, speed = 0.05 }: TypewriterProps) {
    return (
        <motion.span className={className}>
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.01,
                        delay: delay + index * speed,
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    )
}

// ============================================
// ORBIT ANIMATION
// ============================================

interface OrbitProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    radius?: number
    duration?: number
    reverse?: boolean
}

export const Orbit = forwardRef<HTMLDivElement, OrbitProps>(
    ({ children, className, radius = 100, duration = 10, reverse = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={className}
                animate={{
                    rotate: reverse ? -360 : 360,
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    transformOrigin: `center center`,
                }}
                {...props}
            >
                <div style={{ transform: `translateX(${radius}px)` }}>
                    {children}
                </div>
            </motion.div>
        )
    }
)
Orbit.displayName = "Orbit"

// ============================================
// WAVE TEXT
// ============================================

interface WaveTextProps {
    text: string
    className?: string
    delay?: number
}

export function WaveText({ text, className, delay = 0 }: WaveTextProps) {
    return (
        <span className={className}>
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    style={{ display: "inline-block", whiteSpace: "pre" }}
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 0.6,
                        delay: delay + index * 0.05,
                        repeat: Infinity,
                        repeatDelay: 2,
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    )
}
