"use client"

import { Suspense, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"

// ─── NEBULA ACCRETION DISK SHADER ───
const nebulaVertexShader = `
  varying vec2 vUv;
  varying float vDist;
  uniform float uTime;
  uniform float uDeform;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Deform based on noise
    float noise = snoise(vec3(pos.x * 2.0, pos.y * 2.0, uTime * 0.1)) * uDeform;
    float noise2 = snoise(vec3(pos.x * 4.0 + 100.0, pos.y * 4.0, uTime * 0.15)) * uDeform * 0.5;

    pos.z += noise + noise2;
    pos.x += noise * 0.3;

    vDist = length(pos.xy);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const nebulaFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    float r = vDist;

    // Center sphere (event horizon)
    float horizon = smoothstep(0.2, 0.0, r);

    // Photon ring (bright thin ring at ~0.25)
    float photon = smoothstep(0.28, 0.22, r) * smoothstep(0.18, 0.24, r);

    // Inner disk: white/cyan hot
    float inner = smoothstep(0.22, 0.35, r) * smoothstep(0.55, 0.4, r);
    vec3 innerColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.96, 1.0), smoothstep(0.3, 0.5, r));

    // Outer disk: orange/violet cool
    float outer = smoothstep(0.4, 0.6, r) * smoothstep(0.95, 0.7, r);
    vec3 outerColor = mix(vec3(1.0, 0.5, 0.2), vec3(0.6, 0.2, 1.0), smoothstep(0.5, 0.9, r));

    // Spiral arms using angle
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float spiral = sin(angle * 4.0 + r * 10.0 - uTime * 0.15) * 0.5 + 0.5;
    float spiralMask = smoothstep(0.25, 0.8, r) * smoothstep(0.95, 0.7, r);

    // Doppler shift effect (one side brighter)
    float doppler = 0.7 + 0.3 * cos(angle - uTime * 0.05 + 1.0);

    // Combine
    vec3 color = vec3(0.0);

    // Background nebula glow
    float nebula = exp(-r * r * 1.5) * 0.15;
    color += vec3(0.08, 0.03, 0.15) * nebula;

    // Photon ring bright
    color += vec3(1.0, 0.95, 0.8) * photon * 2.0;

    // Inner hot disk
    color += innerColor * inner * doppler;

    // Outer cool disk
    color += outerColor * outer * doppler * 0.7;

    // Spiral arms enhancement
    color += vec3(0.3, 0.8, 1.0) * spiral * spiralMask * 0.3;

    // Event horizon (black sphere)
    color = mix(color, vec3(0.0, 0.0, 0.0), horizon);

    // Edge chromatic hint
    float edge = smoothstep(0.7, 0.85, r) * smoothstep(1.0, 0.9, r);
    color.r += edge * 0.08;
    color.b += edge * 0.12;

    gl_FragColor = vec4(color, 1.0);
  }
`

// ─── BLACK HOLE SPHERE ───
function BlackHoleSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.18, 64, 64]} />
      <meshPhysicalMaterial
        color="#000000"
        roughness={0}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0}
        emissive="#000000"
      />
    </mesh>
  )
}

// ─── NEBULA DISK (deformed ring) ───
function NebulaDisk() {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDeform: { value: 0.08 },
  }), [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.015
      ;(meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3.5, 3.5, 128, 128]} />
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── ORBITING GAS CLOUDS (particles around disk) ───
function GasClouds() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 500

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.3 + Math.random() * 1.2
      const height = (Math.random() - 0.5) * 0.15

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = height

      // Colors
      const r = Math.random()
      if (r < 0.35) {
        colors[i * 3] = 0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1 // Cyan
      } else if (r < 0.6) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0.3 // Orange
      } else if (r < 0.8) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 1 // Violet
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1 // White
      }
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const angle = Math.atan2(y, x) + 0.0008 + Math.sin(time * 0.1 + i) * 0.0002
      const radius = Math.sqrt(x * x + y * y)

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = Math.sin(time * 0.3 + i * 0.05) * 0.08
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
        size={0.06}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── DISTANT STARS ───
function DistantStars() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 200

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      sizes[i] = 0.02 + Math.random() * 0.05
    }

    return { positions, sizes }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] += Math.sin(time * 0.05 + i) * 0.0001
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── LIGHTS ───
function SceneLights() {
  return (
    <>
      <pointLight color="#00f5ff" intensity={4} position={[0, 0, 2]} distance={10} />
      <pointLight color="#ff6b35" intensity={2} position={[2, 1, 1]} distance={10} />
      <pointLight color="#a855f7" intensity={2} position={[-2, -1, 1]} distance={10} />
      <pointLight color="#ffffff" intensity={1} position={[0, 0, -2]} distance={5} />
      <ambientLight intensity={0.05} />
    </>
  )
}

// ─── MAIN SCENE ───
function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  // Rotate entire group to be more face-on but tilted
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.015) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <BlackHoleSphere />
      <NebulaDisk />
      <GasClouds />
      <DistantStars />
      <SceneLights />
    </group>
  )
}

export function WebGLBackground() {
  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 55 }}
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
              intensity={1.8}
              luminanceThreshold={0.08}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration offset={[0.0015, 0.0015]} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
