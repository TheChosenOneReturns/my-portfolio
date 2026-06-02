"use client"

import { useInView } from "@/hooks/use-in-view"
import { useState } from "react"
import { Code2, GraduationCap, Brain, Rocket, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function BioSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const { language, t } = useLanguage()

  const timeline = [
    {
      year: "2022",
      titleKey: "bio.2022.title",
      subtitleKey: "bio.2022.subtitle",
      icon: Code2,
      color: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.3)",
      accentColor: "#3b82f6",
      description: language === "es"
        ? "Nacimiento de un interés genuino por la programación. Comencé explorando los fundamentos del desarrollo web moderno."
        : "The birth of a genuine interest in programming. I started exploring the fundamentals of modern web development.",
      technologies: ["HTML5", "CSS3", "JavaScript", "React"],
      achievementKeys: ["bio.2022.achievements.1", "bio.2022.achievements.2"],
    },
    {
      year: "2023",
      titleKey: language === "es" ? "Formación Académica" : "Academic Education",
      subtitleKey: language === "es" ? "Ingreso a Tecnicatura en Desarrollo de Software - ITU" : "Software Development Degree - ITU",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-500",
      glowColor: "rgba(168, 85, 247, 0.3)",
      accentColor: "#a855f7",
      description: language === "es"
        ? "Inicio de formación formal en desarrollo de software. Aprendizaje de fundamentos de programación, gestión de APIs, y bases legales de las TICs."
        : "Beginning of formal software development education. Learning programming fundamentals, API management, and ICT legal frameworks.",
      technologies: ["C++", "Java", "Python", "SQL", "APIs REST", "Git"],
      achievementKeys: ["bio.2022.achievements.1", "bio.2022.achievements.2", "bio.2022.achievements.3"],
    },
    {
      year: "2024",
      titleKey: "bio.2024.title",
      subtitleKey: "bio.2024.subtitle",
      icon: Brain,
      color: "from-emerald-500 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.3)",
      accentColor: "#10b981",
      description: language === "es"
        ? "Expansión hacia inteligencia artificial y computación en la nube. Dominio de herramientas modernas de MLOps, automatización y contenedorización."
        : "Expansion into artificial intelligence and cloud computing. Mastery of modern MLOps, automation, and containerization tools.",
      technologies: [
        "Python (Pandas, NumPy, Polars, CUDA)",
        "N8N",
        "AWS",
        "MongoDB",
        "Docker",
        "Minikube",
        "GitHub Actions",
        "CI/CD",
      ],
      achievementKeys: ["bio.2024.achievements.1", "bio.2024.achievements.2", "bio.2024.achievements.3", "bio.2024.achievements.4"],
    },
    {
      year: "2025",
      titleKey: "bio.2025.title",
      subtitleKey: "bio.2025.subtitle",
      icon: Rocket,
      color: "from-orange-500 to-pink-500",
      glowColor: "rgba(251, 146, 60, 0.3)",
      accentColor: "#fb923c",
      description: language === "es"
        ? "Culminación de estudios con enfoque en integración de IA en aplicaciones web. Construcción de soluciones end-to-end que combinan desarrollo full-stack con inteligencia artificial avanzada."
        : "Culmination of studies with focus on AI integration in web applications. Building end-to-end solutions combining full-stack development with advanced artificial intelligence.",
      technologies: [
        "Next.js",
        "TypeScript",
        "TailwindCSS",
        "LangChain",
        "OpenAI API",
        "FastAPI",
        "TensorFlow",
        "MLOps",
      ],
      achievementKeys: ["bio.2025.achievements.1", "bio.2025.achievements.2", "bio.2025.achievements.3", "bio.2025.achievements.4"],
    },
  ]

  return (
    <section id="sobre-mi" className="relative py-24 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === "es" ? "Ingeniero en" : "Engineer in"}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              {language === "es" ? "Evolución" : "Evolution"}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === "es"
              ? "Mi viaje comenzó en el código clásico, pero encontré mi verdadera pasión en la intersección de la lógica y la cognición artificial."
              : "My journey began with classical code, but I found my true passion at the intersection of logic and artificial cognition."}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 via-emerald-500 to-orange-500 opacity-30 z-0" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0
              const isExpanded = expandedIndex === index
              const title = item.titleKey.startsWith("bio.") ? t(item.titleKey) : item.titleKey
              const subtitle = item.subtitleKey.startsWith("bio.") ? t(item.subtitleKey) : item.subtitleKey

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-700 delay-${index * 100} ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`grid md:grid-cols-2 gap-8 items-start ${isEven ? "" : "md:grid-flow-col-dense"}`}>
                    {/* Year indicator - Desktop */}
                    <div
                      className={`hidden md:block ${isEven ? "text-right pr-12" : "text-left pl-12 md:col-start-2"}`}
                    >
                      <div
                        className={`inline-block px-6 py-2 rounded-full font-bold text-2xl bg-gradient-to-r ${item.color} text-white`}
                        style={{ boxShadow: `0 0 30px ${item.glowColor}` }}
                      >
                        {item.year}
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                      <div
                        className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-background backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${item.accentColor}, ${item.accentColor}cc)`,
                          boxShadow: `0 0 30px ${item.glowColor}, 0 0 60px ${item.glowColor}`,
                        }}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={`ml-24 md:ml-0 ${isEven ? "md:col-start-2" : "md:col-start-1"} relative z-10`}>
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      >
                        {/* Glow effect */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                          style={{ background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)` }}
                        />

                        {/* Card */}
                        <div
                          className="relative bg-background/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:-translate-y-2 group-hover:shadow-2xl"
                          style={{
                            boxShadow: `0 4px 24px ${item.glowColor}`,
                          }}
                        >
                          {/* Year indicator - Mobile */}
                          <div
                            className={`md:hidden mb-4 inline-block px-4 py-1 rounded-full font-bold text-lg bg-gradient-to-r ${item.color} text-white`}
                            style={{ boxShadow: `0 0 20px ${item.glowColor}` }}
                          >
                            {item.year}
                          </div>

                          {/* Title */}
                          <h3
                            className={`text-2xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                          >
                            {title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">{subtitle}</p>

                          {/* Description */}
                          <p className="text-foreground/90 leading-relaxed mb-4">{item.description}</p>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.technologies.slice(0, isExpanded ? undefined : 4).map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-105"
                                style={{
                                  borderColor: `${item.accentColor}33`,
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                            {!isExpanded && item.technologies.length > 4 && (
                              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10">
                                +{item.technologies.length - 4} {language === "es" ? "más" : "more"}
                              </span>
                            )}
                          </div>

                          {/* Achievements - Expanded */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                {language === "es" ? "Logros" : "Achievements"}
                              </h4>
                              <ul className="space-y-2">
                                {item.achievementKeys.map((key, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                                    <span
                                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                      style={{ backgroundColor: item.accentColor }}
                                    />
                                    {t(key)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Expand indicator */}
                          <div className="flex justify-center mt-2">
                            <ChevronDown
                              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer quote */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            {language === "es"
              ? '"Creo firmemente que la tecnología debe servir para liberar el potencial humano, automatizando lo repetitivo y resolviendo lo crítico."'
              : '"I firmly believe that technology should serve to unleash human potential, automating the repetitive and solving the critical."'}
          </p>
        </div>
      </div>
    </section>
  )
}
