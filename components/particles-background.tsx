"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

interface DataStream {
  id: number
  x: number
  height: number
  delay: number
  duration: number
  color: string
}

interface NeuralNode {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export function ParticlesBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [dataStreams, setDataStreams] = useState<DataStream[]>([])
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([])

  useEffect(() => {
    const colors = [
      "rgba(34, 211, 238, 0.6)",
      "rgba(16, 185, 129, 0.6)",
      "rgba(34, 211, 238, 0.5)",
      "rgba(16, 185, 129, 0.4)",
      "rgba(59, 130, 246, 0.4)",
    ]

    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 20,
    }))

    const streamColors = ["rgba(34, 211, 238, 0.4)", "rgba(16, 185, 129, 0.4)", "rgba(59, 130, 246, 0.3)"]
    const newDataStreams: DataStream[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      height: Math.random() * 100 + 50,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 6,
      color: streamColors[Math.floor(Math.random() * streamColors.length)],
    }))

    const newNeuralNodes: NeuralNode[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
      delay: Math.random() * 4,
    }))

    setParticles(newParticles)
    setDataStreams(newDataStreams)
    setNeuralNodes(newNeuralNodes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep space gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgb(8, 15, 25) 0%, rgb(6, 9, 18) 100%)",
        }}
      />

      {/* Animated circuit grid */}
      <div
        className="absolute inset-0 opacity-[0.04] animate-circuit-flow"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px), linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Secondary finer grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Neural network nodes - glowing circles */}
      {neuralNodes.map((node) => (
        <div
          key={`neural-${node.id}`}
          className="absolute rounded-full animate-neural-pulse"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%)",
            animationDelay: `${node.delay}s`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Data streams - vertical flowing lines */}
      {dataStreams.map((stream) => (
        <div
          key={`stream-${stream.id}`}
          className="absolute animate-data-stream"
          style={{
            left: `${stream.x}%`,
            width: "1px",
            height: `${stream.height}px`,
            background: `linear-gradient(180deg, transparent 0%, ${stream.color} 20%, ${stream.color} 80%, transparent 100%)`,
            animationDelay: `${stream.delay}s`,
            animationDuration: `${stream.duration}s`,
            boxShadow: `0 0 8px ${stream.color}`,
          }}
        />
      ))}

      {/* Radial glow zones */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 40% at 70% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 10% 70%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Floating particles with enhanced glow */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}`,
          }}
        />
      ))}

      {/* Scan lines - CRT effect */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)",
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      />

      {/* Corner tech accents */}
      <div className="absolute top-0 left-0 w-48 h-48">
        <div className="absolute top-12 left-0 w-24 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
        <div className="absolute top-0 left-12 w-px h-24 bg-gradient-to-b from-cyan-500/60 to-transparent" />
        <div className="absolute top-12 left-12 w-2 h-2 bg-cyan-500/40 rounded-full animate-pulse" />
      </div>
      <div className="absolute top-0 right-0 w-48 h-48">
        <div className="absolute top-12 right-0 w-24 h-px bg-gradient-to-l from-emerald-500/60 to-transparent" />
        <div className="absolute top-0 right-12 w-px h-24 bg-gradient-to-b from-emerald-500/60 to-transparent" />
        <div className="absolute top-12 right-12 w-2 h-2 bg-emerald-500/40 rounded-full animate-pulse" />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48">
        <div className="absolute bottom-12 left-0 w-24 h-px bg-gradient-to-r from-blue-500/60 to-transparent" />
        <div className="absolute bottom-0 left-12 w-px h-24 bg-gradient-to-t from-blue-500/60 to-transparent" />
        <div className="absolute bottom-12 left-12 w-2 h-2 bg-blue-500/40 rounded-full animate-pulse" />
      </div>
      <div className="absolute bottom-0 right-0 w-48 h-48">
        <div className="absolute bottom-12 right-0 w-24 h-px bg-gradient-to-l from-emerald-500/60 to-transparent" />
        <div className="absolute bottom-0 right-12 w-px h-24 bg-gradient-to-t from-emerald-500/60 to-transparent" />
        <div className="absolute bottom-12 right-12 w-2 h-2 bg-emerald-500/40 rounded-full animate-pulse" />
      </div>

      {/* Animated orbital ring */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 opacity-[0.03]">
        <div
          className="absolute inset-0 border border-cyan-500/30 rounded-full animate-spin"
          style={{ animationDuration: "60s" }}
        />
        <div
          className="absolute inset-8 border border-emerald-500/20 rounded-full animate-spin"
          style={{ animationDuration: "45s", animationDirection: "reverse" }}
        />
        <div
          className="absolute inset-16 border border-blue-500/10 rounded-full animate-spin"
          style={{ animationDuration: "30s" }}
        />
      </div>
    </div>
  )
}
