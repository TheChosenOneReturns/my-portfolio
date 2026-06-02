"use client"

import { motion, type Variants } from "framer-motion"
import { forwardRef } from "react"

// ============================================
// ANIMATED ROCKET 🚀
// ============================================

interface AnimatedEmojiProps {
    size?: number
    className?: string
}

export const AnimatedRocket = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
                animate={{
                    y: [0, -5, 0],
                    rotate: [-5, 5, -5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* Rocket body */}
                <motion.path
                    d="M32 8C24 16 20 28 20 36c0 4 2 8 4 10l8 10 8-10c2-2 4-6 4-10 0-8-4-20-12-28z"
                    fill="url(#rocketGradient)"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Window */}
                <circle cx="32" cy="28" r="6" fill="#87CEEB" />
                <circle cx="32" cy="28" r="4" fill="#E0F7FF" />
                {/* Fins */}
                <path d="M20 36l-6 10 10-4z" fill="#FF6B6B" />
                <path d="M44 36l6 10-10-4z" fill="#FF6B6B" />
                {/* Exhaust flames */}
                <motion.g
                    animate={{
                        scaleY: [1, 1.3, 0.8, 1],
                        opacity: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                    }}
                >
                    <path d="M28 56l4 8 4-8c-2 2-6 2-8 0z" fill="#FFA500" />
                    <path d="M30 56l2 6 2-6c-1 1-3 1-4 0z" fill="#FFD700" />
                </motion.g>
                <defs>
                    <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E8E8E8" />
                        <stop offset="100%" stopColor="#B0B0B0" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedRocket.displayName = "AnimatedRocket"

// ============================================
// ANIMATED LIGHTNING ⚡
// ============================================

export const AnimatedLightning = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                <motion.path
                    d="M36 4L12 36h16l-4 24 28-32H36l4-24z"
                    fill="url(#lightningGradient)"
                    animate={{
                        filter: [
                            "drop-shadow(0 0 2px #FFD700)",
                            "drop-shadow(0 0 10px #FFD700)",
                            "drop-shadow(0 0 2px #FFD700)",
                        ],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.path
                    d="M36 4L12 36h16l-4 24 28-32H36l4-24z"
                    fill="transparent"
                    stroke="#FFF"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: [0, 1, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <defs>
                    <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE66D" />
                        <stop offset="50%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedLightning.displayName = "AnimatedLightning"

// ============================================
// ANIMATED ROBOT 🤖
// ============================================

export const AnimatedRobot = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                {/* Antenna */}
                <motion.g
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ transformOrigin: "32px 12px" }}
                >
                    <line x1="32" y1="12" x2="32" y2="4" stroke="#888" strokeWidth="2" />
                    <motion.circle
                        cx="32"
                        cy="4"
                        r="3"
                        fill="#00FFFF"
                        animate={{
                            fill: ["#00FFFF", "#FF00FF", "#00FFFF"],
                            filter: [
                                "drop-shadow(0 0 2px #00FFFF)",
                                "drop-shadow(0 0 8px #FF00FF)",
                                "drop-shadow(0 0 2px #00FFFF)",
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.g>
                {/* Head */}
                <rect x="16" y="12" width="32" height="28" rx="4" fill="url(#robotGradient)" />
                {/* Eyes */}
                <motion.g
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                    <circle cx="24" cy="26" r="5" fill="#111" />
                    <circle cx="40" cy="26" r="5" fill="#111" />
                    <motion.circle
                        cx="24"
                        cy="26"
                        r="3"
                        fill="#00FF00"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.circle
                        cx="40"
                        cy="26"
                        r="3"
                        fill="#00FF00"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    />
                </motion.g>
                {/* Mouth */}
                <rect x="22" y="34" width="20" height="3" rx="1" fill="#333" />
                {/* Body */}
                <rect x="20" y="42" width="24" height="18" rx="2" fill="url(#robotGradient)" />
                {/* Chest light */}
                <motion.rect
                    x="28"
                    y="48"
                    width="8"
                    height="6"
                    rx="1"
                    fill="#FF0000"
                    animate={{
                        fill: ["#FF0000", "#00FF00", "#0000FF", "#FF0000"],
                        opacity: [1, 0.6, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <defs>
                    <linearGradient id="robotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#A8A8A8" />
                        <stop offset="100%" stopColor="#707070" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedRobot.displayName = "AnimatedRobot"

// ============================================
// ANIMATED COMPUTER 💻
// ============================================

export const AnimatedComputer = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                {/* Screen */}
                <rect x="8" y="8" width="48" height="36" rx="3" fill="#333" />
                <rect x="11" y="11" width="42" height="30" rx="2" fill="#1a1a2e" />
                {/* Code lines */}
                <motion.g>
                    <motion.rect
                        x="14"
                        y="16"
                        width="0"
                        height="3"
                        rx="1"
                        fill="#4ade80"
                        animate={{ width: [0, 20, 20, 0] }}
                        transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
                    />
                    <motion.rect
                        x="14"
                        y="22"
                        width="0"
                        height="3"
                        rx="1"
                        fill="#60a5fa"
                        animate={{ width: [0, 28, 28, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3, times: [0, 0.3, 0.7, 1] }}
                    />
                    <motion.rect
                        x="14"
                        y="28"
                        width="0"
                        height="3"
                        rx="1"
                        fill="#f472b6"
                        animate={{ width: [0, 16, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6, times: [0, 0.3, 0.7, 1] }}
                    />
                    <motion.rect
                        x="14"
                        y="34"
                        width="0"
                        height="3"
                        rx="1"
                        fill="#fbbf24"
                        animate={{ width: [0, 24, 24, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.9, times: [0, 0.3, 0.7, 1] }}
                    />
                </motion.g>
                {/* Cursor */}
                <motion.rect
                    x="14"
                    y="16"
                    width="2"
                    height="3"
                    fill="#fff"
                    animate={{
                        opacity: [1, 0, 1],
                        x: [14, 36, 14],
                        y: [16, 34, 16],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                />
                {/* Stand */}
                <rect x="26" y="44" width="12" height="4" fill="#555" />
                <rect x="20" y="48" width="24" height="4" rx="2" fill="#666" />
            </motion.svg>
        )
    }
)
AnimatedComputer.displayName = "AnimatedComputer"

// ============================================
// ANIMATED FIRE 🔥
// ============================================

export const AnimatedFire = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                {/* Outer flame */}
                <motion.path
                    d="M32 4c-8 12-16 20-16 32 0 12 8 20 16 20s16-8 16-20c0-12-8-20-16-32z"
                    fill="url(#fireGradient1)"
                    animate={{
                        d: [
                            "M32 4c-8 12-16 20-16 32 0 12 8 20 16 20s16-8 16-20c0-12-8-20-16-32z",
                            "M32 6c-10 10-14 22-14 30 0 10 6 22 14 22s14-12 14-22c0-8-4-20-14-30z",
                            "M32 4c-8 12-16 20-16 32 0 12 8 20 16 20s16-8 16-20c0-12-8-20-16-32z",
                        ],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {/* Middle flame */}
                <motion.path
                    d="M32 16c-6 10-10 16-10 24 0 8 4 14 10 14s10-6 10-14c0-8-4-14-10-24z"
                    fill="url(#fireGradient2)"
                    animate={{
                        d: [
                            "M32 16c-6 10-10 16-10 24 0 8 4 14 10 14s10-6 10-14c0-8-4-14-10-24z",
                            "M32 14c-8 8-8 18-8 22 0 6 4 16 8 16s8-10 8-16c0-4 0-14-8-22z",
                            "M32 16c-6 10-10 16-10 24 0 8 4 14 10 14s10-6 10-14c0-8-4-14-10-24z",
                        ],
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {/* Inner flame */}
                <motion.path
                    d="M32 28c-3 6-5 10-5 14 0 4 2 8 5 8s5-4 5-8c0-4-2-8-5-14z"
                    fill="#FFEB3B"
                    animate={{
                        d: [
                            "M32 28c-3 6-5 10-5 14 0 4 2 8 5 8s5-4 5-8c0-4-2-8-5-14z",
                            "M32 26c-4 4-4 12-4 16 0 3 2 6 4 6s4-3 4-6c0-4 0-12-4-16z",
                            "M32 28c-3 6-5 10-5 14 0 4 2 8 5 8s5-4 5-8c0-4-2-8-5-14z",
                        ],
                        opacity: [1, 0.8, 1],
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <defs>
                    <linearGradient id="fireGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#FF0000" />
                        <stop offset="50%" stopColor="#FF6600" />
                        <stop offset="100%" stopColor="#FFCC00" />
                    </linearGradient>
                    <linearGradient id="fireGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#FF6600" />
                        <stop offset="100%" stopColor="#FFD700" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedFire.displayName = "AnimatedFire"

// ============================================
// ANIMATED SPARKLES ✨
// ============================================

export const AnimatedSparkles = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        const sparkleVariants: Variants = {
            animate: {
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
                rotate: [0, 180, 360],
            },
        }

        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                {/* Main sparkle */}
                <motion.path
                    d="M32 8l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"
                    fill="url(#sparkleGradient)"
                    variants={sparkleVariants}
                    animate="animate"
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                {/* Small sparkle 1 */}
                <motion.path
                    d="M14 14l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"
                    fill="#FFD700"
                    variants={sparkleVariants}
                    animate="animate"
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.3,
                    }}
                />
                {/* Small sparkle 2 */}
                <motion.path
                    d="M50 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"
                    fill="#FFD700"
                    variants={sparkleVariants}
                    animate="animate"
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: 0.6,
                    }}
                />
                {/* Tiny sparkle */}
                <motion.circle
                    cx="50"
                    cy="14"
                    r="2"
                    fill="#FFF"
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: 0.5,
                    }}
                />
                <motion.circle
                    cx="14"
                    cy="50"
                    r="2"
                    fill="#FFF"
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: 0.8,
                    }}
                />
                <defs>
                    <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE66D" />
                        <stop offset="50%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedSparkles.displayName = "AnimatedSparkles"

// ============================================
// ANIMATED BRAIN 🧠 (Bonus!)
// ============================================

export const AnimatedBrain = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {/* Brain outline */}
                <path
                    d="M32 8c-12 0-20 8-20 20 0 8 4 14 10 18 2 1 4 4 4 6v4h12v-4c0-2 2-5 4-6 6-4 10-10 10-18 0-12-8-20-20-20z"
                    fill="url(#brainGradient)"
                />
                {/* Neural pathways */}
                <motion.g
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <path d="M24 20c4 2 8 0 12 2" stroke="#FF69B4" strokeWidth="1.5" fill="none" />
                    <path d="M20 28c6 0 10 4 16 2" stroke="#FF69B4" strokeWidth="1.5" fill="none" />
                    <path d="M22 36c4-2 8 2 12 0" stroke="#FF69B4" strokeWidth="1.5" fill="none" />
                </motion.g>
                {/* Synapses */}
                <motion.circle
                    cx="24"
                    cy="24"
                    r="2"
                    fill="#00FFFF"
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.circle
                    cx="36"
                    cy="20"
                    r="2"
                    fill="#00FFFF"
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle
                    cx="40"
                    cy="32"
                    r="2"
                    fill="#00FFFF"
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.6 }}
                />
                <defs>
                    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFB6C1" />
                        <stop offset="100%" stopColor="#FF69B4" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedBrain.displayName = "AnimatedBrain"

// ============================================
// ANIMATED TARGET 🎯 (Bonus!)
// ============================================

export const AnimatedTarget = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                {/* Outer ring */}
                <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#FF0000"
                    strokeWidth="4"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                {/* Middle ring */}
                <circle cx="32" cy="32" r="20" fill="none" stroke="#FFF" strokeWidth="4" />
                {/* Inner ring */}
                <motion.circle
                    cx="32"
                    cy="32"
                    r="12"
                    fill="none"
                    stroke="#FF0000"
                    strokeWidth="4"
                    animate={{ scale: [1, 0.95, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
                {/* Bullseye */}
                <motion.circle
                    cx="32"
                    cy="32"
                    r="4"
                    fill="#FF0000"
                    animate={{
                        fill: ["#FF0000", "#FFD700", "#FF0000"],
                        filter: [
                            "drop-shadow(0 0 2px #FF0000)",
                            "drop-shadow(0 0 10px #FFD700)",
                            "drop-shadow(0 0 2px #FF0000)",
                        ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </motion.svg>
        )
    }
)
AnimatedTarget.displayName = "AnimatedTarget"

// ============================================
// ANIMATED BULB 💡 (Bonus!)
// ============================================

export const AnimatedBulb = forwardRef<SVGSVGElement, AnimatedEmojiProps>(
    ({ size = 24, className }, ref) => {
        return (
            <motion.svg
                ref={ref}
                width={size}
                height={size}
                viewBox="0 0 64 64"
                className={className}
            >
                {/* Glow effect */}
                <motion.circle
                    cx="32"
                    cy="24"
                    r="20"
                    fill="none"
                    animate={{
                        opacity: [0.2, 0.6, 0.2],
                        r: [18, 24, 18],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ filter: "blur(8px)" }}
                >
                    <animate attributeName="fill" values="#FFD700;#FFA500;#FFD700" dur="2s" repeatCount="indefinite" />
                </motion.circle>
                {/* Bulb */}
                <path
                    d="M32 4c-11 0-18 8-18 18 0 6 3 11 8 14v6c0 2 2 4 4 4h12c2 0 4-2 4-4v-6c5-3 8-8 8-14 0-10-7-18-18-18z"
                    fill="url(#bulbGradient)"
                />
                {/* Filament */}
                <motion.path
                    d="M28 20c2-2 4-2 8 0s4 6 4 10"
                    fill="none"
                    stroke="#FFA500"
                    strokeWidth="2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                {/* Base */}
                <rect x="26" y="44" width="12" height="4" fill="#888" rx="1" />
                <rect x="26" y="48" width="12" height="4" fill="#666" rx="1" />
                <rect x="28" y="52" width="8" height="4" fill="#444" rx="2" />
                {/* Rays */}
                <motion.g
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <line x1="32" y1="4" x2="32" y2="0" stroke="#FFD700" strokeWidth="2" />
                    <line x1="50" y1="10" x2="54" y2="6" stroke="#FFD700" strokeWidth="2" />
                    <line x1="14" y1="10" x2="10" y2="6" stroke="#FFD700" strokeWidth="2" />
                    <line x1="56" y1="24" x2="60" y2="24" stroke="#FFD700" strokeWidth="2" />
                    <line x1="8" y1="24" x2="4" y2="24" stroke="#FFD700" strokeWidth="2" />
                </motion.g>
                <defs>
                    <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFACD" />
                        <stop offset="100%" stopColor="#FFD700" />
                    </linearGradient>
                </defs>
            </motion.svg>
        )
    }
)
AnimatedBulb.displayName = "AnimatedBulb"

// ============================================
// EXPORT ALL EMOJIS MAP
// ============================================

export const AnimatedEmojis = {
    rocket: AnimatedRocket,
    lightning: AnimatedLightning,
    robot: AnimatedRobot,
    computer: AnimatedComputer,
    fire: AnimatedFire,
    sparkles: AnimatedSparkles,
    brain: AnimatedBrain,
    target: AnimatedTarget,
    bulb: AnimatedBulb,
} as const

export type AnimatedEmojiName = keyof typeof AnimatedEmojis
