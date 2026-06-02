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
    badge: "n8n · Automation",
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
    badge: "HealthTech · AI",
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-lg" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl md:text-3xl font-bold">{project.title}</h2>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: project.accent }}
            >
              {project.badge}
            </span>
          </div>
        </div>

        {/* Visual */}
        <div className="mb-6 h-48">
          <ProjectAbstractVisual projectId={project.id} className="h-full" />
        </div>

        {/* Description */}
        <p className="text-foreground/80 leading-relaxed mb-6">
          {t(project.descriptionKey)}
        </p>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
            {t("projects.popup.keyResults")}
          </h3>
          <ul className="space-y-2">
            {project.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: project.accent }} />
                {t(feat)}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
            {t("projects.popup.techStack")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-xs font-mono bg-secondary/50 border border-border/50 text-muted-foreground"
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
    <section id="proyectos" className="relative py-24 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Case Studies</h2>
          <p className="text-muted-foreground max-w-xl">
            Tres proyectos que representan el espectro de lo que construyo: automatización inteligente, operaciones de machine learning, e inteligencia artificial aplicada a la salud.
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-20">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Visual */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <button
                  onClick={() => openModal(project)}
                  className="w-full text-left group cursor-pointer"
                >
                  <ProjectAbstractVisual
                    projectId={project.id}
                    className="h-64 md:h-80 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_0_40px_rgba(124,58,237,0.06)]"
                  />
                </button>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl md:text-3xl font-bold">{project.title}</h3>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: project.accent }}
                    >
                      {project.badge}
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {t(project.descriptionKey)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-full text-xs font-mono bg-secondary/50 border border-border/40 text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openModal(project)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                  >
                    Ver detalles
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
