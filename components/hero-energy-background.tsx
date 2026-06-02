"use client"

import { useEffect, useRef } from "react"

export function HeroEnergyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight
    }
    window.addEventListener("scroll", handleScroll)

    // Energy strands
    const strands: { x: number; y: number; length: number; angle: number; speed: number; width: number; color: string; phase: number }[] = []
    for (let i = 0; i < 12; i++) {
      strands.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        length: 300 + Math.random() * 400,
        angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.3,
        speed: 0.5 + Math.random() * 1.5,
        width: 1 + Math.random() * 2,
        color: ["#7c3aed", "#00f5ff", "#ff6b35", "#a78bfa"][Math.floor(Math.random() * 4)],
        phase: Math.random() * Math.PI * 2,
      })
    }

    // Floating particles
    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string }[] = []
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: 0.1 + Math.random() * 0.4,
        color: ["#7c3aed", "#00f5ff", "#ff6b35", "#ffffff"][Math.floor(Math.random() * 4)],
      })
    }

    // Shooting stars
    const shootingStars: { x: number; y: number; length: number; speed: number; alpha: number; active: boolean; delay: number }[] = []
    for (let i = 0; i < 3; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: 60 + Math.random() * 80,
        speed: 3 + Math.random() * 4,
        alpha: 0,
        active: false,
        delay: Math.random() * 200,
      })
    }

    let time = 0

    const draw = () => {
      time += 1
      const w = canvas.width
      const h = canvas.height
      const scroll = scrollRef.current

      // Clear with fade effect based on scroll
      const fadeAlpha = Math.max(0, 1 - scroll * 0.8)
      ctx.fillStyle = `rgba(5, 5, 16, ${fadeAlpha > 0.05 ? 0.05 : 0})`
      ctx.fillRect(0, 0, w, h)

      if (fadeAlpha <= 0.01) {
        animationId = requestAnimationFrame(draw)
        return
      }

      // Draw energy strands
      strands.forEach((strand) => {
        const progress = ((time * strand.speed + strand.phase) % 1000) / 1000
        const startY = strand.y - progress * strand.length * 2
        const endY = startY + strand.length

        if (endY < 0 || startY > h) return

        const gradient = ctx.createLinearGradient(
          strand.x, startY,
          strand.x + Math.cos(strand.angle) * strand.length,
          endY
        )
        gradient.addColorStop(0, `${strand.color}00`)
        gradient.addColorStop(0.5, `${strand.color}${Math.floor(fadeAlpha * 40).toString(16).padStart(2, "0")}`)
        gradient.addColorStop(1, `${strand.color}00`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = strand.width
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(strand.x, startY)
        ctx.lineTo(
          strand.x + Math.cos(strand.angle) * strand.length * 0.3,
          endY
        )
        ctx.stroke()

        // Bloom glow at center
        const cx = strand.x + Math.cos(strand.angle) * strand.length * 0.15
        const cy = startY + strand.length * 0.5
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30)
        glow.addColorStop(0, `${strand.color}${Math.floor(fadeAlpha * 20).toString(16).padStart(2, "0")}`)
        glow.addColorStop(1, "transparent")
        ctx.fillStyle = glow
        ctx.fillRect(cx - 30, cy - 30, 60, 60)
      })

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10

        const alpha = p.alpha * fadeAlpha
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        // Small bloom around bright particles
        if (p.r > 1.5) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
          glow.addColorStop(0, `${p.color}${Math.floor(alpha * 30).toString(16).padStart(2, "0")}`)
          glow.addColorStop(1, "transparent")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      ctx.globalAlpha = 1

      // Draw shooting stars
      shootingStars.forEach((star) => {
        if (!star.active) {
          star.delay -= 1
          if (star.delay <= 0) {
            star.active = true
            star.x = Math.random() * w * 0.5
            star.y = Math.random() * h * 0.3
            star.alpha = 1
          }
          return
        }

        star.x += star.speed
        star.y += star.speed * 0.6
        star.alpha -= 0.015

        if (star.alpha <= 0 || star.x > w || star.y > h) {
          star.active = false
          star.delay = 100 + Math.random() * 250
          return
        }

        const tailX = star.x - star.length
        const tailY = star.y - star.length * 0.6

        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * fadeAlpha})`)
        gradient.addColorStop(0.3, `rgba(124, 58, 237, ${star.alpha * 0.8 * fadeAlpha})`)
        gradient.addColorStop(1, `rgba(124, 58, 237, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        // Head glow
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * fadeAlpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.9)
      vignette.addColorStop(0, "rgba(5, 5, 16, 0)")
      vignette.addColorStop(1, `rgba(5, 5, 16, ${0.5 + scroll * 0.3})`)
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
