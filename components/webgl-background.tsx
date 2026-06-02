"use client"

import { Suspense, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// ─── CIRCULAR PARTICLE TEXTURE (prevents square artifacts) ───
function createCircleTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext("2d")!
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  grad.addColorStop(0, "rgba(255,255,255,1)")
  grad.addColorStop(0.4, "rgba(255,255,255,0.5)")
  grad.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(canvas)
}

// ─── CENTRAL BLACK HOLE + PHOTON RING ───
function BlackHoleCenter() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Dark sphere — not pure black so it has form against the background */}
      <mesh>
        <sphereGeometry args={[0.22, 64, 64]} />
        <meshBasicMaterial color="#050508" />
      </mesh>

      {/* Event horizon rim — faint edge glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.225, 0.003, 16, 100]} />
        <meshBasicMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={3} transparent opacity={0.7} />
      </mesh>

      {/* Bright inner photon ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.02, 32, 100]} />
        <meshBasicMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>

      {/* Cyan glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.06, 32, 100]} />
        <meshBasicMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

// ─── ACCRETION DISK (3 clean tori) ───
function AccretionDisk() {
  const innerRef = useRef<THREE.Mesh>(null)
  const midRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (innerRef.current) innerRef.current.rotation.z = t * 0.03
    if (midRef.current) midRef.current.rotation.z = t * 0.025 + 0.5
    if (outerRef.current) outerRef.current.rotation.z = t * 0.02 + 1.0
  })

  return (
    <group rotation={[Math.PI / 2.3, 0, 0]}>
      <mesh ref={innerRef}>
        <torusGeometry args={[0.38, 0.04, 32, 100]} />
        <meshBasicMaterial color="#e0f0ff" emissive="#00f5ff" emissiveIntensity={1.5} transparent opacity={0.6} />
      </mesh>
      <mesh ref={midRef}>
        <torusGeometry args={[0.5, 0.06, 32, 100]} />
        <meshBasicMaterial color="#ffaa55" emissive="#ff6b35" emissiveIntensity={1} transparent opacity={0.35} />
      </mesh>
      <mesh ref={outerRef}>
        <torusGeometry args={[0.65, 0.08, 32, 100]} />
        <meshBasicMaterial color="#9966ff" emissive="#7c3aed" emissiveIntensity={0.8} transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

// ─── ORBITAL PARTICLES (accretion disk simulation) ───
function AccretionParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 600

  const { positions, colors, angles, speeds, radii } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const angles = new Float32Array(count)
    const speeds = new Float32Array(count)
    const radii = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = 0.32 + Math.random() * 0.5 // Between photon ring and outer torus
      const angle = Math.random() * Math.PI * 2

      radii[i] = radius
      angles[i] = angle
      speeds[i] = 0.2 + (0.5 / (radius + 0.1)) // Inner orbits faster

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.02 // Thin disk

      // Color gradient based on distance: white/cyan inner → orange mid → violet outer
      const t = (radius - 0.32) / 0.5
      if (t < 0.33) {
        colors[i * 3] = 0.8 + t * 0.6; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1
      } else if (t < 0.66) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.6 + (1 - t) * 0.3; colors[i * 3 + 2] = 0.4
      } else {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 1
      }
    }

    return { positions, colors, angles, speeds, radii }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const angle = angles[i] + time * speeds[i]
      const r = radii[i]
      posArray[i * 3] = Math.cos(angle) * r
      posArray[i * 3 + 1] = Math.sin(angle) * r
      // Keep Z with slight wobble
      posArray[i * 3 + 2] = Math.sin(time * 0.5 + i * 0.1) * 0.015
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const texture = useMemo(() => createCircleTexture(), [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        map={texture}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── LENSING ARCS (gravitational lensing visualization) ───
function LensingArcs() {
  const arcs = useMemo(() => {
    const arcData: { points: THREE.Vector3[]; color: string; opacity: number }[] = []

    const createArc = (innerR: number, outerR: number, segments: number, offsetAngle: number, color: string, opacity: number) => {
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const angle = offsetAngle + t * Math.PI * 0.6
        const r = innerR + (outerR - innerR) * Math.sin(t * Math.PI)
        points.push(new THREE.Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0))
      }
      return { points, color, opacity }
    }

    // Top arc — cyan
    arcData.push(createArc(0.3, 0.42, 40, -Math.PI * 0.3, "#00f5ff", 0.4))
    // Bottom arc — orange
    arcData.push(createArc(0.32, 0.45, 40, Math.PI * 0.7, "#ff6b35", 0.3))
    // Side arc — violet
    arcData.push(createArc(0.28, 0.38, 30, Math.PI * 0.15, "#7c3aed", 0.25))
    arcData.push(createArc(0.28, 0.38, 30, Math.PI * 1.15, "#7c3aed", 0.25))

    return arcData
  }, [])

  return (
    <group rotation={[Math.PI / 2.3, 0, 0]}>
      {arcs.map((arc, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={arc.points.length}
              array={new Float32Array(arc.points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={arc.color} transparent opacity={arc.opacity} />
        </line>
      ))}
    </group>
  )
}

// ─── DISTANT STARS (static, no CPU animation) ───
function DistantStars() {
  const count = 200

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 10

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const rand = Math.random()
      if (rand < 0.5) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1
      } else if (rand < 0.75) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1
      } else {
        colors[i * 3] = 0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1
      }
    }

    return { positions, colors }
  }, [])

  const texture = useMemo(() => createCircleTexture(), [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        map={texture}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── LIGHTS ───
function Lights() {
  return (
    <>
      <pointLight color="#ffffff" intensity={5} position={[0, 0, 1.5]} distance={5} />
      <pointLight color="#00f5ff" intensity={2} position={[1, 1, 0.5]} distance={5} />
      <pointLight color="#ff6b35" intensity={1.5} position={[-1, -1, 0.5]} distance={5} />
      <ambientLight intensity={0.02} />
    </>
  )
}

// ─── MAIN SCENE ───
function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.08
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.008) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      <BlackHoleCenter />
      <AccretionDisk />
      <AccretionParticles />
      <LensingArcs />
      <DistantStars />
      <Lights />
    </group>
  )
}

export function WebGLBackground() {
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#000000" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
          <EffectComposer>
            <Bloom intensity={2.0} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
