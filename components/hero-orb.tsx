"use client"

import { useEffect, useRef, useCallback } from "react"

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
      const size = Math.min(canvas.parentElement?.clientWidth || 600, 600)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", handleMouseMove)

    const nodeCount = 120
    const nodes: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = []
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 130 + Math.random() * 50
      nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
      })
    }

    const project = (x: number, y: number, z: number, centerX: number, centerY: number, scale: number) => {
      const perspective = 400
      const scale2 = perspective / (perspective + z)
      return { x: centerX + x * scale2 * scale, y: centerY + y * scale2 * scale, scale: scale2, z }
    }

    // Chromatic aberration offset
    const chromaticOffset = (x: number, y: number, z: number, offset: number) => {
      return { x: x + offset * (z / 200), y: y + offset * (z / 300) }
    }

    const draw = () => {
      const size = Math.min(canvas.parentElement?.clientWidth || 600, 600)
      ctx.clearRect(0, 0, size, size)
      time += 0.006

      const centerX = size / 2
      const centerY = size / 2
      const scale = 1.3

      const mx = mouseRef.current.x * 12
      const my = mouseRef.current.y * 12

      const rotatedNodes = nodes.map((node) => {
        const rotY = time * 0.25
        const rotX = time * 0.12 + mx * 0.008

        let x = node.x
        let y = node.y
        let z = node.z

        const cosY = Math.cos(rotY)
        const sinY = Math.sin(rotY)
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        x = x1
        z = z1

        const cosX = Math.cos(rotX)
        const sinX = Math.sin(rotX)
        const y2 = y * cosX - z * sinX
        const z2 = y * sinX + z * cosX
        y = y2
        z = z2

        return project(x, y, z, centerX, centerY, scale)
      })

      const sortedIndices = rotatedNodes.map((n, i) => ({ ...n, index: i })).sort((a, b) => b.z - a.z)

      // Connections with bloom gradient
      ctx.lineWidth = 0.6
      for (let i = 0; i < sortedIndices.length; i++) {
        const a = sortedIndices[i]
        for (let j = i + 1; j < sortedIndices.length; j++) {
          const b = sortedIndices[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 55 && a.z > -60 && b.z > -60) {
            const opacity = (1 - dist / 55) * 0.2 * (a.z > 0 ? 0.7 : 0.3)
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
            grad.addColorStop(0, `rgba(124, 58, 237, ${opacity})`)
            grad.addColorStop(0.5, `rgba(0, 245, 255, ${opacity * 0.5})`)
            grad.addColorStop(1, `rgba(124, 58, 237, ${opacity})`)
            ctx.strokeStyle = grad
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes with bloom
      for (const node of sortedIndices) {
        const size1 = node.scale * 2.8
        const alpha = node.z > -80 ? 0.4 + (node.z + 80) / 350 * 0.6 : 0.25

        if (size1 > 0.5) {
          // Outer bloom (diffuse)
          ctx.fillStyle = `rgba(124, 58, 237, ${alpha * 0.08})`
          ctx.beginPath()
          ctx.arc(node.x, node.y, size1 * 6, 0, Math.PI * 2)
          ctx.fill()

          // Middle bloom
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.15})`
          ctx.beginPath()
          ctx.arc(node.x, node.y, size1 * 3, 0, Math.PI * 2)
          ctx.fill()

          // Core with slight chromatic
          if (node.z > 30 && size1 > 1.8) {
            // Red channel offset
            ctx.fillStyle = `rgba(255, 100, 100, ${alpha * 0.15})`
            ctx.beginPath()
            ctx.arc(node.x - 1, node.y, size1 * 1.2, 0, Math.PI * 2)
            ctx.fill()
            // Cyan channel offset
            ctx.fillStyle = `rgba(100, 255, 255, ${alpha * 0.15})`
            ctx.beginPath()
            ctx.arc(node.x + 1, node.y, size1 * 1.2, 0, Math.PI * 2)
            ctx.fill()
          }

          // White center
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
          ctx.beginPath()
          ctx.arc(node.x, node.y, size1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Energy pulse rings
      for (let ring = 0; ring < 4; ring++) {
        const ringTime = (time + ring * 1.5) % 5
        const ringRadius = ringTime * 30
        const ringAlpha = Math.max(0, 0.12 - ringTime * 0.025) * (1 - Math.abs(mouseRef.current.x) * 0.1)

        if (ringAlpha > 0) {
          const proj = project(ringRadius, 0, 0, centerX, centerY, scale)
          ctx.strokeStyle = `rgba(124, 58, 237, ${ringAlpha})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.ellipse(centerX, centerY, proj.x - centerX, (proj.x - centerX) * 0.4, 0, 0, Math.PI * 2)
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
      className="w-full max-w-[600px] aspect-square"
      aria-hidden="true"
    />
  )
}
