"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Bot, Workflow, CheckCircle2, Database, RefreshCw, X, ExternalLink, Github } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Intelligent Flows",
    badge: "n8n Automation",
    badgeColor: "from-orange-500 to-pink-500",
    glowColor: "rgba(251, 146, 60, 0.3)",
    accentColor: "#fb923c",
    description:
      "Diseño e implementación de chatbots autónomos y flujos de trabajo automatizados utilizando n8n. Conecto LLMs (GPT-4, Claude) con bases de datos y herramientas empresariales para automatizar atención al cliente, procesos internos y análisis de datos sin intervención humana.",
    extendedInfo: {
      challenge:
        "Las empresas perdían horas diarias en tareas repetitivas de atención al cliente y procesamiento de datos, con tiempos de respuesta lentos y errores humanos frecuentes.",
      solution:
        "Desarrollé una arquitectura de microservicios con n8n como orquestador central, integrando LLMs para comprensión de lenguaje natural y respuestas contextuales automáticas.",
      results: [
        "Reducción del 85% en tiempo de respuesta al cliente",
        "Automatización de +200 flujos de trabajo",
        "Procesamiento de 10,000+ consultas diarias sin intervención",
        "Integración con 15+ plataformas empresariales",
      ],
      techStack: ["n8n", "LangChain", "PostgreSQL", "Redis", "Docker", "Webhooks", "OpenAI API"],
      links: { demo: "#", github: "#" },
    },
    features: [
      { icon: Bot, text: "Chatbots con memoria de contexto" },
      { icon: Workflow, text: "Integración multi-plataforma (Slack, WhatsApp, CRM)" },
    ],
    tags: [
      { name: "n8n", color: "border-orange-500/50 text-orange-400" },
      { name: "LangChain", color: "border-cyan-500/50 text-cyan-400" },
      { name: "Webhooks", color: "border-foreground/50 text-foreground" },
    ],
    image: "/n8n-workflow-automation-dashboard-with-connected-n.jpg",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6YnNxOHdyNTY5Ynlqb2JkaHN1a2NiNnRwdHhneHZxeWJqd2RhZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7TKwmnDgQb5jemjK/giphy.gif",
  },
  {
    id: 2,
    title: "PREGA",
    badge: "MLOps Platform",
    badgeColor: "from-emerald-500 to-cyan-500",
    glowColor: "rgba(16, 185, 129, 0.3)",
    accentColor: "#10b981",
    description:
      "Una plataforma MLOps diseñada para probar, validar y recibir feedback de modelos de machine learning. PREGA permite a equipos de data science iterar rápidamente sobre sus modelos, gestionar versiones y obtener métricas de rendimiento en tiempo real.",
    extendedInfo: {
      challenge:
        "Los equipos de data science carecían de una forma eficiente de probar, versionar y obtener feedback sobre sus modelos ML antes de producción.",
      solution:
        "Creé una plataforma integral con APIs REST para gestión de modelos, sistema de versionado automático y dashboards de métricas en tiempo real.",
      results: [
        "Reducción del 60% en tiempo de iteración de modelos",
        "Gestión centralizada de +50 modelos ML",
        "Feedback en tiempo real con latencia <100ms",
        "Integración CI/CD para despliegue automático",
      ],
      techStack: ["Python", "FastAPI", "Docker", "Kubernetes", "MLflow", "PostgreSQL", "Redis"],
      links: { demo: "#", github: "#" },
    },
    features: [
      { icon: Database, text: "Gestión de Modelos" },
      { icon: RefreshCw, text: "Feedback en Tiempo Real" },
    ],
    tags: [
      { name: "Python", color: "border-foreground/50 text-foreground" },
      { name: "FastAPI", color: "border-cyan-500/50 text-cyan-400" },
      { name: "Docker", color: "border-emerald-500/50 text-emerald-400" },
    ],
    image: "/mlops-platform-dashboard-with-model-metrics-and-da.jpg",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWxsNnN5YTQyeWs3Y3VkZW9zYzU5OGRsMjdpOHF3M2h3cGE4OWRoOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgzoKnwFNmISR8I/giphy.gif",
  },
  {
    id: 3,
    title: "EMPATIA",
    badge: "HealthTech AI",
    badgeColor: "from-cyan-500 to-green-500",
    glowColor: "rgba(34, 211, 238, 0.3)",
    accentColor: "#22d3ee",
    description:
      'Un sistema de visión por computadora diseñado para salvar vidas. EMPATIA detecta anomalías cancerígenas en tomografías computarizadas (CT Scans) en etapas tempranas. Utiliza redes neuronales profundas para asistir a los radiólogos con una "segunda opinión" inteligente, reduciendo el error humano.',
    extendedInfo: {
      challenge:
        "Los radiólogos enfrentan fatiga visual y la detección temprana de anomalías en CT scans es crítica para el tratamiento exitoso del cáncer.",
      solution:
        "Implementé una CNN profunda entrenada con +100,000 imágenes médicas para detectar patrones anómalos con alta precisión, actuando como asistente del radiólogo.",
      results: [
        "Precisión del 94.7% en detección de anomalías",
        "Reducción del 40% en falsos negativos",
        "Procesamiento de imagen en <2 segundos",
        "Validado con 5 hospitales regionales",
      ],
      techStack: ["Python", "TensorFlow", "OpenCV", "DICOM", "Flask", "AWS S3", "Docker"],
      links: { demo: "#", github: "#" },
    },
    features: [
      { icon: CheckCircle2, text: "Detección Precoz" },
      { icon: CheckCircle2, text: "Deep Learning" },
    ],
    tags: [
      { name: "Python", color: "border-foreground/50 text-foreground" },
      { name: "TensorFlow", color: "border-cyan-500/50 text-cyan-400" },
      { name: "OpenCV", color: "border-foreground/50 text-foreground" },
    ],
    image: "/medical-ai-interface-showing-ct-scan-analysis-with.jpg",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWlrOHRzcmlmYnJlNzEwYnVtbWt3eG5mYmNocWdmMDRvc3FjY296YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6Zt8rGMqVwjYAlsA/giphy.gif",
  },
]

// Componente de partículas flotantes para el popup
function FloatingParticles({ color, isActive }: { color: string; isActive: boolean }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full transition-opacity duration-1000"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: isActive ? 0.6 : 0,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
            animation: isActive
              ? `float-particle ${particle.duration}s ease-in-out ${particle.delay}s infinite`
              : "none",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Componente de líneas de código que se escriben
function CodeLines({ isActive, color }: { isActive: boolean; color: string }) {
  const codeSnippets = [
    "const model = await loadModel();",
    "await pipeline.execute();",
    "return { success: true };",
    "data.transform(config);",
  ]

  return (
    <div className="absolute top-4 right-4 font-mono text-xs opacity-30 pointer-events-none">
      {codeSnippets.map((code, i) => (
        <div
          key={i}
          className="overflow-hidden whitespace-nowrap"
          style={{
            color,
            maxWidth: isActive ? "200px" : "0px",
            transition: `max-width 1.5s ease-out ${0.5 + i * 0.3}s`,
          }}
        >
          {code}
        </div>
      ))}
    </div>
  )
}

// Componente de línea de escaneo
function ScanLine({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        top: isActive ? "100%" : "0%",
        opacity: isActive ? 1 : 0,
        transition: "top 2s ease-out, opacity 0.5s",
      }}
    />
  )
}

// Componente de grid de construcción
function ConstructionGrid({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Líneas horizontales que se dibujan */}
      {[0, 25, 50, 75, 100].map((y, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 h-px"
          style={{
            top: `${y}%`,
            width: isActive ? "100%" : "0%",
            background: `linear-gradient(90deg, transparent, ${color}33, transparent)`,
            transition: `width 1s ease-out ${i * 0.15}s`,
          }}
        />
      ))}
      {/* Líneas verticales que se dibujan */}
      {[0, 25, 50, 75, 100].map((x, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 w-px"
          style={{
            left: `${x}%`,
            height: isActive ? "100%" : "0%",
            background: `linear-gradient(180deg, transparent, ${color}33, transparent)`,
            transition: `height 1s ease-out ${0.5 + i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

// Componente principal del popup tecnológico
function TechPopup({
  project,
  isOpen,
  onClose,
  originRect,
}: {
  project: (typeof projects)[0] | null
  isOpen: boolean
  onClose: () => void
  originRect: DOMRect | null
}) {
  const [phase, setPhase] = useState(0) // 0: cerrado, 1: expandiendo, 2: mostrando contenido
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setPhase(1)
      const timer1 = setTimeout(() => setPhase(2), 800)
      return () => clearTimeout(timer1)
    } else {
      setPhase(0)
    }
  }, [isOpen])

  if (!project) return null

  const getTransformOrigin = () => {
    if (!originRect) return "center center"
    const centerX = originRect.left + originRect.width / 2
    const centerY = originRect.top + originRect.height / 2
    return `${centerX}px ${centerY}px`
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      {/* Backdrop con efecto de distorsión mejorado */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: phase >= 1 ? "rgba(0,0,0,0.85)" : "transparent",
          backdropFilter: phase >= 1 ? "blur(12px) saturate(1.2)" : "none",
          WebkitBackdropFilter: phase >= 1 ? "blur(12px) saturate(1.2)" : "none",
        }}
      />

      {/* Container del popup con scrollbar personalizado */}
      <div
        ref={popupRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
        onClick={(e) => e.stopPropagation()}
        style={{
          transformOrigin: getTransformOrigin(),
          transform: phase === 0 ? "scale(0.3)" : "scale(1)",
          opacity: phase === 0 ? 0 : 1,
          transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s",
          scrollBehavior: "smooth",
        }}
      >
        {/* Marco exterior con animación de construcción */}
        <div className="relative">
          {/* Fondo base */}
          <div
            className="absolute inset-0 rounded-2xl transition-all duration-1000"
            style={{
              background: `radial-gradient(ellipse at center, ${project.glowColor} 0%, transparent 70%)`,
              opacity: phase >= 1 ? 0.3 : 0,
            }}
          />

          {/* Grid de construcción */}
          <ConstructionGrid isActive={phase >= 1} color={project.accentColor} />

          {/* Partículas flotantes */}
          <FloatingParticles color={project.accentColor} isActive={phase >= 2} />

          {/* Línea de escaneo */}
          <ScanLine isActive={phase >= 1} color={project.accentColor} />

          {/* Líneas de código */}
          <CodeLines isActive={phase >= 2} color={project.accentColor} />

          {/* Bordes animados con efecto de dibujo */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={project.accentColor} />
                <stop offset="100%" stopColor={`${project.accentColor}66`} />
              </linearGradient>
            </defs>
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="16"
              ry="16"
              fill="none"
              stroke={`url(#grad-${project.id})`}
              strokeWidth="2"
              style={{
                strokeDasharray: 3000,
                strokeDashoffset: phase >= 1 ? 0 : 3000,
                transition: "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: `drop-shadow(0 0 10px ${project.accentColor})`,
              }}
            />
          </svg>

          {/* Esquinas decorativas con animación */}
          {[
            { pos: "top-2 left-2", rotate: "0deg", delay: "0.3s" },
            { pos: "top-2 right-2", rotate: "90deg", delay: "0.5s" },
            { pos: "bottom-2 right-2", rotate: "180deg", delay: "0.7s" },
            { pos: "bottom-2 left-2", rotate: "270deg", delay: "0.9s" },
          ].map((corner, i) => (
            <div
              key={i}
              className={`absolute ${corner.pos} w-6 h-6 pointer-events-none`}
              style={{
                opacity: phase >= 1 ? 1 : 0,
                transform: `rotate(${corner.rotate}) scale(${phase >= 1 ? 1 : 0})`,
                transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${corner.delay}`,
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-0.5 rounded-full"
                style={{ backgroundColor: project.accentColor, boxShadow: `0 0 8px ${project.accentColor}` }}
              />
              <div
                className="absolute top-0 left-0 w-0.5 h-full rounded-full"
                style={{ backgroundColor: project.accentColor, boxShadow: `0 0 8px ${project.accentColor}` }}
              />
            </div>
          ))}

          {/* Contenido principal con glassmorphism mejorado */}
          <div
            className="relative bg-background/90 backdrop-blur-2xl rounded-2xl p-6 md:p-10 border border-white/10"
            style={{
              boxShadow: `0 0 80px ${project.glowColor}, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)`,
              background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            }}
          >
            {/* Botón cerrar mejorado */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-500 hover:bg-red-500/20 hover:border-red-400/50 hover:rotate-180 hover:scale-110 z-10 group"
              style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              <X className="w-5 h-5 transition-colors group-hover:text-red-400" />
            </button>

            {/* Header */}
            <div className="relative mb-6 md:mb-8 overflow-hidden">
              {/* Línea lateral animada */}
              <div
                className="absolute -left-8 top-0 w-1 rounded-full"
                style={{
                  height: phase >= 2 ? "100%" : "0%",
                  background: `linear-gradient(to bottom, ${project.accentColor}, transparent)`,
                  boxShadow: `0 0 15px ${project.accentColor}`,
                  transition: "height 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
                }}
              />

              <div className="flex items-center gap-4 flex-wrap mb-4">
                <h2
                  className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s",
                  }}
                >
                  {project.title}
                </h2>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${project.badgeColor} text-white`}
                  style={{
                    boxShadow: `0 0 25px ${project.glowColor}`,
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateX(0) scale(1)" : "translateX(-20px) scale(0.8)",
                    transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s",
                  }}
                >
                  {project.badge}
                </span>
              </div>
            </div>

            {/* Grid de contenido con mejor espaciado */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {/* Columna izquierda */}
              <div className="space-y-5 md:space-y-6">
                {/* Desafío */}
                <div
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.9s",
                  }}
                >
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: project.accentColor,
                        boxShadow: `0 0 8px ${project.accentColor}`,
                        animation: "pulse 2s infinite",
                      }}
                    />
                    El Desafío
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-sm md:text-base">{project.extendedInfo.challenge}</p>
                </div>

                {/* Solución */}
                <div
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 1.1s",
                  }}
                >
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: project.accentColor,
                        boxShadow: `0 0 8px ${project.accentColor}`,
                        animation: "pulse 2s infinite 0.5s",
                      }}
                    />
                    La Solución
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-sm md:text-base">{project.extendedInfo.solution}</p>
                </div>

                {/* Tech Stack */}
                <div
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateY(0)" : "translateY(30px)",
                    transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 1.3s",
                  }}
                >
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: project.accentColor,
                        boxShadow: `0 0 8px ${project.accentColor}`,
                        animation: "pulse 2s infinite 1s",
                      }}
                    />
                    Stack Tecnológico
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.extendedInfo.techStack.map((tech, i) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105"
                        style={{
                          opacity: phase >= 2 ? 1 : 0,
                          transform: phase >= 2 ? "translateY(0) scale(1)" : "translateY(15px) scale(0.8)",
                          transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${1.4 + i * 0.08}s`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna derecha - Resultados */}
              <div
                style={{
                  opacity: phase >= 2 ? 1 : 0,
                  transform: phase >= 2 ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1) 1s",
                }}
              >
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: project.accentColor,
                      boxShadow: `0 0 8px ${project.accentColor}`,
                      animation: "pulse 2s infinite 0.75s",
                    }}
                  />
                  Resultados
                </h3>

                <div className="space-y-3">
                  {project.extendedInfo.results.map((result, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 transition-all duration-500 hover:bg-white/10 hover:border-white/10 hover:translate-x-1 group"
                      style={{
                        opacity: phase >= 2 ? 1 : 0,
                        transform: phase >= 2 ? "translateX(0)" : "translateX(40px)",
                        transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${1.2 + i * 0.15}s`,
                      }}
                    >
                      <CheckCircle2
                        className="w-5 h-5 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: project.accentColor }}
                      />
                      <span className="text-foreground/90">{result}</span>
                    </div>
                  ))}
                </div>

                {/* Botones de acción */}
                <div
                  className="flex gap-4 mt-8"
                  style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.8s",
                  }}
                >
                  <a
                    href={project.extendedInfo.links.demo}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-2xl group backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(135deg, ${project.accentColor}, ${project.accentColor}cc)`,
                      boxShadow: `0 0 30px ${project.glowColor}, 0 8px 24px rgba(0,0,0,0.4)`,
                    }}
                  >
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                    Ver Demo
                  </a>
                  <a
                    href={project.extendedInfo.links.github}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium bg-white/10 backdrop-blur-md border border-white/30 transition-all duration-500 hover:bg-white/20 hover:border-white/50 hover:scale-105 hover:shadow-xl group"
                  >
                    <Github className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Indicador de estado en esquina */}
            <div
              className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground"
              style={{
                opacity: phase >= 2 ? 0.5 : 0,
                transition: "opacity 0.5s 2s",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: project.accentColor }}
              />
              Sistema activo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [clickOrigin, setClickOrigin] = useState<DOMRect | null>(null)

  const openPopup = (project: (typeof projects)[0], e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setClickOrigin(rect)
    setSelectedProject(project)
    setIsPopupOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    document.body.style.overflow = ""
  }

  return (
    <section id="proyectos" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Una trinidad tecnológica: Salud, Operaciones y Automatización Inteligente.
          </h2>
        </div>

        <div className="space-y-24">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onClick={(e) => openPopup(project, e)} />
          ))}
        </div>
      </div>

      {/* Popup tecnológico */}
      <TechPopup project={selectedProject} isOpen={isPopupOpen} onClose={closePopup} originRect={clickOrigin} />
    </section>
  )
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: (typeof projects)[0]
  index: number
  onClick: (e: React.MouseEvent) => void
}) {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const [isHovered, setIsHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-12 items-center cursor-pointer ${isEven ? "" : "lg:grid-flow-col-dense"}`}
      onClick={onClick}
    >
      {/* Content */}
      <div
        className={`space-y-6 transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          } ${isEven ? "" : "lg:col-start-1"}`}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-3xl md:text-4xl font-bold">{project.title}</h3>
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${project.badgeColor} text-white 
              transition-all duration-500 ease-out hover:scale-105`}
            style={{ boxShadow: `0 0 20px ${project.glowColor}` }}
          >
            {project.badge}
          </span>
        </div>

        <p className="text-muted-foreground leading-relaxed text-lg">{project.description}</p>

        <div className="flex flex-wrap gap-6">
          {project.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-muted-foreground group cursor-default">
              <feature.icon
                className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
                style={{ color: project.accentColor }}
              />
              <span className="transition-colors duration-300 group-hover:text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag.name}
              className={`px-4 py-2 rounded-full text-sm font-mono border ${tag.color} bg-white/5 backdrop-blur-sm
                transition-all duration-500 hover:scale-105 hover:bg-white/10`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Click hint */}
        <p className="text-xs text-muted-foreground/50 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.accentColor }} />
          Click para ver detalles del proyecto
        </p>
      </div>

      {/* Image */}
      <div
        className={`relative transition-all duration-1000 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          } ${isEven ? "" : "lg:col-start-2"}`}
        style={{ transitionDelay: "200ms" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10 transition-all duration-700 group"
          style={{
            boxShadow: isHovered
              ? `0 25px 80px ${project.glowColor}, 0 0 40px ${project.glowColor}`
              : `0 10px 40px rgba(0,0,0,0.5)`,
            transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          }}
        >
          {/* Imagen estática */}
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full aspect-video object-cover transition-all duration-700"
            style={{
              opacity: isHovered ? 0 : 1,
              filter: isHovered ? "blur(10px)" : "none",
            }}
          />

          {/* GIF overlay */}
          <img
            src={project.gif || "/placeholder.svg"}
            alt={`${project.title} demo`}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scale(1)" : "scale(1.1)",
            }}
          />

          {/* Overlay con gradiente */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${project.accentColor}20 0%, transparent 50%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Play indicator */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{ opacity: isHovered ? 0 : 0.7 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
              style={{ backgroundColor: `${project.accentColor}30` }}
            >
              <div
                className="w-0 h-0 ml-1"
                style={{
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: "16px solid white",
                }}
              />
            </div>
          </div>

          {/* Corner accents */}
          <div
            className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg transition-all duration-500"
            style={{
              borderColor: project.accentColor,
              opacity: isHovered ? 0.8 : 0,
              transform: isHovered ? "translate(0,0)" : "translate(-10px,-10px)",
            }}
          />
          <div
            className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 rounded-br-lg transition-all duration-500"
            style={{
              borderColor: project.accentColor,
              opacity: isHovered ? 0.8 : 0,
              transform: isHovered ? "translate(0,0)" : "translate(10px,10px)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
