"use client"

import { Suspense, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"

const blackHoleVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const blackHoleFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  #define PI 3.14159265359

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    // Event horizon (black center)
    float horizon = smoothstep(0.18, 0.15, dist);

    // Photon ring (thin bright ring at event horizon)
    float photonRing = smoothstep(0.22, 0.19, dist) * smoothstep(0.15, 0.18, dist);
    photonRing *= 3.0;

    // Accretion disk
    float diskWidth = 0.08;
    float innerRadius = 0.25;
    float outerRadius = 0.65;

    // Main disk body
    float disk = smoothstep(innerRadius, innerRadius + 0.05, dist) * smoothstep(outerRadius, outerRadius - 0.1, dist);

    // Doppler effect (brighter on approaching side)
    float doppler = 0.5 + 0.5 * cos(angle - uTime * 0.05);
    disk *= doppler;

    // Spiraling texture
    float spiral = sin(angle * 3.0 + dist * 15.0 - uTime * 0.3) * 0.5 + 0.5;
    disk *= 0.6 + 0.4 * spiral;

    // Temperature gradient: inner = hot (white/blue), outer = cool (red/orange)
    vec3 innerColor = vec3(1.0, 1.0, 1.0);      // White
    vec3 midColor = vec3(0.0, 0.96, 1.0);        // Cyan
    vec3 outerColor = vec3(1.0, 0.42, 0.21);     // Orange

    float tempGradient = smoothstep(innerRadius, outerRadius, dist);
    vec3 diskColor = mix(innerColor, midColor, tempGradient * 2.0);
    diskColor = mix(diskColor, outerColor, tempGradient * tempGradient);

    // Gravitational lensing (light bending visualization)
    float lens = 0.0;
    for(float i = 0.0; i < 6.0; i++) {
      float r = 0.3 + i * 0.08;
      float arc = sin(angle * 2.0 + i + uTime * 0.1) * 0.3;
      float lensLine = smoothstep(0.015, 0.0, abs(dist - r - arc * 0.05));
      lens += lensLine * 0.15;
    }
    lens *= smoothstep(0.7, 0.2, dist);

    // Combine
    vec3 color = vec3(0.0);

    // Background nebula glow
    float bgGlow = exp(-dist * dist * 2.0) * 0.1;
    color += vec3(0.1, 0.05, 0.2) * bgGlow;

    // Photon ring
    color += vec3(1.0, 0.9, 0.7) * photonRing;

    // Accretion disk
    color += diskColor * disk * 0.8;

    // Gravitational lens arcs
    color += vec3(0.5, 0.3, 1.0) * lens;

    // Event horizon
    color = mix(color, vec3(0.0), horizon);

    // Subtle chromatic edge at disk
    float edge = smoothstep(0.6, 0.65, dist) * smoothstep(0.8, 0.7, dist);
    color.r += edge * 0.1;
    color.b += edge * 0.15;

    gl_FragColor = vec4(color, 1.0);
  }
`

function BlackHoleShader() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={blackHoleVertexShader}
        fragmentShader={blackHoleFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

function SlowParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 300

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Spread particles in a wide area, not just around center
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 8 // Spread out far

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4

      // Star colors: white, cyan, faint blue, faint orange
      const rand = Math.random()
      if (rand < 0.4) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1 // White
      } else if (rand < 0.7) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1 // Faint blue
      } else if (rand < 0.85) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0.5 // Warm
      } else {
        colors[i * 3] = 0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1 // Cyan
      }

      sizes[i] = 0.03 + Math.random() * 0.08
    }

    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      // Very slow drift, like distant stars
      const speed = 0.0005 + (i % 10) * 0.0001
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]

      const angle = Math.atan2(y, x) + speed
      const radius = Math.sqrt(x * x + y * y)

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius

      // Slight twinkle in Z
      positions[i * 3 + 2] += Math.sin(time * 0.5 + i) * 0.0002
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <BlackHoleShader />
      <SlowParticles />
      <EffectComposer>
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </>
  )
}

export function WebGLBackground() {
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
