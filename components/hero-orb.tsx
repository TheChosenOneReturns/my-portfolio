"use client"

import { useEffect, useRef, useCallback } from "react"

interface Node {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

export function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const size = Math.min(canvas.parentElement?.clientWidth || 500, 500)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)

    // Create nodes in a spherical distribution
    const nodeCount = 80
    const nodes: Node[] = []
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 120 + Math.random() * 40
      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
      })
    }

    const project = (x: number, y: number, z: number, centerX: number, centerY: number, scale: number) => {
      const perspective = 400
      const scale2 = perspective / (perspective + z)
      return {
        x: centerX + x * scale2 * scale,
        y: centerY + y * scale2 * scale,
        scale: scale2,
        z: z,
      }
    }

    const draw = () => {
      const size = Math.min(canvas.parentElement?.clientWidth || 500, 500)
      ctx.clearRect(0, 0, size, size)
      time += 0.008

      const centerX = size / 2
      const centerY = size / 2
      const scale = 1.2

      // Mouse parallax influence
      const mx = mouseRef.current.x * 15
      const my = mouseRef.current.y * 15

      // Rotate nodes
      const rotatedNodes = nodes.map((node) => {
        // Slow rotation
        const rotY = time * 0.3
        const rotX = time * 0.15 + mx * 0.01

        let x = node.x
        let y = node.y
        let z = node.z

        // Y rotation
        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        x = x1
        z = z1

        // X rotation
        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const y2 = y * cosX - z * sinX
        const z2 = y * sinX + z * cosX
        y = y2
        z = z2

        return project(x, y, z, centerX, centerY, scale)
      })

      // Sort by depth for proper rendering
      const sortedIndices = rotatedNodes
        .map((n, i) => ({ ...n, index: i }))
        .sort((a, b) => b.z - a.z)

      // Draw connections (back ones first)
      ctx.lineWidth = 0.5
      for (let i = 0; i < sortedIndices.length; i++) {
        const a = sortedIndices[i]
        for (let j = i + 1; j < sortedIndices.length; j++) {
          const b = sortedIndices[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 60 && a.z > -80 && b.z > -80) {
            const opacity = (1 - dist / 60) * 0.15 * (a.z > 0 ? 0.6 : 0.3)
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of sortedIndices) {
        const size = node.scale * 2.5
        const alpha = node.z > -100 ? 0.3 + (node.z + 100) / 300 * 0.7 : 0.2

        if (size > 0.5) {
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`
          ctx.beginPath()
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
          ctx.fill()

          // Glow for front nodes
          if (node.z > 50 && size > 1.5) {
            ctx.fillStyle = `rgba(124, 58, 237, ${alpha * 0.3})`
            ctx.beginPath()
            ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Pulse wave rings
      for (let ring = 0; ring < 3; ring++) {
        const ringTime = (time + ring * 2) % 6
        const ringRadius = ringTime * 25
        const ringAlpha = Math.max(0, 0.08 - ringTime * 0.015)

        if (ringAlpha > 0) {
          const proj = project(ringRadius, 0, 0, centerX, centerY, scale)
          ctx.strokeStyle = `rgba(124, 58, 237, ${ringAlpha})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.ellipse(centerX, centerY, proj.x - centerX, (proj.x - centerX) * 0.35, 0, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [handleMouseMove])

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[500px] aspect-square"
      aria-hidden="true"
    />
  )
}
