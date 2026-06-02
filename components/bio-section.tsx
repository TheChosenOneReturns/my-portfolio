"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import { Code2, GraduationCap, Brain, Rocket, ChevronDown, Cpu } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function BioSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const { language, t } = useLanguage()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"])

  const timeline = [
    {
      year: "2022",
      titleKey: language === "es" ? "El Comienzo" : "The Beginning",
      subtitleKey: language === "es" ? "Primeros Pasos en Desarrollo" : "First Steps in Development",
      icon: Code2,
      color: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.4)",
      accentColor: "#3b82f6",
      description: language === "es"
        ? "Nacimiento de un interes genuino por la programacion. Comence explorando los fundamentos del desarrollo web moderno."
        : "The birth of a genuine interest in programming. I started exploring the fundamentals of modern web development.",
      technologies: ["HTML5", "CSS3", "JavaScript", "React"],
      achievements: [
        language === "es" ? "Fundamentos solidos de programacion" : "Solid programming fundamentals",
        language === "es" ? "Primeros proyectos web" : "First web projects"
      ],
    },
    {
      year: "2023",
      titleKey: language === "es" ? "Formacion Academica" : "Academic Education",
      subtitleKey: language === "es" ? "Tecnicatura en Desarrollo - ITU" : "Software Development Degree - ITU",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.4)",
      accentColor: "#10b981",
      description: language === "es"
        ? "Inicio de formacion formal en desarrollo de software. Aprendizaje de fundamentos avanzados y gestion de APIs."
        : "Beginning of formal software development education. Learning advanced fundamentals and API management.",
      technologies: ["C++", "Java", "Python", "SQL", "APIs REST", "Git"],
      achievements: [
        language === "es" ? "Gestion de APIs" : "API Management",
        language === "es" ? "Bases de datos" : "Database Management"
      ],
    },
    {
      year: "2024",
      titleKey: language === "es" ? "Especializacion IA & Cloud" : "AI & Cloud Specialization",
      subtitleKey: language === "es" ? "Certificaciones y Proyectos Avanzados" : "Certifications & Advanced Projects",
      icon: Brain,
      color: "from-cyan-500 to-blue-500",
      glowColor: "rgba(34, 211, 238, 0.4)",
      accentColor: "#22d3ee",
      description: language === "es"
        ? "Expansion hacia inteligencia artificial y cloud computing. Dominio de herramientas MLOps y automatizacion."
        : "Expansion into artificial intelligence and cloud computing. Mastery of MLOps tools and automation.",
      technologies: ["Python", "N8N", "AWS", "Docker", "CI/CD", "TensorFlow"],
      achievements: [
        language === "es" ? "Certificacion N8N" : "N8N Certification",
        language === "es" ? "Certificacion AWS" : "AWS Certification",
        language === "es" ? "DevOps & Cloud" : "DevOps & Cloud"
      ],
    },
    {
      year: "2025",
      titleKey: language === "es" ? "Full-Stack + IA Avanzada" : "Full-Stack + Advanced AI",
      subtitleKey: language === "es" ? "Especializacion en Agentes IA" : "AI Agents Specialization",
      icon: Rocket,
      color: "from-orange-500 to-amber-500",
      glowColor: "rgba(251, 146, 60, 0.4)",
      accentColor: "#fb923c",
      description: language === "es"
        ? "Desarrollo de agentes IA autonomos y sistemas RAG. Integracion de LLMs en aplicaciones empresariales."
        : "Development of autonomous AI agents and RAG systems. Integration of LLMs in enterprise applications.",
      technologies: ["Next.js", "LangChain", "OpenAI API", "FastAPI", "Vector DBs", "RAG"],
      achievements: [
        language === "es" ? "Agentes IA autonomos" : "Autonomous AI Agents",
        language === "es" ? "Sistemas RAG" : "RAG Systems",
        language === "es" ? "Arquitecturas full-stack" : "Full-stack Architectures"
      ],
    },
    {
      year: "2026",
      titleKey: language === "es" ? "IA Aplicada & Graduacion" : "Applied AI & Graduation",
      subtitleKey: language === "es" ? "Ingeniero IA - Graduacion Julio 2026" : "AI Engineer - Graduating July 2026",
      icon: Cpu,
      color: "from-cyan-400 to-emerald-400",
      glowColor: "rgba(34, 211, 238, 0.5)",
      accentColor: "#22d3ee",
      description: language === "es"
        ? "Culminacion de estudios con enfoque en IA aplicada. Construccion de soluciones end-to-end que combinan desarrollo full-stack con inteligencia artificial de ultima generacion."
        : "Culmination of studies with focus on applied AI. Building end-to-end solutions combining full-stack development with cutting-edge artificial intelligence.",
      technologies: ["AI Agents", "Multi-modal AI", "MLOps", "Kubernetes", "Real-time ML", "AI Gateway"],
      achievements: [
        language === "es" ? "Multi-agentes IA" : "Multi-agent AI Systems",
        language === "es" ? "IA Multimodal" : "Multi-modal AI",
        language === "es" ? "Graduacion ITU" : "ITU Graduation"
      ],
    },
  ]

  return (
    <section id="sobre-mi" className="relative py-24 px-4 overflow-hidden" ref={containerRef}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "es" ? "Ingeniero en" : "Engineer in"}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {language === "es" ? "Evolucion" : "Evolution"}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === "es"
              ? "Mi viaje comenzo en el codigo clasico, pero encontre mi verdadera pasion en la interseccion de la logica y la cognicion artificial."
              : "My journey began with classical code, but I found my true passion at the intersection of logic and artificial cognition."}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/20">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-500 via-emerald-500 to-cyan-500"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0
              const isExpanded = expandedIndex === index
              const itemRef = useRef(null)
              const itemInView = useInView(itemRef, { once: true, margin: "-50px" })

              return (
                <motion.div
                  ref={itemRef}
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={itemInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`grid md:grid-cols-2 gap-8 items-start ${isEven ? "" : "md:grid-flow-col-dense"}`}>
                    {/* Year indicator - Desktop */}
                    <div className={`hidden md:block ${isEven ? "text-right pr-12" : "text-left pl-12 md:col-start-2"}`}>
                      <motion.div
                        className={`inline-block px-6 py-2 rounded-full font-bold text-2xl bg-gradient-to-r ${item.color} text-white`}
                        style={{ boxShadow: `0 0 30px ${item.glowColor}` }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.year}
                      </motion.div>
                    </div>

                    {/* Timeline dot */}
                    <motion.div 
                      className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20"
                      initial={{ scale: 0 }}
                      animate={itemInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      <motion.div
                        className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-background backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${item.accentColor}, ${item.accentColor}cc)`,
                        }}
                        animate={{
                          boxShadow: [
                            `0 0 20px ${item.glowColor}`,
                            `0 0 40px ${item.glowColor}`,
                            `0 0 20px ${item.glowColor}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>

                    {/* Content card */}
                    <div className={`ml-24 md:ml-0 ${isEven ? "md:col-start-2" : "md:col-start-1"} relative z-10`}>
                      <motion.div
                        className="relative group cursor-pointer"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        whileHover={{ y: -5 }}
                      >
                        {/* Glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                          style={{ background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)` }}
                        />

                        {/* Card */}
                        <div
                          className="relative bg-card/90 backdrop-blur-xl rounded-2xl p-6 border border-border/50 transition-all duration-500 group-hover:border-border"
                          style={{ boxShadow: `0 4px 24px ${item.glowColor}` }}
                        >
                          {/* Year indicator - Mobile */}
                          <div
                            className={`md:hidden mb-4 inline-block px-4 py-1 rounded-full font-bold text-lg bg-gradient-to-r ${item.color} text-white`}
                            style={{ boxShadow: `0 0 20px ${item.glowColor}` }}
                          >
                            {item.year}
                          </div>

                          {/* Title */}
                          <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                            {item.titleKey}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">{item.subtitleKey}</p>

                          {/* Description */}
                          <p className="text-foreground/90 leading-relaxed mb-4">{item.description}</p>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.technologies.slice(0, isExpanded ? undefined : 4).map((tech, i) => (
                              <motion.span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-mono bg-secondary/50 border border-border/50 backdrop-blur-sm"
                                style={{ borderColor: `${item.accentColor}33` }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.05, borderColor: item.accentColor }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                            {!isExpanded && item.technologies.length > 4 && (
                              <span className="px-3 py-1 rounded-full text-xs font-mono bg-secondary/50 border border-border/50">
                                +{item.technologies.length - 4}
                              </span>
                            )}
                          </div>

                          {/* Achievements - Expanded */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-border/30"
                              >
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                  {language === "es" ? "Logros" : "Achievements"}
                                </h4>
                                <ul className="space-y-2">
                                  {item.achievements.map((achievement, i) => (
                                    <motion.li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-foreground/90"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                    >
                                      <span
                                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                        style={{ backgroundColor: item.accentColor }}
                                      />
                                      {achievement}
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Expand indicator */}
                          <motion.div 
                            className="flex justify-center mt-2"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                          >
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer quote */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            {language === "es"
              ? '"Creo firmemente que la tecnologia debe servir para liberar el potencial humano, automatizando lo repetitivo y resolviendo lo critico."'
              : '"I firmly believe that technology should serve to unleash human potential, automating the repetitive and solving the critical."'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
