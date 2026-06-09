"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

const blackHoleVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv * 2.0 - 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const blackHoleFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(7.13, 3.71);
      amplitude *= 0.5;
    }

    return value;
  }

  vec3 temperature(float t) {
    vec3 whiteHot = vec3(1.0, 0.94, 0.78);
    vec3 amber = vec3(1.0, 0.62, 0.08);
    vec3 deepRed = vec3(1.0, 0.12, 0.05);
    vec3 plasmaBlue = vec3(0.02, 0.72, 1.0);
    vec3 plasmaMagenta = vec3(1.0, 0.08, 0.78);

    vec3 hot = mix(whiteHot, plasmaBlue, smoothstep(0.0, 0.35, t) * 0.35);
    vec3 warm = mix(amber, deepRed, smoothstep(0.35, 1.0, t));
    vec3 spectral = mix(plasmaBlue, plasmaMagenta, smoothstep(0.45, 0.95, t));
    return mix(mix(hot, warm, smoothstep(0.18, 0.9, t)), spectral, 0.22 + 0.18 * sin(t * 18.0));
  }

  vec3 prism(float t) {
    return 0.55 + 0.45 * cos(6.28318 * (vec3(0.0, 0.34, 0.67) + t));
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= 1.08;

    float time = uTime * 0.16;
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    vec2 diskUv = vec2(uv.x, uv.y * 2.65);
    float diskRadius = length(diskUv);
    float diskAngle = atan(diskUv.y, diskUv.x);

    float inner = 0.24;
    float outer = 0.86;
    float diskMask = smoothstep(inner, inner + 0.055, diskRadius) * (1.0 - smoothstep(outer - 0.22, outer, diskRadius));
    float diskCore = exp(-pow(abs(diskUv.y) * 6.0, 1.45)) * smoothstep(inner, inner + 0.08, diskRadius);

    float swirl = fbm(vec2(diskAngle * 1.7 + time * 1.8, diskRadius * 7.5 - time * 2.2));
    float turbulence = fbm(diskUv * 5.0 + vec2(time * 1.8, -time * 0.7));
    float strands = 0.58 + 0.42 * sin(diskAngle * 9.0 + diskRadius * 24.0 - time * 7.5 + turbulence * 4.0);

    float doppler = smoothstep(-0.85, 0.85, cos(diskAngle - 0.55));
    float frontArc = smoothstep(-0.25, 0.68, diskUv.y);
    float diskLight = diskMask * diskCore * (0.58 + swirl * 0.58) * (0.68 + strands * 0.46);
    diskLight *= mix(0.62, 1.75, doppler) * mix(0.68, 1.22, frontArc);

    float temp = smoothstep(inner, outer, diskRadius);
    vec3 diskColor = mix(temperature(temp), prism(temp + swirl * 0.28 + time * 0.12), 0.32) * diskLight * 2.18;

    float eventHorizon = smoothstep(0.255, 0.205, radius);
    float photonRing = exp(-pow((radius - 0.284) * 42.0, 2.0)) * (1.15 + 0.24 * sin(angle * 5.0 - time * 2.0));
    float innerGlow = exp(-pow((radius - 0.34) * 7.2, 2.0)) * 0.32;

    float topLens = exp(-pow((length(vec2(uv.x, uv.y * 1.9 + 0.15)) - 0.43) * 16.0, 2.0));
    float bottomLens = exp(-pow((length(vec2(uv.x, uv.y * 2.25 - 0.14)) - 0.49) * 18.0, 2.0));
    float lensMask = (topLens * 0.62 + bottomLens * 0.38) * (1.0 - eventHorizon);

    vec2 fogUv = uv * 1.75 + vec2(time * 0.18, -time * 0.08);
    float fogNoise = fbm(fogUv) * fbm(fogUv * 1.9 + 4.0);
    float radialFog = exp(-radius * 2.55) * (1.0 - smoothstep(0.05, 0.44, eventHorizon));
    float orbitalFog = exp(-pow(abs(diskUv.y) * 1.35, 2.0)) * smoothstep(0.18, 0.92, diskRadius) * (1.0 - smoothstep(0.92, 1.18, diskRadius));
    float fog = (radialFog * 0.72 + orbitalFog * 0.42) * (0.34 + fogNoise * 0.86);

    float dust = fbm(uv * 12.0 + vec2(-time * 0.6, time * 0.28));
    float microStars = smoothstep(0.965, 1.0, dust) * (1.0 - smoothstep(0.18, 0.72, radius)) * 0.22;

    float streakNoise = fbm(vec2(angle * 2.2 + time * 0.35, radius * 8.5));
    float diagonal = abs(uv.y - uv.x * 0.34);
    float counter = abs(uv.y + uv.x * 0.55);
    float streakA = exp(-diagonal * 14.0) * smoothstep(0.18, 0.55, radius) * (1.0 - smoothstep(0.9, 1.12, radius));
    float streakB = exp(-counter * 18.0) * smoothstep(0.32, 0.72, radius) * (1.0 - smoothstep(0.98, 1.16, radius));
    float chromaStreaks = (streakA * 0.22 + streakB * 0.12) * (0.4 + streakNoise);

    float beamCore = exp(-pow(abs(uv.y) * 16.0, 1.18)) * smoothstep(0.18, 0.34, abs(uv.x)) * (1.0 - smoothstep(1.0, 1.23, abs(uv.x)));
    float beamHalo = exp(-pow(abs(uv.y) * 5.2, 1.18)) * smoothstep(0.22, 0.48, abs(uv.x)) * (1.0 - smoothstep(1.04, 1.34, abs(uv.x)));
    float beamPulse = 0.78 + 0.22 * sin(time * 4.5 + abs(uv.x) * 10.0 + turbulence * 2.5);
    float beamEdge = smoothstep(0.24, 0.95, abs(uv.x));
    vec3 beamColor = mix(vec3(1.0, 0.96, 0.72), prism(beamEdge + time * 0.14), 0.58);
    beamColor = mix(beamColor, vec3(1.0, 0.18, 0.7), smoothstep(0.62, 1.0, abs(uv.x)) * 0.45);

    vec3 color = vec3(0.0);
    color += vec3(0.02, 0.13, 0.24) * fog;
    color += vec3(0.48, 0.2, 1.0) * fog * 0.22;
    color += diskColor;
    color += vec3(1.0, 0.92, 0.68) * photonRing * 2.65;
    color += prism(angle * 0.16 + time * 0.08) * photonRing * 0.52;
    color += vec3(0.25, 0.85, 1.0) * innerGlow;
    color += vec3(0.38, 0.76, 1.0) * lensMask * 0.46;
    color += vec3(0.7, 0.95, 1.0) * microStars;
    color += prism(angle * 0.08 + radius * 0.55 + time * 0.18) * chromaStreaks * 1.35;
    color += beamColor * beamCore * beamPulse * 2.2;
    color += mix(vec3(0.0, 0.86, 1.0), vec3(1.0, 0.18, 0.78), beamEdge) * beamHalo * 0.72;

    color = mix(color, vec3(0.0), eventHorizon);
    color *= uIntensity;

    float alpha = clamp(length(color) * 1.45 + fog * 0.42 + photonRing * 0.4 + beamHalo * 0.34, 0.0, 1.0);
    alpha *= 1.0 - smoothstep(0.93, 1.14, radius);

    gl_FragColor = vec4(color, alpha);
  }
`

function createCircleTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 48
  canvas.height = 48
  const ctx = canvas.getContext("2d")!
  const grad = ctx.createRadialGradient(24, 24, 0, 24, 24, 24)
  grad.addColorStop(0, "rgba(255,255,255,1)")
  grad.addColorStop(0.28, "rgba(255,255,255,0.7)")
  grad.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 48, 48)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function RealisticBlackHole() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()
  const isNarrow = viewport.width < 3

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1 },
    }),
    []
  )

  useFrame((state) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    materialRef.current.uniforms.uIntensity.value = isNarrow ? 0.82 : 1.12
  })

  return (
    <mesh position={[isNarrow ? 1.02 : 0.38, isNarrow ? 0.08 : 0, 0]} scale={isNarrow ? 1.02 : 1.26}>
      <planeGeometry args={[2.15, 2.15]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={blackHoleVertexShader}
        fragmentShader={blackHoleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function StarFog() {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const particleCount = viewport.width < 3 ? 180 : 360

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const theta = seededRandom(i + 1) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(i + 101) - 1)
      const r = 2.2 + seededRandom(i + 201) * 8.5

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = (seededRandom(i + 301) - 0.5) * 4.5

      const tint = seededRandom(i + 401)
      const brightness = 0.42 + seededRandom(i + 501) * 0.58

      if (tint < 0.56) {
        colors[i * 3] = brightness
        colors[i * 3 + 1] = brightness
        colors[i * 3 + 2] = brightness
      } else if (tint < 0.82) {
        colors[i * 3] = brightness * 0.55
        colors[i * 3 + 1] = brightness * 0.82
        colors[i * 3 + 2] = brightness
      } else {
        colors[i * 3] = brightness
        colors[i * 3 + 1] = brightness * 0.56
        colors[i * 3 + 2] = brightness * 0.33
      }

      sizes[i] = 0.025 + seededRandom(i + 601) * 0.055
    }

    return { positions, colors, sizes }
  }, [particleCount])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const radius = Math.sqrt(x * x + y * y)
      const angle = Math.atan2(y, x) + 0.00028 + (i % 11) * 0.00004

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] += Math.sin(time * 0.38 + i * 0.21) * 0.00016
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  const texture = useMemo(() => createCircleTexture(), [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        map={texture}
        transparent
        opacity={0.72}
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
      <RealisticBlackHole />
      <StarFog />
    </>
  )
}

export function WebGLBackground() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setShouldRender(!motionQuery.matches)

    updatePreference()
    motionQuery.addEventListener("change", updatePreference)

    return () => motionQuery.removeEventListener("change", updatePreference)
  }, [])

  if (!shouldRender) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_33%,rgba(0,245,255,0.16)_45%,rgba(255,247,220,0.22)_50%,rgba(255,43,214,0.14)_58%,transparent_68%),radial-gradient(circle_at_58%_44%,rgba(0,245,255,0.12),transparent_26%),radial-gradient(circle_at_60%_45%,rgba(255,43,214,0.12),transparent_34%),#000]"
        style={{ zIndex: 0 }}
      />
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 58 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "#000000" }}
        dpr={[1, 1.45]}
      >
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={null}>
          <Scene />
          <EffectComposer>
            <Bloom intensity={1.15} luminanceThreshold={0.08} luminanceSmoothing={0.86} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
