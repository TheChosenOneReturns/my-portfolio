"use client"

import { motion } from "framer-motion"
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
      technologies: ["Python (Pandas, NumPy)", "n8n", "AWS", "MongoDB", "Docker", "GitHub Actions", "CI/CD"],
      achievementKeys: ["bio.2024.achievements.1", "bio.2024.achievements.2", "bio.2024.achievements.3", "bio.2024.achievements.4"],
    },
    {
      year: "2025",
      titleKey: "bio.2025.title",
      subtitleKey: "bio.2025.subtitle",
      icon: Rocket,
      description: language === "es"
        ? "Culminación de estudios con enfoque en integración de IA en aplicaciones web. Construcción de soluciones end-to-end."
        : "Culmination of studies with focus on AI integration in web applications. Building end-to-end solutions.",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "LangChain", "OpenAI API", "FastAPI", "TensorFlow", "MLOps"],
      achievementKeys: ["bio.2025.achievements.1", "bio.2025.achievements.2", "bio.2025.achievements.3", "bio.2025.achievements.4"],
    },
  ]

  return (
    <section id="sobre-mi" className="section-fog relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-white">
            {language === "es" ? "Trayectoria" : "Trajectory"}
          </h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl">
            {language === "es" ? "De los fundamentos del código a la integración de IA." : "From coding fundamentals to AI integration."}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-7 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--spectral-cyan)]/0 via-[var(--spectral-cyan)]/45 to-[var(--spectral-magenta)]/0" />

          <div className="space-y-16">
            {timeline.map((item, index) => {
              const title = item.titleKey.startsWith("bio.") ? t(item.titleKey) : item.titleKey
              const subtitle = item.subtitleKey.startsWith("bio.") ? t(item.subtitleKey) : item.subtitleKey

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className="relative flex gap-6 md:gap-8"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--void-black)] border border-[var(--spectral-cyan)]/25 flex items-center justify-center shadow-[0_0_30px_rgba(0,245,255,0.12)]">
                      <item.icon className="w-6 h-6 md:w-7 md:h-7 text-[var(--spectral-cyan)]" />
                    </div>
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-mono text-[var(--hot-white)] px-2.5 py-1 rounded border border-[var(--accretion-orange)]/25 bg-[var(--accretion-orange)]/10">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">{title}</h3>
                    <p className="text-base text-white/50 mb-2">{subtitle}</p>
                    <p className="text-base text-white/60 leading-relaxed mb-5">{item.description}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.technologies.map((tech) => (
                        <span key={tech} className="px-3 py-1.5 rounded-full text-sm font-mono bg-white/[0.035] border border-white/10 text-white/55 hover:border-[var(--spectral-magenta)]/35 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <ul className="space-y-2">
                      {item.achievementKeys.map((key, i) => (
                        <li key={i} className="flex items-start gap-3 text-base text-white/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--spectral-cyan)]/70 mt-2 flex-shrink-0 shadow-[0_0_12px_rgba(0,245,255,0.45)]" />
                          {t(key)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
