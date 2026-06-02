"use client"

import { Suspense, useRef, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useControls, folder, button } from "leva"
import * as THREE from "three"

interface DesignParams {
  sphereSize: number
  photonRingRadius: number
  photonRingThickness: number
  photonGlowRadius: number
  photonGlowThickness: number
  innerRadius: number
  innerThickness: number
  innerColor: string
  innerEmissive: string
  innerOpacity: number
  midRadius: number
  midThickness: number
  midColor: string
  midEmissive: string
  midOpacity: number
  outerRadius: number
  outerThickness: number
  outerColor: string
  outerEmissive: string
  outerOpacity: number
  rotationSpeed: number
  tiltX: number
  tiltY: number
  starCount: number
  starSize: number
  starOpacity: number
  bloomIntensity: number
  bloomThreshold: number
}

function DesignScene({ params }: { params: DesignParams }) {
  const groupRef = useRef<THREE.Group>(null)

  const stars = useMemo(() => {
    const positions = new Float32Array(params.starCount * 3)
    const colors = new Float32Array(params.starCount * 3)
    for (let i = 0; i < params.starCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 8
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      const rand = Math.random()
      if (rand < 0.5) { colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1 }
      else if (rand < 0.75) { colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 1 }
      else { colors[i * 3] = 0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1 }
    }
    return { positions, colors }
  }, [params.starCount])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * params.rotationSpeed
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * params.tiltX
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.008) * params.tiltY
    }
  })

  return (
    <group ref={groupRef} rotation={[Math.PI / 2.3, 0, 0]}>
      <mesh>
        <sphereGeometry args={[params.sphereSize, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[params.photonRingRadius, params.photonRingThickness, 32, 100]} />
        <meshBasicMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[params.photonGlowRadius, params.photonGlowThickness, 32, 100]} />
        <meshBasicMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <torusGeometry args={[params.innerRadius, params.innerThickness, 32, 100]} />
        <meshBasicMaterial color={params.innerColor} emissive={params.innerEmissive} emissiveIntensity={1.5} transparent opacity={params.innerOpacity} />
      </mesh>
      <mesh>
        <torusGeometry args={[params.midRadius, params.midThickness, 32, 100]} />
        <meshBasicMaterial color={params.midColor} emissive={params.midEmissive} emissiveIntensity={1} transparent opacity={params.midOpacity} />
      </mesh>
      <mesh>
        <torusGeometry args={[params.outerRadius, params.outerThickness, 32, 100]} />
        <meshBasicMaterial color={params.outerColor} emissive={params.outerEmissive} emissiveIntensity={0.8} transparent opacity={params.outerOpacity} />
      </mesh>
      {params.starCount > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={params.starCount} array={stars.positions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={params.starCount} array={stars.colors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            size={params.starSize}
            vertexColors
            transparent
            opacity={params.starOpacity}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
      <pointLight color="#ffffff" intensity={5} position={[0, 0, 1.5]} distance={5} />
      <pointLight color="#00f5ff" intensity={2} position={[1, 1, 0.5]} distance={5} />
      <pointLight color="#ff6b35" intensity={1.5} position={[-1, -1, 0.5]} distance={5} />
      <ambientLight intensity={0.02} />
    </group>
  )
}

function generateCode(params: DesignParams) {
  return `// Valores exportados desde ABDEV Designer
// Copiar en components/webgl-background.tsx

const SPHERE_SIZE = ${params.sphereSize}
const PHOTON_RING_RADIUS = ${params.photonRingRadius}
const PHOTON_RING_THICKNESS = ${params.photonRingThickness}
const PHOTON_GLOW_RADIUS = ${params.photonGlowRadius}
const PHOTON_GLOW_THICKNESS = ${params.photonGlowThickness}

const INNER_RADIUS = ${params.innerRadius}
const INNER_THICKNESS = ${params.innerThickness}
const INNER_COLOR = "${params.innerColor}"
const INNER_EMISSIVE = "${params.innerEmissive}"
const INNER_OPACITY = ${params.innerOpacity}

const MID_RADIUS = ${params.midRadius}
const MID_THICKNESS = ${params.midThickness}
const MID_COLOR = "${params.midColor}"
const MID_EMISSIVE = "${params.midEmissive}"
const MID_OPACITY = ${params.midOpacity}

const OUTER_RADIUS = ${params.outerRadius}
const OUTER_THICKNESS = ${params.outerThickness}
const OUTER_COLOR = "${params.outerColor}"
const OUTER_EMISSIVE = "${params.outerEmissive}"
const OUTER_OPACITY = ${params.outerOpacity}

const ROTATION_SPEED = ${params.rotationSpeed}
const TILT_X = ${params.tiltX}
const TILT_Y = ${params.tiltY}

const STAR_COUNT = ${params.starCount}
const STAR_SIZE = ${params.starSize}
const STAR_OPACITY = ${params.starOpacity}

const BLOOM_INTENSITY = ${params.bloomIntensity}
const BLOOM_THRESHOLD = ${params.bloomThreshold}
`
}

export default function DesignPage() {
  const [showExport, setShowExport] = useState(false)

  const params = useControls({
    "Black Hole": folder({
      sphereSize: { value: 0.22, min: 0.05, max: 0.5, step: 0.01 },
    }),
    "Photon Ring": folder({
      photonRingRadius: { value: 0.26, min: 0.15, max: 0.8, step: 0.01 },
      photonRingThickness: { value: 0.02, min: 0.005, max: 0.1, step: 0.005 },
      photonGlowRadius: { value: 0.28, min: 0.15, max: 0.8, step: 0.01 },
      photonGlowThickness: { value: 0.06, min: 0.01, max: 0.2, step: 0.01 },
    }),
    "Inner Ring": folder({
      innerRadius: { value: 0.38, min: 0.2, max: 1.5, step: 0.01 },
      innerThickness: { value: 0.04, min: 0.01, max: 0.2, step: 0.01 },
      innerColor: "#e0f0ff",
      innerEmissive: "#00f5ff",
      innerOpacity: { value: 0.6, min: 0, max: 1, step: 0.05 },
    }),
    "Mid Ring": folder({
      midRadius: { value: 0.5, min: 0.2, max: 1.5, step: 0.01 },
      midThickness: { value: 0.06, min: 0.01, max: 0.2, step: 0.01 },
      midColor: "#ffaa55",
      midEmissive: "#ff6b35",
      midOpacity: { value: 0.35, min: 0, max: 1, step: 0.05 },
    }),
    "Outer Ring": folder({
      outerRadius: { value: 0.65, min: 0.2, max: 1.5, step: 0.01 },
      outerThickness: { value: 0.08, min: 0.01, max: 0.2, step: 0.01 },
      outerColor: "#9966ff",
      outerEmissive: "#7c3aed",
      outerOpacity: { value: 0.25, min: 0, max: 1, step: 0.05 },
    }),
    Animation: folder({
      rotationSpeed: { value: 0.03, min: 0, max: 0.5, step: 0.01 },
      tiltX: { value: 0.08, min: 0, max: 1, step: 0.01 },
      tiltY: { value: 0.03, min: 0, max: 1, step: 0.01 },
    }),
    Stars: folder({
      starCount: { value: 150, min: 0, max: 1000, step: 10 },
      starSize: { value: 0.15, min: 0.01, max: 0.5, step: 0.01 },
      starOpacity: { value: 0.5, min: 0, max: 1, step: 0.05 },
    }),
    Bloom: folder({
      bloomIntensity: { value: 2.0, min: 0, max: 5, step: 0.1 },
      bloomThreshold: { value: 0.15, min: 0, max: 1, step: 0.05 },
    }),
    "Exportar": button(() => setShowExport((s) => !s)),
  })

  const code = generateCode(params)

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-white mb-1">ABDEV Designer</h1>
        <p className="text-sm text-white/50">Ajustá el agujero negro con los controles de la derecha</p>
      </div>

      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#000000" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <DesignScene params={params} />
          <EffectComposer>
            <Bloom
              intensity={params.bloomIntensity}
              luminanceThreshold={params.bloomThreshold}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {showExport && (
        <div className="fixed bottom-4 right-4 w-[520px] max-h-[60vh] overflow-auto bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Exportar Configuración</h3>
            <button onClick={() => setShowExport(false)} className="text-white/50 hover:text-white text-sm">
              Cerrar
            </button>
          </div>
          <p className="text-sm text-white/60 mb-3">Copiá estos valores y reemplazá los de <code className="text-[#00f5ff]">components/webgl-background.tsx</code>:</p>
          <pre className="text-xs font-mono text-[#00f5ff] bg-white/5 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
            {code}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="mt-3 w-full py-2 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/20 transition-colors text-sm font-medium"
          >
            Copiar al portapapeles
          </button>
        </div>
      )}
    </main>
  )
}
