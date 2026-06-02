"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, FlowArrow, Code } from "@phosphor-icons/react"
import { useLanguage } from "@/lib/language-context"
import { TiltCard } from "./scroll-animations"

// Simple Icons SVG paths for technology logos
const TechIcons = {
  python: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09z" />
      <path d="M21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
    </svg>
  ),
  tensorflow: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-6.155-3.54v12.644L12.47 22.65V0l10.25 5.856.002 5.31zm-10.26.019l4.097 2.365v4.736l-4.097 2.365v-9.466z" />
    </svg>
  ),
  opencv: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.8 0C9.59 0 7.48.654 5.7 1.87l.003.003C3.818 3.163 2.355 5.04 1.536 7.168.72 9.296.563 11.55 1.03 13.8c.468 2.25 1.553 4.352 3.142 6.042 1.59 1.69 3.62 2.866 5.866 3.38 2.247.515 4.597.37 6.766-.369 2.17-.738 4.065-2.066 5.483-3.835 1.418-1.77 2.3-3.906 2.557-6.145.257-2.24-.123-4.52-1.1-6.533l-.003-.003A11.737 11.737 0 0 0 19.05 1.87 11.917 11.917 0 0 0 11.8 0zM7.385 4.577c1.56-.997 3.394-1.3 5.136-.956 1.742.346 3.28 1.383 4.327 2.892 1.046 1.508 1.52 3.345 1.347 5.128-.172 1.783-.982 3.458-2.246 4.717-1.264 1.26-2.933 2.062-4.7 2.214-1.767.151-3.539-.354-4.978-1.42-1.439-1.065-2.422-2.602-2.762-4.34-.34-1.74.007-3.55.966-5.092l3.066 1.767c-.49.736-.706 1.6-.612 2.458.093.859.46 1.67 1.044 2.296.584.626 1.357 1.038 2.192 1.16.835.122 1.69-.04 2.415-.46.726-.42 1.275-1.072 1.554-1.847.28-.775.275-1.622-.005-2.393-.28-.771-.832-1.416-1.56-1.829-.73-.413-1.582-.567-2.416-.44l-.037-3.524z" />
    </svg>
  ),
  n8n: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.5 4.5h1v3h-1v-3zm-5 5.5h3v1h-3v-1zm5.5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm5.5-.5h3v1h-3v-1zm-5.5 5.5h1v3h-1v-3z" />
    </svg>
  ),
  openai: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295z" />
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.572 0z" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.998 24c-.321 0-.641-.084-.922-.247L8.14 22.016c-.438-.245-.224-.332-.08-.383.664-.23.799-.282 1.508-.681.075-.042.171-.026.248.015l2.255 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.193-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.285 6.68c-.085.049-.139.143-.139.242v10.072c0 .097.054.189.137.236l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v9.944c0 1.743-.95 2.745-2.604 2.745-.509 0-.909 0-2.026-.551L2.53 18.527A1.853 1.853 0 0 1 1.61 16.92V6.85c0-.629.335-1.217.922-1.531L11.327.243a1.905 1.905 0 0 1 1.849 0l8.794 5.076c.587.314.922.902.922 1.531v10.072a1.852 1.852 0 0 1-.922 1.531l-8.795 5.076c-.282.163-.6.247-.921.247z" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.97 0 8 1.567 8 2.5S16.97 9 12 9 4 7.433 4 6.5 7.03 4 12 4zm8 14c0 .93-3.03 2.5-8 2.5S4 18.93 4 18v-2.5c1.62 1.01 4.53 1.5 8 1.5s6.38-.49 8-1.5V18zm0-5c0 .93-3.03 2.5-8 2.5S4 13.93 4 13v-2.5c1.62 1.01 4.53 1.5 8 1.5s6.38-.49 8-1.5V13z" />
    </svg>
  ),
  rag: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  ),
}

export function StackSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })
  const { t } = useLanguage()

  const stackCategories = [
    {
      id: 1,
      titleKey: "stack.iaData",
      icon: Brain,
      borderColor: "from-cyan-500 to-blue-500",
      glowColor: "rgba(34, 211, 238, 0.4)",
      skills: [
        { name: "Python (Pandas, NumPy)", level: "Adv.", icon: TechIcons.python, iconColor: "#3776AB" },
        { name: "TensorFlow / Keras", level: "Int.", icon: TechIcons.tensorflow, iconColor: "#FF6F00" },
        { name: "Computer Vision", level: "Spec.", icon: TechIcons.opencv, iconColor: "#5C3EE8" },
      ],
    },
    {
      id: 2,
      titleKey: "stack.automation",
      icon: FlowArrow,
      borderColor: "from-emerald-500 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.4)",
      skills: [
        { name: "n8n Workflows", level: "Expert", icon: TechIcons.n8n, iconColor: "#EA4B71" },
        { name: "LLM Integration", level: "Adv.", icon: TechIcons.openai, iconColor: "#00A67E" },
        { name: "RAG Systems", level: "Adv.", icon: TechIcons.rag, iconColor: "#22d3ee" },
      ],
    },
    {
      id: 3,
      titleKey: "stack.fullstack",
      icon: Code,
      borderColor: "from-blue-500 to-indigo-500",
      glowColor: "rgba(59, 130, 246, 0.4)",
      skills: [
        { name: "React / Next.js", level: "Adv.", icon: TechIcons.react, iconColor: "#61DAFB" },
        { name: "Node.js / Express", level: "Adv.", icon: TechIcons.nodejs, iconColor: "#339933" },
        { name: "SQL & NoSQL", level: "Int.", icon: TechIcons.database, iconColor: "#4479A1" },
      ],
    },
  ]

  return (
    <section id="stack" className="relative py-24 px-4 overflow-hidden" ref={containerRef}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 60%)" }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 60%)" }}
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Tech Stack
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stackCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <TiltCard>
                <motion.div 
                  className="relative p-[2px] rounded-2xl overflow-hidden h-full group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated gradient border */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-b ${category.borderColor} opacity-50`}
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                    style={{ background: category.glowColor }}
                  />

                  {/* Card content */}
                  <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl p-6 h-full border border-border/30 transition-all duration-500 group-hover:border-border">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        animate={{
                          boxShadow: [
                            `0 0 10px ${category.glowColor}`,
                            `0 0 20px ${category.glowColor}`,
                            `0 0 10px ${category.glowColor}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-2 rounded-lg bg-background/50"
                      >
                        <category.icon
                          weight="duotone"
                          className="w-6 h-6 text-foreground"
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold">{t(category.titleKey)}</h3>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 
                            hover:bg-secondary/50 transition-all duration-300 cursor-default group/skill border border-transparent hover:border-border/50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: index * 0.15 + skillIndex * 0.1 + 0.3 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center gap-3">
                            <motion.span
                              className="transition-all duration-300"
                              style={{ color: skill.iconColor }}
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              {skill.icon}
                            </motion.span>
                            <span className="text-sm font-medium">{skill.name}</span>
                          </div>
                          <span
                            className={`text-xs font-mono px-2 py-1 rounded transition-all duration-300
                              ${skill.level === "Expert"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : skill.level === "Adv."
                                  ? "bg-cyan-500/20 text-cyan-400"
                                  : skill.level === "Spec."
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-background/50 text-muted-foreground"
                              }`}
                          >
                            {skill.level}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
