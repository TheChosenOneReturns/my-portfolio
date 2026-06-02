"use client"

import { useEffect, useRef } from "react"

interface ProjectVisualProps {
  projectId: "intelligent-flows" | "prega" | "empatia"
  className?: string
}

function IntelligentFlowsVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let id: number
    const dpr = Math.min(window.devicePixelRatio, 2)
    const size = 400
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const nodes: { x: number; y: number; connections: number[]; type: "input" | "process" | "output" }[] = []
    const nodeCount = 18

    // Create workflow nodes in columns
    for (let i = 0; i < nodeCount; i++) {
      const col = i < 4 ? 0 : i < 9 ? 1 : i < 14 ? 2 : 3
      const colCount = col === 0 ? 4 : col === 3 ? 4 : 5
      const idxInCol = i - (col === 0 ? 0 : col === 1 ? 4 : col === 2 ? 9 : 14)
      nodes.push({
        x: 60 + col * 95,
        y: 80 + (idxInCol / (colCount - 1)) * 240,
        connections: [],
        type: col === 0 ? "input" : col === 3 ? "output" : "process",
      })
    }

    // Create connections
    for (let i = 0; i < nodes.length; i++) {
      const col = Math.floor(nodes[i].x / 100)
      if (col < 3) {
        const nextColNodes = nodes.filter((_, idx) => Math.floor(nodes[idx].x / 100) === col + 1)
        const connections = Math.min(2, nextColNodes.length)
        for (let c = 0; c < connections; c++) {
          const target = nodes.indexOf(nextColNodes[Math.floor(Math.random() * nextColNodes.length)])
          if (!nodes[i].connections.includes(target)) nodes[i].connections.push(target)
        }
      }
    }

    let time = 0
    const draw = () => {
      time += 0.015
      ctx.clearRect(0, 0, size, size)

      // Draw connections with animated data packets
      nodes.forEach((node, i) => {
        node.connections.forEach((targetIdx) => {
          const target = nodes[targetIdx]
          const dx = target.x - node.x
          const dy = target.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Base line
          ctx.strokeStyle = "rgba(124, 58, 237, 0.15)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(target.x, target.y)
          ctx.stroke()

          // Animated packet
          const progress = (time * 0.5 + i * 0.3) % 1
          const px = node.x + dx * progress
          const py = node.y + dy * progress
          const glowSize = 2 + Math.sin(time * 3 + i) * 1

          ctx.fillStyle = "rgba(167, 139, 250, 0.8)"
          ctx.beginPath()
          ctx.arc(px, py, glowSize, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        const color = node.type === "input" ? "rgba(167, 139, 250, 0.6)" : node.type === "output" ? "rgba(139, 92, 246, 0.6)" : "rgba(124, 58, 237, 0.5)"
        const radius = node.type === "process" ? 5 : 4

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "rgba(167, 139, 250, 0.15)"
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      id = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
}

function PregaVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let id: number
    const dpr = Math.min(window.devicePixelRatio, 2)
    const size = 400
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    interface Point {
      x: number
      y: number
      targetX: number
      targetY: number
      cluster: number
    }

    const clusters = [
      { cx: 100, cy: 120, color: "rgba(124, 58, 237, 0.5)" },
      { cx: 280, cy: 180, color: "rgba(167, 139, 250, 0.4)" },
      { cx: 180, cy: 300, color: "rgba(139, 92, 246, 0.35)" },
    ]

    const points: Point[] = []
    for (let i = 0; i < 60; i++) {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)]
      points.push({
        x: cluster.cx + (Math.random() - 0.5) * 80,
        y: cluster.cy + (Math.random() - 0.5) * 80,
        targetX: 0,
        targetY: 0,
        cluster: clusters.indexOf(cluster),
      })
    }

    let time = 0
    const draw = () => {
      time += 0.01
      ctx.clearRect(0, 0, size, size)

      // Draw subtle grid
      ctx.strokeStyle = "rgba(124, 58, 237, 0.05)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < size; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, size)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(size, i)
        ctx.stroke()
      }

      // Update and draw points
      points.forEach((point, i) => {
        point.targetX = clusters[point.cluster].cx + Math.sin(time + i * 0.5) * 30
        point.targetY = clusters[point.cluster].cy + Math.cos(time + i * 0.3) * 25
        point.x += (point.targetX - point.x) * 0.02
        point.y += (point.targetY - point.y) * 0.02

        const radius = 2 + Math.sin(time * 2 + i) * 0.5
        ctx.fillStyle = clusters[point.cluster].color
        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw cluster boundaries
      clusters.forEach((cluster) => {
        ctx.strokeStyle = cluster.color
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.ellipse(cluster.cx, cluster.cy, 60, 50, time * 0.2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      })

      id = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
}

function EmpatiaVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let id: number
    const dpr = Math.min(window.devicePixelRatio, 2)
    const size = 400
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const layers = 5
    const nodesPerLayer = 8
    const layerSpacing = 70
    const nodeSpacing = 40

    let time = 0
    const draw = () => {
      time += 0.012
      ctx.clearRect(0, 0, size, size)

      const offsetX = 50
      const offsetY = 60

      // Draw layers
      for (let l = 0; l < layers; l++) {
        const lx = offsetX + l * layerSpacing

        // Layer label
        ctx.fillStyle = "rgba(124, 58, 237, 0.3)"
        ctx.font = "10px monospace"
        ctx.fillText(`L${l + 1}`, lx - 6, offsetY - 20)

        // Draw nodes in this layer
        for (let n = 0; n < nodesPerLayer; n++) {
          const ny = offsetY + n * nodeSpacing
          const activation = Math.sin(time * 2 + l * 0.5 + n * 0.3) * 0.5 + 0.5
          const radius = 3 + activation * 2

          // Glow
          ctx.fillStyle = `rgba(124, 58, 237, ${activation * 0.15})`
          ctx.beginPath()
          ctx.arc(lx, ny, radius * 4, 0, Math.PI * 2)
          ctx.fill()

          // Node
          ctx.fillStyle = `rgba(167, 139, 250, ${0.3 + activation * 0.7})`
          ctx.beginPath()
          ctx.arc(lx, ny, radius, 0, Math.PI * 2)
          ctx.fill()

          // Connections to next layer
          if (l < layers - 1) {
            const nextX = offsetX + (l + 1) * layerSpacing
            for (let nextN = 0; nextN < nodesPerLayer; nextN++) {
              if (Math.random() > 0.7) {
                const nextY = offsetY + nextN * nodeSpacing
                const weight = Math.sin(time + l + n + nextN) * 0.5 + 0.5
                ctx.strokeStyle = `rgba(124, 58, 237, ${weight * 0.1})`
                ctx.lineWidth = 0.5
                ctx.beginPath()
                ctx.moveTo(lx + radius, ny)
                ctx.lineTo(nextX - radius, nextY)
                ctx.stroke()
              }
            }
          }
        }
      }

      // Scan line effect
      const scanY = ((time * 50) % (nodesPerLayer * nodeSpacing + 40)) + offsetY - 20
      ctx.strokeStyle = "rgba(167, 139, 250, 0.1)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(offsetX - 10, scanY)
      ctx.lineTo(offsetX + (layers - 1) * layerSpacing + 10, scanY)
      ctx.stroke()

      id = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(id)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
}

export function ProjectAbstractVisual({ projectId, className = "" }: ProjectVisualProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-card/50 border border-border/30 ${className}`}>
      {projectId === "intelligent-flows" && <IntelligentFlowsVisual />}
      {projectId === "prega" && <PregaVisual />}
      {projectId === "empatia" && <EmpatiaVisual />}
      <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
    </div>
  )
}
