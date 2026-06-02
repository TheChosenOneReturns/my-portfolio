"use client"

import { useEffect, useRef } from "react"

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Grid config
    const gridSize = 60
    const gridOpacity = 0.04

    // Gradient blobs config
    const blobs = [
      { x: 0.3, y: 0.3, radius: 0.4, color: "124, 58, 237", speed: 0.0003, phase: 0 },
      { x: 0.7, y: 0.6, radius: 0.35, color: "167, 139, 250", speed: 0.0004, phase: Math.PI },
      { x: 0.5, y: 0.8, radius: 0.3, color: "139, 92, 246", speed: 0.00025, phase: Math.PI * 0.5 },
    ]

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      time += 1

      // Clear
      ctx.fillStyle = "#0c0a12"
      ctx.fillRect(0, 0, w, h)

      // Draw gradient blobs
      blobs.forEach((blob) => {
        const bx = w * (blob.x + Math.sin(time * blob.speed + blob.phase) * 0.15)
        const by = h * (blob.y + Math.cos(time * blob.speed * 0.7 + blob.phase) * 0.1)
        const br = Math.min(w, h) * blob.radius

        const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        gradient.addColorStop(0, `rgba(${blob.color}, 0.08)`)
        gradient.addColorStop(0.5, `rgba(${blob.color}, 0.03)`)
        gradient.addColorStop(1, "rgba(0,0,0,0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      })

      // Draw fine grid
      ctx.strokeStyle = `rgba(124, 58, 237, ${gridOpacity})`
      ctx.lineWidth = 0.5

      // Vertical lines
      for (let x = 0; x < w; x += gridSize) {
        const fadeX = Math.min(x / (w * 0.15), 1) * Math.min((w - x) / (w * 0.15), 1)
        ctx.globalAlpha = gridOpacity * fadeX
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < h; y += gridSize) {
        const fadeY = Math.min(y / (h * 0.15), 1) * Math.min((h - y) / (h * 0.15), 1)
        ctx.globalAlpha = gridOpacity * fadeY
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      // Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.8)
      vignette.addColorStop(0, "rgba(12, 10, 18, 0)")
      vignette.addColorStop(1, "rgba(12, 10, 18, 0.6)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
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
