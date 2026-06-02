"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { X, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const projects = [
  {
    id: "intelligent-flows",
    title: "Intelligent Flows",
    badge: "n8n &middot; Automation",
    accent: "#00f5ff",
    descriptionKey: "projects.intelligentFlows.description",
    features: ["projects.intelligentFlows.features.1", "projects.intelligentFlows.features.2"],
    stack: ["n8n", "LangChain", "PostgreSQL", "Redis", "Docker", "OpenAI API"],
  },
  {
    id: "prega",
    title: "PREGA",
    badge: "MLOps",
    accent: "#ff6b35",
    descriptionKey: "projects.prega.description",
    features: ["projects.prega.features.1", "projects.prega.features.2"],
    stack: ["Python", "FastAPI", "Docker", "MLflow", "PostgreSQL", "Redis"],
  },
  {
    id: "empatia",
    title: "EMPATIA",
    badge: "HealthTech &middot; AI",
    accent: "#ff00ff",
    descriptionKey: "projects.empatia.description",
    features: ["projects.empatia.features.1", "projects.empatia.features.2"],
    stack: ["Python", "TensorFlow", "OpenCV", "DICOM", "Flask", "AWS S3"],
  },
]

function ProjectModal({ project, isOpen, onClose }: { project: (typeof projects)[0] | null; isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage()
  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-2xl p-8 md:p-10 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: project.accent }}>
                  {project.badge}
                </span>
              </div>
            </div>

            <p className="text-lg text-white/70 leading-relaxed mb-8">
              {t(project.descriptionKey)}
            </p>

            <div className="mb-8">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-4">
                {t("projects.popup.keyResults")}
              </h3>
              <ul className="space-y-3">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: project.accent }} />
                    {t(feat)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white/40 mb-4">
                {t("projects.popup.techStack")}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="px-3.5 py-2 rounded-full text-sm font-mono bg-white/5 border border-white/10 text-white/60">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">{t("projects.title")}</h2>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-28">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
            >
              <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <button onClick={() => openModal(project)} className="w-full text-left group cursor-pointer">
                  <div 
                    className="h-72 md:h-96 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0a] border border-white/10 p-8 flex flex-col justify-between transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(124,58,237,0.15)] relative overflow-hidden"
                  >
                    {/* Abstract visual representation */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: project.accent }} />
                    </div>
                    <div className="relative z-10">
                      <span className="text-xs font-mono uppercase tracking-wider text-white/40">{project.id}</span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.slice(0, 4).map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: project.accent }}>
                      {project.badge}
                    </span>
                  </div>
                  <p className="text-lg text-white/60 leading-relaxed">
                    {t(project.descriptionKey)}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {project.stack.map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-full text-sm font-mono bg-white/5 border border-white/10 text-white/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => openModal(project)} className="inline-flex items-center gap-2 text-base font-medium text-[#00f5ff] hover:text-[#00f5ff]/80 transition-colors group">
                    {t("projects.viewDetails")}
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
