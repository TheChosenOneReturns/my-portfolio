"use client"

import { Suspense, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"

function Singularity() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = 800
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.5 + Math.random() * 3
      const height = (Math.random() - 0.5) * 0.3
      
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = height
      
      // Colors: cyan, violet, orange, magenta
      const colorChoice = Math.random()
      if (colorChoice < 0.3) {
        colors[i * 3] = 0; colors[i * 3 + 1] = 0.96; colors[i * 3 + 2] = 1 // Cyan
      } else if (colorChoice < 0.6) {
        colors[i * 3] = 0.49; colors[i * 3 + 1] = 0.23; colors[i * 3 + 2] = 0.93 // Violet
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.21 // Orange
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 1 // Magenta
      }
      
      sizes[i] = 0.5 + Math.random() * 2
    }
    
    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.1
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.2
    }
    
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const angle = Math.atan2(y, x) + 0.005
        const radius = Math.sqrt(x * x + y * y)
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = Math.sin(angle) * radius
        positions[i * 3 + 2] = Math.sin(time * 2 + i * 0.1) * 0.2
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* Central black hole */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Accretion disk inner - bright white/cyan */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.15, 32, 100]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Accretion disk middle - orange glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.25, 32, 100]} />
        <meshBasicMaterial 
          color="#ff6b35" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Accretion disk outer - violet */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.35, 32, 100]} />
        <meshBasicMaterial 
          color="#7c3aed" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Light for bloom */}
      <pointLight color="#00f5ff" intensity={5} position={[0, 0, 2]} />
      <pointLight color="#ff6b35" intensity={3} position={[2, 0, 1]} />
      <pointLight color="#ff00ff" intensity={3} position={[-2, 0, 1]} />
    </>
  )
}

function Scene() {
  return (
    <>
      <Singularity />
      <EffectComposer>
        <Bloom 
          intensity={2.5} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
    </>
  )
}

export function WebGLBackground() {
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
