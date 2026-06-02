"use client"

import { useInView } from "@/hooks/use-in-view"
import { Code2, GraduationCap, Brain, Rocket } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function BioSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const { language, t } = useLanguage()

  const timeline = [
    {
      year: "2022",
      titleKey: "bio.2022.title",
      subtitleKey: "bio.2022.subtitle",
      icon: Code2,
      description: language === "es"
        ? "Nacimiento de un interés genuino por la programación. Comencé explorando los fundamentos del desarrollo web moderno."
        : "The birth of a genuine interest in programming. I started exploring the fundamentals of modern web development.",
      technologies: ["HTML5", "CSS3", "JavaScript", "React"],
      achievementKeys: ["bio.2022.achievements.1", "bio.2022.achievements.2", "bio.2022.achievements.3"],
    },
    {
      year: "2023",
      titleKey: language === "es" ? "Formación Académica" : "Academic Education",
      subtitleKey: language === "es" ? "Ingreso a Tecnicatura en Desarrollo de Software - ITU" : "Software Development Degree - ITU",
      icon: GraduationCap,
      description: language === "es"
        ? "Inicio de formación formal en desarrollo de software. Aprendizaje de fundamentos de programación, gestión de APIs, y bases legales de las TICs."
        : "Beginning of formal software development education. Learning programming fundamentals, API management, and ICT legal frameworks.",
      technologies: ["C++", "Java", "Python", "SQL", "REST APIs", "Git"],
      achievementKeys: ["bio.2022.achievements.1", "bio.2022.achievements.2", "bio.2022.achievements.3"],
    },
    {
      year: "2024",
      titleKey: "bio.2024.title",
      subtitleKey: "bio.2024.subtitle",
      icon: Brain,
      description: language === "es"
        ? "Expansión hacia inteligencia artificial y computación en la nube. Dominio de herramientas modernas de MLOps, automatización y contenedorización."
        : "Expansion into artificial intelligence and cloud computing. Mastery of modern MLOps, automation, and containerization tools.",
      technologies: [
        "Python (Pandas, NumPy)",
        "n8n",
        "AWS",
        "MongoDB",
        "Docker",
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {language === "es" ? "Trayectoria" : "Trajectory"}
          </h2>
          <p className="text-muted-foreground max-w-xl">
            {language === "es"
              ? "De los fundamentos del código a la integración de IA. Un camino de curiosidad constante."
              : "From coding fundamentals to AI integration. A path of constant curiosity."}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const title = item.titleKey.startsWith("bio.") ? t(item.titleKey) : item.titleKey
              const subtitle = item.subtitleKey.startsWith("bio.") ? t(item.subtitleKey) : item.subtitleKey

              return (
                <div
                  key={index}
                  className={`relative flex gap-6 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-card border border-border flex items-center justify-center">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-primary/70 px-2 py-0.5 rounded bg-primary/5">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{subtitle}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">{item.description}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-full text-xs font-mono bg-secondary/40 border border-border/30 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Achievements */}
                    <ul className="space-y-1.5">
                      {item.achievementKeys.map((key, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/60">
                          <span className="w-1 h-1 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                          {t(key)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
