"use client"

import { Suspense, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

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
      {/* The black sphere */}
      <mesh>
        <sphereGeometry args={[0.22, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Bright inner photon ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.02, 32, 100]} />
        <meshBasicMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Cyan glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.06, 32, 100]} />
        <meshBasicMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

// ─── ACCRETION DISK (simplified, clean tori) ───
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
      {/* Inner hot ring: white/cyan */}
      <mesh ref={innerRef}>
        <torusGeometry args={[0.38, 0.04, 32, 100]} />
        <meshBasicMaterial
          color="#e0f0ff"
          emissive="#00f5ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Mid ring: orange */}
      <mesh ref={midRef}>
        <torusGeometry args={[0.5, 0.06, 32, 100]} />
        <meshBasicMaterial
          color="#ffaa55"
          emissive="#ff6b35"
          emissiveIntensity={1}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Outer ring: violet */}
      <mesh ref={outerRef}>
        <torusGeometry args={[0.65, 0.08, 32, 100]} />
        <meshBasicMaterial
          color="#9966ff"
          emissive="#7c3aed"
          emissiveIntensity={0.8}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  )
}

// ─── SOFT STAR PARTICLES (using Sprites to avoid square artifacts) ───
function SoftStars() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 150

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 8

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

      sizes[i] = 0.5 + Math.random() * 1.5
    }

    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const angle = Math.atan2(y, x) + 0.0003
      const radius = Math.sqrt(x * x + y * y)
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      // Twinkle in Z
      positions[i * 3 + 2] += Math.sin(time * 0.5 + i * 0.1) * 0.0005
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── AMBIENT DUST (very subtle, slow) ───
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 80

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return { positions }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] += Math.sin(time * 0.2 + i) * 0.0003
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#7c3aed"
        transparent
        opacity={0.15}
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
      <SoftStars />
      <AmbientDust />
      <Lights />
    </group>
  )
}

export function WebGLBackground() {
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
          <EffectComposer>
            <Bloom
              intensity={2.0}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
