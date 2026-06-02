"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { X, Volume2, VolumeX, Gamepad2, Skull } from "lucide-react"
import { retroSound } from "@/lib/sounds"

interface Enemy {
    x: number
    y: number
    alive: boolean
    type: number
    animOffset: number
}

interface Boss {
    x: number
    y: number
    health: number
    maxHealth: number
    phase: number
    alive: boolean
    animOffset: number
    lastShot: number
    targetX: number
    // Animation states
    animState: 'idle' | 'attack' | 'damage' | 'summon'
    animTimer: number
    lastDamage: number
    // Summon tracking
    lastSummonThreshold: number
    summonedMinions: number
}

interface Bullet {
    x: number
    y: number
    isEnemy: boolean
    isBoss?: boolean
    vx?: number  // Velocity X for smart aimed shots
    vy?: number  // Velocity Y for smart aimed shots
    isSmart?: boolean
}

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    color: string
    size: number
}

interface Star {
    x: number
    y: number
    speed: number
    size: number
    brightness: number
}

// Classic videogame power-ups
type PowerUpType = 'speed' | 'tripleShot' | 'shield' | 'rapidFire' | 'invincibility'

interface PowerUp {
    x: number
    y: number
    type: PowerUpType
    alive: boolean
}

interface ActivePowerUp {
    type: PowerUpType
    endTime: number
}

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 700
const PLAYER_WIDTH = 60
const PLAYER_HEIGHT = 35
const ENEMY_WIDTH = 45
const ENEMY_HEIGHT = 35
const BULLET_WIDTH = 5
const BULLET_HEIGHT = 18
const BOSS_WIDTH = 180
const BOSS_HEIGHT = 100

interface WaveConfig {
    rows: number
    cols: number
    enemySpeed: number
    enemyDropAmount: number
    enemyShotInterval: number
    isBossWave: boolean
}

const WAVES: WaveConfig[] = [
    { rows: 3, cols: 7, enemySpeed: 0.35, enemyDropAmount: 10, enemyShotInterval: 1700, isBossWave: false },
    { rows: 4, cols: 8, enemySpeed: 0.45, enemyDropAmount: 12, enemyShotInterval: 1400, isBossWave: false },
    { rows: 4, cols: 9, enemySpeed: 0.55, enemyDropAmount: 14, enemyShotInterval: 1100, isBossWave: false },
    { rows: 5, cols: 10, enemySpeed: 0.65, enemyDropAmount: 15, enemyShotInterval: 900, isBossWave: false },
    { rows: 0, cols: 0, enemySpeed: 0, enemyDropAmount: 0, enemyShotInterval: 0, isBossWave: true },
]

export function SpaceInvaders({ onClose }: { onClose: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [gameOver, setGameOver] = useState(false)
    const [won, setWon] = useState(false)
    const [highScore, setHighScore] = useState(0)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [isPaused, setIsPaused] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const [currentWave, setCurrentWave] = useState(1)
    const [showWaveTransition, setShowWaveTransition] = useState(false)
    const [waveTransitionText, setWaveTransitionText] = useState("")

    const starsRef = useRef<Star[]>([])

    const gameStateRef = useRef({
        playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        enemies: [] as Enemy[],
        boss: null as Boss | null,
        playerBullets: [] as Bullet[],
        enemyBullets: [] as Bullet[],
        particles: [] as Particle[],
        powerUps: [] as PowerUp[],
        activePowerUps: [] as ActivePowerUp[],
        hasShield: false,
        screenShake: 0,
        enemyDirection: 1,
        enemySpeed: 0.35,
        enemyDropAmount: 10,
        lastEnemyShot: 0,
        enemyShotInterval: 1700,
        keys: { left: false, right: false, shoot: false },
        lastShot: 0,
        frameCount: 0,
        wave: 1,
        isBossWave: false,
        isTransitioning: false, // Prevents wave skip race condition
    })

    // Initialize stars
    useEffect(() => {
        const stars: Star[] = []
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                speed: Math.random() * 0.5 + 0.1,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.3,
            })
        }
        starsRef.current = stars
    }, [])

    // Sync sound state with retroSound
    useEffect(() => {
        retroSound.setEnabled(soundEnabled)
        localStorage.setItem('gameSound', soundEnabled ? 'true' : 'false')
    }, [soundEnabled])

    // Load sound preference
    useEffect(() => {
        const saved = localStorage.getItem('gameSound')
        if (saved !== null) {
            setSoundEnabled(saved === 'true')
        }
    }, [])

    // Spawn enemies for a wave
    const spawnWave = useCallback((waveNum: number) => {
        const waveConfig = WAVES[Math.min(waveNum - 1, WAVES.length - 1)]

        if (waveConfig.isBossWave) {
            // Spawn boss
            gameStateRef.current.isBossWave = true
            gameStateRef.current.boss = {
                x: CANVAS_WIDTH / 2 - BOSS_WIDTH / 2,
                y: 60,
                health: 50,
                maxHealth: 50,
                phase: 1,
                alive: true,
                animOffset: 0,
                lastShot: 0,
                targetX: CANVAS_WIDTH / 2 - BOSS_WIDTH / 2,
                // Animation states
                animState: 'idle',
                animTimer: 0,
                lastDamage: 0,
                // Summon tracking
                lastSummonThreshold: 1.0,
                summonedMinions: 0,
            }
            gameStateRef.current.enemies = []
        } else {
            // Spawn regular enemies
            gameStateRef.current.isBossWave = false
            gameStateRef.current.boss = null
            const enemies: Enemy[] = []
            const startX = (CANVAS_WIDTH - (waveConfig.cols * (ENEMY_WIDTH + 20))) / 2

            for (let row = 0; row < waveConfig.rows; row++) {
                for (let col = 0; col < waveConfig.cols; col++) {
                    enemies.push({
                        x: col * (ENEMY_WIDTH + 20) + startX,
                        y: row * (ENEMY_HEIGHT + 20) + 80,
                        alive: true,
                        type: row === 0 ? 2 : row < 2 ? 1 : 0,
                        animOffset: Math.random() * Math.PI * 2,
                    })
                }
            }
            gameStateRef.current.enemies = enemies
            gameStateRef.current.enemySpeed = waveConfig.enemySpeed
            gameStateRef.current.enemyDropAmount = waveConfig.enemyDropAmount
            gameStateRef.current.enemyShotInterval = waveConfig.enemyShotInterval
        }

        gameStateRef.current.enemyDirection = 1
        gameStateRef.current.playerBullets = []
        gameStateRef.current.enemyBullets = []
    }, [])

    // Initialize game
    const initGame = useCallback(() => {
        // FULL reset of all game state - fix wave skipping bug
        gameStateRef.current = {
            ...gameStateRef.current,
            playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
            enemies: [],
            boss: null,
            playerBullets: [],
            enemyBullets: [],
            particles: [],
            powerUps: [],
            activePowerUps: [],
            hasShield: false,
            screenShake: 0,
            enemyDirection: 1,
            enemySpeed: 0.35,
            enemyDropAmount: 10,
            lastEnemyShot: 0,
            enemyShotInterval: 1700,
            lastShot: 0,
            frameCount: 0, // Reset frame count for fresh animations
            wave: 1,
            isBossWave: false,
            isTransitioning: false,
        }
        spawnWave(1)
        setScore(0)
        setLives(3)
        setCurrentWave(1)
        setGameOver(false)
        setWon(false)
        setShowInstructions(false)
        setShowWaveTransition(false)
    }, [spawnWave])

    // Next wave
    const nextWave = useCallback(() => {
        // Prevent multiple calls (race condition fix)
        if (gameStateRef.current.isTransitioning) return
        gameStateRef.current.isTransitioning = true

        const newWave = gameStateRef.current.wave + 1
        gameStateRef.current.wave = newWave
        setCurrentWave(newWave)

        if (newWave > WAVES.length) {
            setWon(true)
            return
        }

        const waveConfig = WAVES[newWave - 1]
        if (waveConfig.isBossWave) {
            setWaveTransitionText("⚠️ JEFE FINAL ⚠️")
        } else {
            setWaveTransitionText(`OLEADA ${newWave}`)
        }
        setShowWaveTransition(true)
        retroSound.playWaveTransition()

        setTimeout(() => {
            setShowWaveTransition(false)
            spawnWave(newWave)
            gameStateRef.current.isTransitioning = false
        }, 2000)
    }, [spawnWave])

    // Create explosion particles
    const createExplosion = (x: number, y: number, color: string, count: number = 20) => {
        const particles: Particle[] = []
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
            const speed = Math.random() * 4 + 2
            const life = Math.random() * 30 + 20
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life, maxLife: life,
                color,
                size: Math.random() * 4 + 2,
            })
        }
        gameStateRef.current.particles.push(...particles)
    }

    // Spawn power-up (20% chance)
    const spawnPowerUp = (x: number, y: number) => {
        if (Math.random() > 0.20) return
        const types: PowerUpType[] = ['speed', 'tripleShot', 'shield', 'rapidFire', 'invincibility']
        const type = types[Math.floor(Math.random() * types.length)]
        gameStateRef.current.powerUps.push({ x, y, type, alive: true })
    }

    // Draw power-up
    const drawPowerUp = (ctx: CanvasRenderingContext2D, powerUp: PowerUp, frame: number) => {
        const { x, y, type } = powerUp
        const colors: Record<PowerUpType, { main: string, icon: string }> = {
            speed: { main: '#22d3ee', icon: '⚡' },
            tripleShot: { main: '#f97316', icon: '🔱' },
            shield: { main: '#22c55e', icon: '🛡️' },
            rapidFire: { main: '#eab308', icon: '🔥' },
            invincibility: { main: '#a855f7', icon: '⭐' }
        }
        const { main, icon } = colors[type]
        const pulse = Math.sin(frame * 0.15) * 0.3 + 0.7
        const bob = Math.sin(frame * 0.1) * 3

        ctx.save()
        ctx.shadowColor = main
        ctx.shadowBlur = 20 * pulse

        // Outer glow
        const grad = ctx.createRadialGradient(x, y + bob, 0, x, y + bob, 20)
        grad.addColorStop(0, main)
        grad.addColorStop(0.5, `${main}88`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y + bob, 18, 0, Math.PI * 2)
        ctx.fill()

        // Icon
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#fff'
        ctx.fillText(icon, x, y + bob)
        ctx.restore()
    }

    // Check if power-up is active
    const hasPowerUp = (type: PowerUpType): boolean => {
        return gameStateRef.current.activePowerUps.some(p => p.type === type && p.endTime > Date.now())
    }

    // Draw AI robot enemy
    const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy, frame: number) => {
        const { x, y, type, animOffset } = enemy
        const colors = [
            { main: "#22d3ee", glow: "rgba(34, 211, 238, 0.6)" },
            { main: "#ec4899", glow: "rgba(236, 72, 153, 0.6)" },
            { main: "#f97316", glow: "rgba(249, 115, 22, 0.6)" },
        ]
        const { main } = colors[type]
        const pulse = Math.sin(frame * 0.08 + animOffset) * 0.2 + 0.8

        ctx.save()
        ctx.shadowColor = main
        ctx.shadowBlur = 15 * pulse

        const bodyGrad = ctx.createLinearGradient(x, y, x, y + ENEMY_HEIGHT)
        bodyGrad.addColorStop(0, main)
        bodyGrad.addColorStop(1, `${main}88`)
        ctx.fillStyle = bodyGrad

        ctx.beginPath()
        ctx.roundRect(x + 6, y + 8, ENEMY_WIDTH - 12, ENEMY_HEIGHT - 10, 6)
        ctx.fill()

        ctx.beginPath()
        ctx.roundRect(x + 10, y - 2, ENEMY_WIDTH - 20, 14, 4)
        ctx.fill()

        const eyeGlow = Math.sin(frame * 0.12 + animOffset) * 0.5 + 0.5
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + eyeGlow * 0.2})`
        ctx.shadowColor = "#fff"
        ctx.shadowBlur = 8
        const eyeOffset = Math.sin(frame * 0.06 + animOffset) * 2
        ctx.beginPath()
        ctx.arc(x + 16 + eyeOffset, y + 5, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + ENEMY_WIDTH - 16 + eyeOffset, y + 5, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = main
        ctx.shadowColor = main
        ctx.shadowBlur = 10
        ctx.fillRect(x + ENEMY_WIDTH / 2 - 2, y - 10, 4, 10)
        ctx.beginPath()
        ctx.arc(x + ENEMY_WIDTH / 2, y - 12, 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + eyeGlow * 0.4})`
        ctx.fill()

        ctx.fillStyle = main
        const armOffset = Math.sin(frame * 0.1 + animOffset) * 4
        ctx.beginPath()
        ctx.roundRect(x - 6, y + 14 + armOffset, 10, 8, 3)
        ctx.fill()
        ctx.beginPath()
        ctx.roundRect(x + ENEMY_WIDTH - 4, y + 14 - armOffset, 10, 8, 3)
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.font = "bold 10px 'Courier New', monospace"
        ctx.textAlign = "center"
        ctx.fillText("AI", x + ENEMY_WIDTH / 2, y + 24)
        ctx.restore()
    }

    // Draw Boss with Epic Health Bar and Animation States
    const drawBoss = (ctx: CanvasRenderingContext2D, boss: Boss, frame: number) => {
        const { x, y, health, maxHealth, phase, animState, animTimer } = boss
        const healthPercent = health / maxHealth
        const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7
        const dangerPulse = healthPercent < 0.3 ? Math.sin(frame * 0.2) * 0.5 + 0.5 : 0

        ctx.save()

        // Animation-based transformations
        let offsetY = 0
        let scale = 1

        // Attack animation - recoil effect
        if (animState === 'attack') {
            offsetY = Math.sin(animTimer * 0.5) * 3
            scale = 1 + Math.sin(animTimer * 0.3) * 0.02
        }

        // Damage animation - shake and flash
        if (animState === 'damage') {
            offsetY = (Math.random() - 0.5) * 6
            const flashOffset = (Math.random() - 0.5) * 4
            ctx.translate(flashOffset, 0)
        }

        // Summon animation - pulsing glow
        if (animState === 'summon') {
            scale = 1 + Math.sin(animTimer * 0.15) * 0.05
        }

        // Apply scale transformation
        ctx.translate(x + BOSS_WIDTH / 2, y + BOSS_HEIGHT / 2)
        ctx.scale(scale, scale)
        ctx.translate(-(x + BOSS_WIDTH / 2), -(y + BOSS_HEIGHT / 2))

        // Boss glow - more intense when damaged or summoning
        const baseGlowColor = healthPercent > 0.5 ? "#ec4899" : healthPercent > 0.25 ? "#f97316" : "#ef4444"
        const glowColor = animState === 'damage' ? "#ff0000" :
            animState === 'summon' ? "#a855f7" :
                animState === 'attack' ? "#ffff00" : baseGlowColor
        ctx.shadowColor = glowColor
        ctx.shadowBlur = animState === 'summon' ? 50 + Math.sin(animTimer * 0.1) * 20 :
            animState === 'damage' ? 40 :
                animState === 'attack' ? 35 :
                    30 + dangerPulse * 20

        // Main body with animation offset
        const drawY = y + offsetY
        const bodyGrad = ctx.createLinearGradient(x, drawY, x + BOSS_WIDTH, drawY + BOSS_HEIGHT)

        // Flash red when damaged
        if (animState === 'damage') {
            bodyGrad.addColorStop(0, "#4a1e1e")
            bodyGrad.addColorStop(0.5, "#6d2d2d")
            bodyGrad.addColorStop(1, "#4a1e1e")
        } else if (animState === 'summon') {
            bodyGrad.addColorStop(0, "#2e1e4a")
            bodyGrad.addColorStop(0.5, "#3d2d6d")
            bodyGrad.addColorStop(1, "#2e1e4a")
        } else {
            bodyGrad.addColorStop(0, "#1e1e2e")
            bodyGrad.addColorStop(0.5, "#2d2d3d")
            bodyGrad.addColorStop(1, "#1e1e2e")
        }
        ctx.fillStyle = bodyGrad

        // Main hull
        ctx.beginPath()
        ctx.moveTo(x + BOSS_WIDTH / 2, drawY)
        ctx.lineTo(x + BOSS_WIDTH, drawY + 40)
        ctx.lineTo(x + BOSS_WIDTH - 20, drawY + BOSS_HEIGHT)
        ctx.lineTo(x + 20, drawY + BOSS_HEIGHT)
        ctx.lineTo(x, drawY + 40)
        ctx.closePath()
        ctx.fill()

        // Outer edge glow
        ctx.strokeStyle = glowColor
        ctx.lineWidth = animState === 'attack' ? 5 : animState === 'damage' ? 4 : 3
        ctx.stroke()

        // Central eye - react to animation state
        const baseEyeSize = 25 + pulse * 5
        const eyeSize = animState === 'attack' ? baseEyeSize + 8 :
            animState === 'damage' ? baseEyeSize + 5 :
                animState === 'summon' ? baseEyeSize + Math.sin(animTimer * 0.2) * 8 :
                    baseEyeSize
        const eyeGrad = ctx.createRadialGradient(
            x + BOSS_WIDTH / 2, drawY + 45, 0,
            x + BOSS_WIDTH / 2, drawY + 45, eyeSize
        )

        const eyeColor = animState === 'attack' ? "#ffff00" :
            animState === 'damage' ? "#ff4444" :
                animState === 'summon' ? "#bf7fff" : glowColor
        eyeGrad.addColorStop(0, "#fff")
        eyeGrad.addColorStop(0.3, eyeColor)
        eyeGrad.addColorStop(1, "transparent")
        ctx.fillStyle = eyeGrad
        ctx.beginPath()
        ctx.arc(x + BOSS_WIDTH / 2, drawY + 45, eyeSize, 0, Math.PI * 2)
        ctx.fill()

        // Side cannons - glow when attacking
        ctx.fillStyle = animState === 'attack' ? "#5d5d7d" : "#3d3d4d"
        ctx.shadowBlur = animState === 'attack' ? 25 : 15
        ctx.beginPath()
        ctx.roundRect(x - 15, drawY + 30, 25, 50, 5)
        ctx.fill()
        ctx.beginPath()
        ctx.roundRect(x + BOSS_WIDTH - 10, drawY + 30, 25, 50, 5)
        ctx.fill()

        // Cannon tips glow - pulse when attacking
        const cannonGlow = animState === 'attack' ? "#ffff00" : glowColor
        const cannonSize = animState === 'attack' ? 12 : 8
        ctx.fillStyle = cannonGlow
        ctx.beginPath()
        ctx.arc(x - 2, drawY + 80, cannonSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + BOSS_WIDTH + 2, drawY + 80, cannonSize, 0, Math.PI * 2)
        ctx.fill()

        // Summon portal effect under boss
        if (animState === 'summon') {
            const portalPulse = Math.sin(animTimer * 0.15) * 0.5 + 0.5
            const portalGrad = ctx.createRadialGradient(
                x + BOSS_WIDTH / 2, drawY + BOSS_HEIGHT + 20, 0,
                x + BOSS_WIDTH / 2, drawY + BOSS_HEIGHT + 20, 80
            )
            portalGrad.addColorStop(0, `rgba(168, 85, 247, ${0.8 * portalPulse})`)
            portalGrad.addColorStop(0.5, `rgba(236, 72, 153, ${0.4 * portalPulse})`)
            portalGrad.addColorStop(1, "transparent")
            ctx.fillStyle = portalGrad
            ctx.beginPath()
            ctx.ellipse(x + BOSS_WIDTH / 2, drawY + BOSS_HEIGHT + 20, 80, 30, 0, 0, Math.PI * 2)
            ctx.fill()
        }

        // AI Core text
        ctx.shadowBlur = 0
        ctx.fillStyle = animState === 'damage' ? "#ff6666" : "#fff"
        ctx.font = "bold 16px 'Courier New', monospace"
        ctx.textAlign = "center"
        ctx.fillText("MEGA AI", x + BOSS_WIDTH / 2, drawY + 50)
        ctx.font = "12px monospace"
        ctx.fillStyle = glowColor
        const phaseText = animState === 'summon' ? "SUMMONING!" :
            animState === 'attack' ? `PHASE ${phase} ⚡` :
                animState === 'damage' ? "DAMAGED!" :
                    `PHASE ${phase}`
        ctx.fillText(phaseText, x + BOSS_WIDTH / 2, drawY + 68)

        ctx.restore()
    }

    // Draw Epic Boss Health Bar (HUD at top)
    const drawBossHealthBar = (ctx: CanvasRenderingContext2D, boss: Boss, frame: number) => {
        const { health, maxHealth, phase } = boss
        const healthPercent = health / maxHealth
        const barWidth = 500
        const barHeight = 20
        const barX = (CANVAS_WIDTH - barWidth) / 2
        const barY = 50
        const segments = 25
        const segmentWidth = barWidth / segments
        const glitchOffset = healthPercent < 0.3 ? (Math.random() - 0.5) * 4 : 0

        ctx.save()
        ctx.translate(glitchOffset, 0)

        // Outer frame with electricity
        ctx.strokeStyle = "#0ff"
        ctx.lineWidth = 2
        ctx.shadowColor = "#0ff"
        ctx.shadowBlur = 15
        ctx.strokeRect(barX - 8, barY - 8, barWidth + 16, barHeight + 16)

        // Electric arcs
        for (let i = 0; i < 4; i++) {
            const arcX = barX - 10 + Math.random() * (barWidth + 20)
            const arcY = barY - 10 + Math.random() * (barHeight + 20)
            if (Math.random() > 0.7) {
                ctx.beginPath()
                ctx.moveTo(arcX, arcY)
                ctx.lineTo(arcX + (Math.random() - 0.5) * 15, arcY + (Math.random() - 0.5) * 15)
                ctx.strokeStyle = `rgba(0, 255, 255, ${Math.random()})`
                ctx.stroke()
            }
        }

        // Background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.fillRect(barX, barY, barWidth, barHeight)

        // Health gradient
        const healthColor = healthPercent > 0.5 ? "#22c55e" : healthPercent > 0.25 ? "#f97316" : "#ef4444"
        const healthGrad = ctx.createLinearGradient(barX, barY, barX + barWidth, barY)
        healthGrad.addColorStop(0, healthColor)
        healthGrad.addColorStop(0.5, "#fff")
        healthGrad.addColorStop(1, healthColor)

        // Draw segments
        const filledSegments = Math.ceil(segments * healthPercent)
        for (let i = 0; i < filledSegments; i++) {
            const segX = barX + i * segmentWidth + 1
            const pulse = Math.sin(frame * 0.1 + i * 0.3) * 0.2 + 0.8
            ctx.fillStyle = healthColor
            ctx.globalAlpha = pulse
            ctx.shadowColor = healthColor
            ctx.shadowBlur = 10
            ctx.fillRect(segX, barY + 2, segmentWidth - 2, barHeight - 4)
        }
        ctx.globalAlpha = 1

        // Segment dividers
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
        ctx.lineWidth = 1
        for (let i = 1; i < segments; i++) {
            ctx.beginPath()
            ctx.moveTo(barX + i * segmentWidth, barY)
            ctx.lineTo(barX + i * segmentWidth, barY + barHeight)
            ctx.stroke()
        }

        // Boss name
        ctx.shadowColor = "#ec4899"
        ctx.shadowBlur = 20
        ctx.fillStyle = "#fff"
        ctx.font = "bold 14px 'Courier New', monospace"
        ctx.textAlign = "center"
        ctx.fillText("◆ MEGA AI OVERLORD ◆", CANVAS_WIDTH / 2, barY - 15)

        // Phase indicator with icons
        const phaseIcons = ["⚡", "🔥", "💀"]
        ctx.font = "18px sans-serif"
        ctx.fillText(`PHASE ${phase} ${phaseIcons[phase - 1] || "⚡"}`, CANVAS_WIDTH / 2, barY + barHeight + 22)

        // Health percentage
        ctx.font = "bold 12px monospace"
        ctx.fillStyle = healthColor
        ctx.fillText(`${Math.round(healthPercent * 100)}%`, CANVAS_WIDTH / 2 + barWidth / 2 + 30, barY + 15)

        ctx.restore()
    }

    // Draw enhanced player ship (fixed glow clipping)
    const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, frame: number) => {
        const y = CANVAS_HEIGHT - PLAYER_HEIGHT - 50
        const pulse = Math.sin(frame * 0.1) * 0.3 + 0.7

        ctx.save()

        // Ship glow (drawn first, behind everything)
        const glowGrad = ctx.createRadialGradient(
            x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 2, 0,
            x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 2, PLAYER_WIDTH * 0.8
        )
        glowGrad.addColorStop(0, "rgba(34, 211, 238, 0.3)")
        glowGrad.addColorStop(0.5, "rgba(34, 211, 238, 0.1)")
        glowGrad.addColorStop(1, "transparent")
        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 2, PLAYER_WIDTH * 0.8, 0, Math.PI * 2)
        ctx.fill()

        // Engine flame (behind ship)
        const flameHeight = Math.sin(frame * 0.3) * 10 + 18
        const flameGrad = ctx.createLinearGradient(
            x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT,
            x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT + flameHeight
        )
        flameGrad.addColorStop(0, "rgba(236, 72, 153, 1)")
        flameGrad.addColorStop(0.4, "rgba(249, 115, 22, 0.9)")
        flameGrad.addColorStop(1, "transparent")
        ctx.fillStyle = flameGrad
        ctx.beginPath()
        ctx.moveTo(x + PLAYER_WIDTH / 2 - 10, y + PLAYER_HEIGHT - 3)
        ctx.lineTo(x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT + flameHeight)
        ctx.lineTo(x + PLAYER_WIDTH / 2 + 10, y + PLAYER_HEIGHT - 3)
        ctx.closePath()
        ctx.fill()

        // Main ship body
        ctx.shadowColor = "#22d3ee"
        ctx.shadowBlur = 20 * pulse

        const bodyGrad = ctx.createLinearGradient(x, y, x + PLAYER_WIDTH, y + PLAYER_HEIGHT)
        bodyGrad.addColorStop(0, "#22d3ee")
        bodyGrad.addColorStop(0.5, "#0ea5e9")
        bodyGrad.addColorStop(1, "#22d3ee")
        ctx.fillStyle = bodyGrad

        ctx.beginPath()
        ctx.moveTo(x + PLAYER_WIDTH / 2, y - 8)
        ctx.lineTo(x + PLAYER_WIDTH + 3, y + PLAYER_HEIGHT)
        ctx.lineTo(x + PLAYER_WIDTH - 12, y + PLAYER_HEIGHT - 5)
        ctx.lineTo(x + 12, y + PLAYER_HEIGHT - 5)
        ctx.lineTo(x - 3, y + PLAYER_HEIGHT)
        ctx.closePath()
        ctx.fill()

        // Cockpit
        ctx.shadowBlur = 5
        const cockpitGrad = ctx.createRadialGradient(
            x + PLAYER_WIDTH / 2, y + 12, 0,
            x + PLAYER_WIDTH / 2, y + 12, 10
        )
        cockpitGrad.addColorStop(0, "#fff")
        cockpitGrad.addColorStop(0.5, "#a5f3fc")
        cockpitGrad.addColorStop(1, "#22d3ee")
        ctx.fillStyle = cockpitGrad
        ctx.beginPath()
        ctx.ellipse(x + PLAYER_WIDTH / 2, y + 10, 8, 6, 0, 0, Math.PI * 2)
        ctx.fill()

        // Wing accents
        ctx.fillStyle = "#ec4899"
        ctx.shadowColor = "#ec4899"
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.roundRect(x - 6, y + PLAYER_HEIGHT - 12, 14, 12, 3)
        ctx.fill()
        ctx.beginPath()
        ctx.roundRect(x + PLAYER_WIDTH - 8, y + PLAYER_HEIGHT - 12, 14, 12, 3)
        ctx.fill()

        ctx.restore()
    }

    // Draw bullet with trail
    const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet, frame: number) => {
        const color = bullet.isBoss ? "#ef4444" : bullet.isEnemy ? "#ec4899" : "#22d3ee"
        const size = bullet.isBoss ? 8 : BULLET_WIDTH

        ctx.save()
        ctx.shadowColor = color
        ctx.shadowBlur = 15

        const trailGrad = ctx.createLinearGradient(
            bullet.x, bullet.y,
            bullet.x, bullet.isEnemy ? bullet.y - 25 : bullet.y + 25
        )
        trailGrad.addColorStop(0, color)
        trailGrad.addColorStop(1, "transparent")
        ctx.fillStyle = trailGrad
        ctx.fillRect(bullet.x - size / 2, bullet.isEnemy ? bullet.y : bullet.y - 20, size, BULLET_HEIGHT + 20)

        ctx.fillStyle = "#fff"
        ctx.beginPath()
        ctx.roundRect(bullet.x - size / 2, bullet.y, size, BULLET_HEIGHT, 2)
        ctx.fill()
        ctx.restore()
    }

    // Draw particles
    const drawParticles = (ctx: CanvasRenderingContext2D) => {
        ctx.save()
        gameStateRef.current.particles.forEach(p => {
            const alpha = p.life / p.maxLife
            ctx.fillStyle = p.color
            ctx.globalAlpha = alpha
            ctx.shadowColor = p.color
            ctx.shadowBlur = 10 * alpha
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
            ctx.fill()
        })
        ctx.restore()
    }

    // Draw background
    const drawBackground = (ctx: CanvasRenderingContext2D, frame: number) => {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
        bgGrad.addColorStop(0, "#0a0a12")
        bgGrad.addColorStop(0.5, "#0d0d1a")
        bgGrad.addColorStop(1, "#0a0a12")
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        ctx.globalAlpha = 0.15
        const nebulaGrad = ctx.createRadialGradient(
            CANVAS_WIDTH / 2 + Math.sin(frame * 0.008) * 100,
            CANVAS_HEIGHT / 3 + Math.cos(frame * 0.006) * 50,
            0,
            CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3, 450
        )
        nebulaGrad.addColorStop(0, "rgba(236, 72, 153, 0.4)")
        nebulaGrad.addColorStop(0.5, "rgba(34, 211, 238, 0.3)")
        nebulaGrad.addColorStop(1, "transparent")
        ctx.fillStyle = nebulaGrad
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.globalAlpha = 1

        starsRef.current.forEach(star => {
            star.y += star.speed
            if (star.y > CANVAS_HEIGHT) {
                star.y = 0
                star.x = Math.random() * CANVAS_WIDTH
            }
            const twinkle = Math.sin(frame * 0.1 + star.x) * 0.3 + 0.7
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
            ctx.fill()
        })
    }

    // Draw styled text
    const drawText = (
        ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
        size: number, color: string, align: CanvasTextAlign = "left"
    ) => {
        ctx.save()
        ctx.font = `bold ${size}px 'Segoe UI', 'Arial', sans-serif`
        ctx.textAlign = align
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.fillText(text, x, y)
        ctx.restore()
    }

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem("spaceInvadersHighScore")
        if (saved) setHighScore(parseInt(saved))
    }, [])

    // Game loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number

        const gameLoop = () => {
            const state = gameStateRef.current
            state.frameCount++

            drawBackground(ctx, state.frameCount)

            // Instructions screen - visuals handled by JSX overlay
            if (showInstructions) {
                animationId = requestAnimationFrame(gameLoop)
                return
            }

            // Wave transition
            if (showWaveTransition) {
                drawText(ctx, waveTransitionText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 48, "#fff", "center")
                if (state.wave === WAVES.length) {
                    drawText(ctx, "¡Prepárate para la batalla final!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50, 20, "#ef4444", "center")
                }
                animationId = requestAnimationFrame(gameLoop)
                return
            }

            if (gameOver || won || isPaused) {
                if (state.boss?.alive) drawBoss(ctx, state.boss, state.frameCount)
                state.enemies.forEach(e => { if (e.alive) drawEnemy(ctx, e, state.frameCount) })
                drawPlayer(ctx, state.playerX, state.frameCount)
                state.playerBullets.forEach(b => drawBullet(ctx, b, state.frameCount))
                state.enemyBullets.forEach(b => drawBullet(ctx, b, state.frameCount))
                drawParticles(ctx)
                animationId = requestAnimationFrame(gameLoop)
                return
            }

            // Player movement (with speed boost)
            const moveSpeed = hasPowerUp('speed') ? 12 : 8
            if (state.keys.left && state.playerX > 15) state.playerX -= moveSpeed
            if (state.keys.right && state.playerX < CANVAS_WIDTH - PLAYER_WIDTH - 15) state.playerX += moveSpeed

            // Clean up expired power-ups
            state.activePowerUps = state.activePowerUps.filter(p => p.endTime > Date.now())

            // Player shooting (with rapid fire and triple shot)
            const shootCooldown = hasPowerUp('rapidFire') ? 100 : 200
            if (state.keys.shoot && Date.now() - state.lastShot > shootCooldown) {
                if (hasPowerUp('tripleShot')) {
                    // Triple shot - fan pattern
                    state.playerBullets.push({ x: state.playerX + PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - PLAYER_HEIGHT - 60, isEnemy: false })
                    state.playerBullets.push({ x: state.playerX + PLAYER_WIDTH / 2 - 15, y: CANVAS_HEIGHT - PLAYER_HEIGHT - 55, isEnemy: false })
                    state.playerBullets.push({ x: state.playerX + PLAYER_WIDTH / 2 + 15, y: CANVAS_HEIGHT - PLAYER_HEIGHT - 55, isEnemy: false })
                } else {
                    state.playerBullets.push({ x: state.playerX + PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - PLAYER_HEIGHT - 60, isEnemy: false })
                }
                state.lastShot = Date.now()
                retroSound.playShoot()
            }

            // Move bullets
            state.playerBullets = state.playerBullets.filter(b => { b.y -= 14; return b.y > -BULLET_HEIGHT })
            state.enemyBullets = state.enemyBullets.filter(b => {
                // Smart bullets use velocity, normal bullets go straight down
                if (b.vx !== undefined && b.vy !== undefined) {
                    b.x += b.vx
                    b.y += b.vy
                } else {
                    b.y += (b.isBoss ? 7 : 5)
                }
                return b.y < CANVAS_HEIGHT && b.x > 0 && b.x < CANVAS_WIDTH
            })

            // Boss logic
            if (state.isBossWave && state.boss?.alive) {
                const boss = state.boss
                const healthPercent = boss.health / boss.maxHealth
                const now = Date.now()

                // Update animation timer
                boss.animTimer++

                // Auto-reset animation state after duration
                if (boss.animState === 'attack' && boss.animTimer > 15) {
                    boss.animState = 'idle'
                    boss.animTimer = 0
                }
                if (boss.animState === 'damage' && now - boss.lastDamage > 200) {
                    boss.animState = 'idle'
                    boss.animTimer = 0
                }
                if (boss.animState === 'summon' && boss.animTimer > 60) {
                    boss.animState = 'idle'
                    boss.animTimer = 0
                }

                // Boss movement - smoother with easing, more erratic at lower health
                const moveSpeed = healthPercent < 0.3 ? 0.06 : healthPercent < 0.5 ? 0.04 : 0.03
                const moveRange = healthPercent < 0.3 ? 300 : healthPercent < 0.5 ? 250 : 200
                const moveFreq = healthPercent < 0.3 ? 0.03 : healthPercent < 0.5 ? 0.025 : 0.02
                boss.targetX = CANVAS_WIDTH / 2 - BOSS_WIDTH / 2 + Math.sin(state.frameCount * moveFreq) * moveRange
                boss.x += (boss.targetX - boss.x) * moveSpeed

                // Boss shooting - with attack animation
                const shootInterval = healthPercent > 0.5 ? 600 : healthPercent > 0.25 ? 350 : 200
                if (now - boss.lastShot > shootInterval && boss.animState !== 'summon') {
                    // Set attack animation
                    boss.animState = 'attack'
                    boss.animTimer = 0

                    // Multiple shooting patterns based on health
                    if (healthPercent > 0.5) {
                        // Phase 1: Aimed shot at player
                        const dx = state.playerX + PLAYER_WIDTH / 2 - (boss.x + BOSS_WIDTH / 2)
                        const dy = (CANVAS_HEIGHT - PLAYER_HEIGHT - 50) - (boss.y + BOSS_HEIGHT)
                        const angle = Math.atan2(dy, dx)
                        state.enemyBullets.push({
                            x: boss.x + BOSS_WIDTH / 2, y: boss.y + BOSS_HEIGHT,
                            isEnemy: true, isBoss: true,
                            vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5
                        })
                    } else if (healthPercent > 0.25) {
                        // Phase 2: Triple spread + aimed
                        for (let i = -1; i <= 1; i++) {
                            state.enemyBullets.push({
                                x: boss.x + BOSS_WIDTH / 2 + i * 40, y: boss.y + BOSS_HEIGHT,
                                isEnemy: true, isBoss: true,
                                vx: i * 2.5, vy: 6
                            })
                        }
                    } else {
                        // Phase 3: Rotating spray + aimed center
                        const sprayAngle = state.frameCount * 0.12
                        for (let i = 0; i < 8; i++) {
                            const a = sprayAngle + (Math.PI * 2 * i / 8)
                            state.enemyBullets.push({
                                x: boss.x + BOSS_WIDTH / 2,
                                y: boss.y + BOSS_HEIGHT / 2,
                                isEnemy: true, isBoss: true,
                                vx: Math.cos(a) * 3.5,
                                vy: Math.abs(Math.sin(a)) * 4.5 + 2
                            })
                        }
                    }
                    boss.lastShot = now
                    boss.phase = healthPercent > 0.5 ? 1 : healthPercent > 0.25 ? 2 : 3
                    retroSound.playShoot()
                }

                // Spawn minions at health thresholds (75%, 50%, 25%) with portal effect
                const minionThresholds = [0.75, 0.5, 0.25]
                const currentThreshold = minionThresholds.find(t =>
                    healthPercent <= t && boss.lastSummonThreshold > t
                )
                if (currentThreshold && boss.animState !== 'summon') {
                    // Set summon animation
                    boss.animState = 'summon'
                    boss.animTimer = 0
                    boss.lastSummonThreshold = currentThreshold
                    boss.summonedMinions++

                    // Create portal effect particles
                    for (let p = 0; p < 40; p++) {
                        const angle = (Math.PI * 2 * p) / 40
                        const radius = 60 + Math.random() * 20
                        createExplosion(
                            boss.x + BOSS_WIDTH / 2 + Math.cos(angle) * radius * 0.5,
                            boss.y + BOSS_HEIGHT + Math.sin(angle) * 20,
                            "#a855f7", 3
                        )
                    }

                    // Delayed minion spawn for dramatic effect
                    setTimeout(() => {
                        // Spawn 4 minions in a pattern
                        const minionCount = 3 + boss.summonedMinions // More minions each time
                        for (let i = 0; i < minionCount; i++) {
                            const offsetX = (i - (minionCount - 1) / 2) * 55
                            state.enemies.push({
                                x: boss.x + BOSS_WIDTH / 2 - ENEMY_WIDTH / 2 + offsetX,
                                y: boss.y + BOSS_HEIGHT + 30,
                                alive: true,
                                type: i % 3, // Mix of types
                                animOffset: Math.random() * Math.PI * 2
                            })
                        }
                        // Portal close explosion
                        createExplosion(boss.x + BOSS_WIDTH / 2, boss.y + BOSS_HEIGHT + 20, "#a855f7", 50)
                        createExplosion(boss.x + BOSS_WIDTH / 2, boss.y + BOSS_HEIGHT + 20, "#ec4899", 30)
                    }, 500)

                    state.screenShake = 15
                    retroSound.playPowerUp()
                }

                // Boss collision with player bullets
                state.playerBullets.forEach((bullet, bi) => {
                    if (
                        bullet.x > boss.x && bullet.x < boss.x + BOSS_WIDTH &&
                        bullet.y > boss.y && bullet.y < boss.y + BOSS_HEIGHT
                    ) {
                        state.playerBullets.splice(bi, 1)
                        const prevHealth = boss.health
                        boss.health--

                        // Damage animation
                        boss.animState = 'damage'
                        boss.lastDamage = now

                        // More intense explosion based on health
                        const explosionSize = healthPercent < 0.3 ? 15 : healthPercent < 0.5 ? 12 : 8
                        createExplosion(bullet.x, bullet.y, "#ec4899", explosionSize)

                        // Progressive screen shake
                        state.screenShake = healthPercent < 0.3 ? 8 : healthPercent < 0.5 ? 6 : 4

                        // Progressive power-up drops based on health phase
                        // 75%-50% HP: Speed boost, Rapid Fire (useful)
                        // 50%-25% HP: Triple Shot, Shield (powerful)
                        // 25%-0% HP: Invincibility, Shield (desperate help)
                        const dropThresholds = [45, 40, 35, 30, 25, 20, 15, 10, 5]
                        if (dropThresholds.includes(boss.health)) {
                            const powerUpTypes: PowerUpType[] =
                                healthPercent > 0.5 ? ['speed', 'rapidFire'] :
                                    healthPercent > 0.25 ? ['tripleShot', 'shield', 'rapidFire'] :
                                        ['invincibility', 'shield', 'tripleShot']

                            const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
                            state.powerUps.push({
                                x: boss.x + BOSS_WIDTH / 4 + Math.random() * BOSS_WIDTH / 2,
                                y: boss.y + BOSS_HEIGHT,
                                type,
                                alive: true
                            })
                            // Power-up spawn effect
                            createExplosion(boss.x + BOSS_WIDTH / 2, boss.y + BOSS_HEIGHT, "#22c55e", 15)
                        }

                        setScore(prev => {
                            const newScore = prev + 50
                            if (newScore > highScore) {
                                setHighScore(newScore)
                                localStorage.setItem("spaceInvadersHighScore", newScore.toString())
                            }
                            return newScore
                        })

                        if (boss.health <= 0) {
                            boss.alive = false
                            // Epic death explosion sequence - more dramatic
                            for (let i = 0; i < 12; i++) {
                                setTimeout(() => {
                                    createExplosion(
                                        boss.x + Math.random() * BOSS_WIDTH,
                                        boss.y + Math.random() * BOSS_HEIGHT,
                                        ["#ef4444", "#f97316", "#ec4899", "#a855f7"][i % 4],
                                        50 + i * 5
                                    )
                                }, i * 80)
                            }
                            // Final massive explosion
                            setTimeout(() => {
                                createExplosion(boss.x + BOSS_WIDTH / 2, boss.y + BOSS_HEIGHT / 2, "#fff", 100)
                            }, 1000)

                            state.screenShake = 30
                            retroSound.playBossExplosion()
                            setScore(prev => prev + 2000)
                            setTimeout(() => {
                                setWon(true)
                                retroSound.playVictory()
                            }, 1200)
                        }
                    }
                })


                drawBoss(ctx, boss, state.frameCount)
            } else {
                // Regular enemy logic
                let shouldMoveDown = false
                const aliveEnemies = state.enemies.filter(e => e.alive)

                aliveEnemies.forEach(e => { e.x += state.enemyDirection * state.enemySpeed })

                if (aliveEnemies.length > 0) {
                    const leftMost = Math.min(...aliveEnemies.map(e => e.x))
                    const rightMost = Math.max(...aliveEnemies.map(e => e.x + ENEMY_WIDTH))
                    if (leftMost <= 20 || rightMost >= CANVAS_WIDTH - 20) shouldMoveDown = true
                }

                if (shouldMoveDown) {
                    state.enemyDirection *= -1
                    aliveEnemies.forEach(e => { e.y += state.enemyDropAmount })
                    state.enemySpeed = Math.min(state.enemySpeed + 0.06, 1.8)
                }

                // Enemy shooting - with progressive smart targeting
                if (aliveEnemies.length > 0 && Date.now() - state.lastEnemyShot > state.enemyShotInterval) {
                    const bottomEnemies = aliveEnemies.filter(e =>
                        !aliveEnemies.some(other => other.x === e.x && other.y > e.y && other.alive)
                    )
                    if (bottomEnemies.length > 0) {
                        const shooter = bottomEnemies[Math.floor(Math.random() * bottomEnemies.length)]

                        // Smart shot chance increases with wave (30% → 40% → 50%)
                        // Type 2 (orange) enemies always shoot smart
                        const baseSmartChance = Math.min(0.3 + (state.wave - 1) * 0.05, 0.5)
                        const isSmartShot = shooter.type === 2 || Math.random() < baseSmartChance

                        if (isSmartShot) {
                            // Calculate angle to player with slight prediction
                            const playerCenterX = state.playerX + PLAYER_WIDTH / 2
                            const playerY = CANVAS_HEIGHT - PLAYER_HEIGHT - 50
                            // Predict where player might be (based on movement keys)
                            const prediction = state.keys.left ? -30 : state.keys.right ? 30 : 0
                            const targetX = playerCenterX + prediction

                            const dx = targetX - (shooter.x + ENEMY_WIDTH / 2)
                            const dy = playerY - (shooter.y + ENEMY_HEIGHT)
                            const angle = Math.atan2(dy, dx)
                            const bulletSpeed = shooter.type === 2 ? 5 : 4 // Orange enemies faster

                            state.enemyBullets.push({
                                x: shooter.x + ENEMY_WIDTH / 2,
                                y: shooter.y + ENEMY_HEIGHT,
                                isEnemy: true,
                                vx: Math.cos(angle) * bulletSpeed,
                                vy: Math.sin(angle) * bulletSpeed,
                                isSmart: true
                            })
                        } else {
                            state.enemyBullets.push({ x: shooter.x + ENEMY_WIDTH / 2, y: shooter.y + ENEMY_HEIGHT, isEnemy: true })
                        }
                    }
                    state.lastEnemyShot = Date.now()
                }

                // Enemy collision
                state.playerBullets.forEach((bullet, bi) => {
                    state.enemies.forEach(enemy => {
                        if (enemy.alive &&
                            bullet.x > enemy.x && bullet.x < enemy.x + ENEMY_WIDTH &&
                            bullet.y > enemy.y && bullet.y < enemy.y + ENEMY_HEIGHT
                        ) {
                            enemy.alive = false
                            state.playerBullets.splice(bi, 1)
                            createExplosion(enemy.x + ENEMY_WIDTH / 2, enemy.y + ENEMY_HEIGHT / 2,
                                ["#22d3ee", "#ec4899", "#f97316"][enemy.type], 25)
                            retroSound.playEnemyExplosion()
                            // Spawn power-up (20% chance)
                            spawnPowerUp(enemy.x + ENEMY_WIDTH / 2, enemy.y + ENEMY_HEIGHT / 2)
                            // Screen shake
                            state.screenShake = 3
                            setScore(prev => {
                                const newScore = prev + (enemy.type + 1) * 100
                                if (newScore > highScore) {
                                    setHighScore(newScore)
                                    localStorage.setItem("spaceInvadersHighScore", newScore.toString())
                                }
                                return newScore
                            })
                        }
                    })
                })

                // Check wave clear (use ref flag to prevent race condition)
                if (aliveEnemies.length === 0 && !state.isTransitioning) {
                    nextWave()
                }

                // Check lose - enemies reach bottom
                if (aliveEnemies.some(e => e.y > CANVAS_HEIGHT - 140)) {
                    setGameOver(true)
                    retroSound.playGameOver()
                }

                state.enemies.forEach(e => { if (e.alive) drawEnemy(ctx, e, state.frameCount) })
            }

            // Player collision with enemy bullets (with shield/invincibility)
            const playerY = CANVAS_HEIGHT - PLAYER_HEIGHT - 50
            state.enemyBullets.forEach((bullet, bi) => {
                if (
                    bullet.x > state.playerX && bullet.x < state.playerX + PLAYER_WIDTH &&
                    bullet.y > playerY && bullet.y < playerY + PLAYER_HEIGHT
                ) {
                    state.enemyBullets.splice(bi, 1)

                    // Check for invincibility or shield
                    if (hasPowerUp('invincibility')) {
                        createExplosion(bullet.x, bullet.y, "#a855f7", 15)
                        return
                    }
                    if (state.hasShield) {
                        state.hasShield = false
                        createExplosion(bullet.x, bullet.y, "#22c55e", 20)
                        state.screenShake = 5
                        retroSound.playShieldBreak()
                        return
                    }

                    createExplosion(state.playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT / 2, "#22d3ee", 30)
                    state.screenShake = 8
                    retroSound.playPlayerHit()
                    setLives(prev => {
                        if (prev - 1 <= 0) {
                            setGameOver(true)
                            retroSound.playGameOver()
                        }
                        return prev - 1
                    })
                }
            })

            // Move and collect power-ups
            state.powerUps = state.powerUps.filter(p => {
                p.y += 2 // Fall speed
                // Check collision with player
                const dist = Math.hypot(p.x - (state.playerX + PLAYER_WIDTH / 2), p.y - playerY)
                if (dist < 40) {
                    // Activate power-up (5 seconds duration)
                    if (p.type === 'shield') {
                        state.hasShield = true
                    } else {
                        state.activePowerUps.push({ type: p.type, endTime: Date.now() + 5000 })
                    }
                    createExplosion(p.x, p.y, "#fff", 15)
                    retroSound.playPowerUp()
                    return false
                }
                return p.y < CANVAS_HEIGHT && p.alive
            })

            // Update screen shake
            if (state.screenShake > 0) state.screenShake *= 0.9

            // Update particles
            state.particles = state.particles.filter(p => {
                p.x += p.vx
                p.y += p.vy
                p.vy += 0.08
                p.life--
                return p.life > 0
            })

            // Apply screen shake
            ctx.save()
            if (state.screenShake > 0.5) {
                ctx.translate((Math.random() - 0.5) * state.screenShake * 2, (Math.random() - 0.5) * state.screenShake * 2)
            }

            drawPlayer(ctx, state.playerX, state.frameCount)
            state.playerBullets.forEach(b => drawBullet(ctx, b, state.frameCount))
            state.enemyBullets.forEach(b => drawBullet(ctx, b, state.frameCount))
            state.powerUps.forEach(p => drawPowerUp(ctx, p, state.frameCount))
            drawParticles(ctx)

            // Draw shield indicator
            if (state.hasShield) {
                ctx.strokeStyle = "#22c55e"
                ctx.lineWidth = 3
                ctx.shadowColor = "#22c55e"
                ctx.shadowBlur = 15
                ctx.beginPath()
                ctx.arc(state.playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT / 2, 35, 0, Math.PI * 2)
                ctx.stroke()
            }

            // Draw invincibility aura
            if (hasPowerUp('invincibility')) {
                const invPulse = Math.sin(state.frameCount * 0.2) * 0.3 + 0.7
                ctx.strokeStyle = `rgba(168, 85, 247, ${invPulse})`
                ctx.lineWidth = 4
                ctx.shadowColor = "#a855f7"
                ctx.shadowBlur = 25
                ctx.beginPath()
                ctx.arc(state.playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT / 2, 40 + Math.sin(state.frameCount * 0.1) * 5, 0, Math.PI * 2)
                ctx.stroke()
            }

            ctx.restore()

            // Draw epic boss health bar if boss is alive
            if (state.isBossWave && state.boss?.alive) {
                drawBossHealthBar(ctx, state.boss, state.frameCount)
            }

            // UI
            drawText(ctx, "SCORE", 30, 35, 14, "#71717a")
            drawText(ctx, `${score}`, 30, 62, 30, "#fff")

            drawText(ctx, "HIGH SCORE", CANVAS_WIDTH - 30, 35, 14, "#71717a", "right")
            drawText(ctx, `${highScore}`, CANVAS_WIDTH - 30, 62, 30, "#22d3ee", "right")

            // Wave indicator (only if not boss wave with its own HUD)
            if (!state.isBossWave || !state.boss?.alive) {
                drawText(ctx, `OLEADA ${currentWave}/${WAVES.length}`, CANVAS_WIDTH / 2, 35, 16, "#ec4899", "center")
            }

            // Active power-ups display
            const activePowers = state.activePowerUps.filter(p => p.endTime > Date.now())
            if (activePowers.length > 0 || state.hasShield) {
                const powerIcons: Record<PowerUpType, string> = { speed: '⚡', tripleShot: '🔱', shield: '🛡️', rapidFire: '🔥', invincibility: '⭐' }
                let xPos = CANVAS_WIDTH - 50
                if (state.hasShield) {
                    ctx.font = "20px sans-serif"
                    ctx.fillStyle = "#22c55e"
                    ctx.textAlign = "center"
                    ctx.fillText("🛡️", xPos, CANVAS_HEIGHT - 28)
                    xPos -= 30
                }
                activePowers.forEach(p => {
                    const remaining = Math.ceil((p.endTime - Date.now()) / 1000)
                    ctx.font = "20px sans-serif"
                    ctx.fillStyle = "#fff"
                    ctx.textAlign = "center"
                    ctx.fillText(powerIcons[p.type], xPos, CANVAS_HEIGHT - 28)
                    ctx.font = "10px monospace"
                    ctx.fillText(`${remaining}s`, xPos, CANVAS_HEIGHT - 10)
                    xPos -= 35
                })
            }

            // Lives
            drawText(ctx, "LIVES", 30, CANVAS_HEIGHT - 40, 12, "#71717a")
            ctx.save()
            for (let i = 0; i < lives; i++) {
                ctx.fillStyle = "#ec4899"
                ctx.shadowColor = "#ec4899"
                ctx.shadowBlur = 10
                ctx.font = "22px sans-serif"
                ctx.fillText("♥", 85 + i * 28, CANVAS_HEIGHT - 28)
            }
            ctx.restore()

            animationId = requestAnimationFrame(gameLoop)
        }

        gameLoop()
        return () => cancelAnimationFrame(animationId)
    }, [gameOver, won, isPaused, score, lives, highScore, showInstructions, showWaveTransition, waveTransitionText, currentWave, nextWave])

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") gameStateRef.current.keys.left = true
            if (e.key === "ArrowRight" || e.key === "d") gameStateRef.current.keys.right = true
            if (e.key === " " || e.key === "ArrowUp") {
                e.preventDefault()
                gameStateRef.current.keys.shoot = true
                if (showInstructions) initGame()
            }
            if (e.key === "Escape") onClose()
            if (e.key === "p" && !showInstructions) setIsPaused(prev => !prev)
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") gameStateRef.current.keys.left = false
            if (e.key === "ArrowRight" || e.key === "d") gameStateRef.current.keys.right = false
            if (e.key === " " || e.key === "ArrowUp") gameStateRef.current.keys.shoot = false
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [onClose, showInstructions, initGame])

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div
                className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(236, 72, 153, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(34, 211, 238, 0.2) 0%, transparent 50%)" }}
            />

            <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:rotate-90 z-10 group">
                <X className="w-6 h-6 text-white/70 group-hover:text-white" />
            </button>

            <button onClick={() => setSoundEnabled(!soundEnabled)} className="absolute top-6 left-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all z-10">
                {soundEnabled ? <Volume2 className="w-6 h-6 text-white/70" /> : <VolumeX className="w-6 h-6 text-white/70" />}
            </button>

            <div className="relative">
                <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-500/30 via-pink-500/30 to-orange-500/30">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="rounded-lg"
                        style={{ boxShadow: "0 0 60px rgba(34, 211, 238, 0.2), 0 0 100px rgba(236, 72, 153, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.5)" }}
                    />

                    {/* CRT Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden" style={{
                        background: `
                            repeating-linear-gradient(
                                0deg,
                                rgba(0, 0, 0, 0.15) 0px,
                                rgba(0, 0, 0, 0.15) 1px,
                                transparent 1px,
                                transparent 3px
                            )
                        `,
                    }} />

                    {/* Chromatic Aberration / RGB Split effect */}
                    <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden" style={{
                        background: `
                            linear-gradient(90deg, rgba(255,0,0,0.03) 0%, transparent 10%, transparent 90%, rgba(0,255,255,0.03) 100%)
                        `,
                        mixBlendMode: 'screen',
                    }} />

                    {/* Screen curvature vignette */}
                    <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
                        background: `
                            radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)
                        `,
                        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
                    }} />

                    {/* Phosphor glow effect */}
                    <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
                        background: `
                            radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 60%)
                        `,
                        animation: 'crt-flicker 0.15s infinite',
                    }} />

                    {/* Horizontal scan line moving */}
                    <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                        <div
                            className="absolute w-full h-[2px] opacity-10"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                animation: 'crt-scanline 8s linear infinite',
                            }}
                        />
                    </div>
                </div>

                <style jsx>{`
                    @keyframes crt-flicker {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.98; }
                    }
                    @keyframes crt-scanline {
                        0% { top: -2px; }
                        100% { top: 100%; }
                    }
                `}</style>

                {gameOver && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl overflow-hidden">
                        {/* CRT effect on overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
                        }} />
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                            animation: 'crt-flicker 0.1s infinite',
                        }} />
                        <Skull className="w-20 h-20 text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                        <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-2 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" style={{ textShadow: '2px 2px 0 rgba(0,255,255,0.3), -2px -2px 0 rgba(255,0,0,0.3)' }}>GAME OVER</h2>
                        <p className="text-xl text-white/60 mb-6">La IA ha prevalecido... por ahora</p>
                        <p className="text-lg text-white/80 mb-2">Oleada alcanzada: <span className="text-pink-400">{currentWave}</span></p>
                        <p className="text-3xl text-white mb-2">Score: <span className="text-pink-400">{score}</span></p>
                        <p className="text-lg text-cyan-400 mb-8">High Score: {highScore}</p>
                        <button onClick={initGame} className="px-10 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-300 relative overflow-hidden group">
                            <span className="relative z-10">JUGAR DE NUEVO</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                )}

                {won && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl overflow-hidden">
                        {/* CRT effect on overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
                        }} />
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.1) 0%, transparent 50%), radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
                        }} />
                        <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-emerald-400 mb-2 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]" style={{ textShadow: '2px 2px 0 rgba(34,211,238,0.3), -2px -2px 0 rgba(34,197,94,0.3)' }}>¡VICTORIA!</h2>
                        <p className="text-2xl text-white/80 mb-4">🎉 La humanidad ha derrotado al MEGA AI 🎉</p>
                        <p className="text-3xl text-white mb-2">Score Final: <span className="text-cyan-400">{score}</span></p>
                        <p className="text-lg text-pink-400 mb-8">High Score: {highScore}</p>
                        <button onClick={initGame} className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 relative overflow-hidden group">
                            <span className="relative z-10">JUGAR DE NUEVO</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                )}

                {isPaused && !gameOver && !won && !showInstructions && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl overflow-hidden">
                        {/* CRT effect on overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
                        }} />
                        <Gamepad2 className="w-16 h-16 text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                        <h2 className="text-5xl font-bold text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]" style={{ textShadow: '2px 2px 0 rgba(250,204,21,0.2)' }}>PAUSA</h2>
                        <p className="text-lg text-white/60">Presiona P para continuar</p>
                    </div>
                )}

                {showInstructions && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl overflow-hidden">
                        {/* CRT effect on instructions overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
                        }} />
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.05) 0%, transparent 50%), radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                        }} />

                        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-400 mb-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" style={{ textShadow: '2px 2px 0 rgba(236,72,153,0.3), -2px -2px 0 rgba(34,211,238,0.3)' }}>
                            HUMANO vs IA
                        </h1>
                        <p className="text-lg text-white/60 mb-6">Defiende a la humanidad de la invasión de las IAs</p>

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl text-pink-400 font-bold drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">5 OLEADAS</span>
                            <span className="text-white/40">+</span>
                            <span className="text-2xl text-red-400 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">JEFE FINAL</span>
                        </div>

                        <div className="flex flex-col items-center gap-3 mb-8 text-white/70">
                            <p><span className="text-cyan-400 font-mono">← →</span> o <span className="text-cyan-400 font-mono">A D</span> para mover</p>
                            <p><span className="text-cyan-400 font-mono">ESPACIO</span> o <span className="text-cyan-400 font-mono">↑</span> para disparar</p>
                            <p><span className="text-yellow-400 font-mono">P</span> para pausar | <span className="text-red-400 font-mono">ESC</span> para salir</p>
                        </div>

                        <button
                            onClick={initGame}
                            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-300 relative overflow-hidden group animate-pulse"
                        >
                            <span className="relative z-10">PRESIONA ESPACIO PARA COMENZAR</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
