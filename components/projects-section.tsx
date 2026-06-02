"use client"

import { useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { ProjectAbstractVisual } from "@/components/project-abstract-visual"

const projects = [
  {
    id: "intelligent-flows" as const,
    title: "Intelligent Flows",
    badge: "n8n &middot; Automation",
    accent: "#7c3aed",
    descriptionKey: "projects.intelligentFlows.description",
    features: ["projects.intelligentFlows.features.1", "projects.intelligentFlows.features.2"],
    stack: ["n8n", "LangChain", "PostgreSQL", "Redis", "Docker", "OpenAI API"],
  },
  {
    id: "prega" as const,
    title: "PREGA",
    badge: "MLOps",
    accent: "#8b5cf6",
    descriptionKey: "projects.prega.description",
    features: ["projects.prega.features.1", "projects.prega.features.2"],
    stack: ["Python", "FastAPI", "Docker", "MLflow", "PostgreSQL", "Redis"],
  },
  {
    id: "empatia" as const,
    title: "EMPATIA",
    badge: "HealthTech &middot; AI",
    accent: "#a78bfa",
    descriptionKey: "projects.empatia.description",
    features: ["projects.empatia.features.1", "projects.empatia.features.2"],
    stack: ["Python", "TensorFlow", "OpenCV", "DICOM", "Flask", "AWS S3"],
  },
]

function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: (typeof projects)[0] | null
  isOpen: boolean
  onClose: () => void
}) {
  const { t } = useLanguage()

  if (!project || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />

      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl p-8 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">{project.title}</h2>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: project.accent }}
            >
              {project.badge}
            </span>
          </div>
        </div>

        <div className="mb-8 h-56 md:h-64">
          <ProjectAbstractVisual projectId={project.id} className="h-full" />
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed mb-8">
          {t(project.descriptionKey)}
        </p>

        <div className="mb-8">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
            {t("projects.popup.keyResults")}
          </h3>
          <ul className="space-y-3">
            {project.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: project.accent }} />
                {t(feat)}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
            {t("projects.popup.techStack")}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-2 rounded-full text-sm font-mono bg-secondary/50 border border-border/50 text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const { t } = useLanguage()

  const openModal = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = ""
  }

  return (
    <section id="proyectos" className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-20 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Case Studies</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Tres proyectos que representan el espectro de lo que construyo: automatización inteligente, operaciones de machine learning, e inteligencia artificial aplicada a la salud.
          </p>
        </div>

        <div className="space-y-28">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <button
                  onClick={() => openModal(project)}
                  className="w-full text-left group cursor-pointer"
                >
                  <ProjectAbstractVisual
                    projectId={project.id}
                    className="h-72 md:h-96 transition-all duration-500 group-hover:border-primary/50 bloom-sm hover:bloom-md"
                  />
                </button>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-3xl md:text-4xl font-bold">{project.title}</h3>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: project.accent }}
                    >
                      {project.badge}
                    </span>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t(project.descriptionKey)}
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-full text-sm font-mono bg-secondary/50 border border-border/40 text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openModal(project)}
                    className="inline-flex items-center gap-2 text-base font-medium text-primary hover:text-primary/80 transition-colors group"
                  >
                    Ver detalles
                    <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
