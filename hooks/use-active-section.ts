"use client"

import { useEffect, useState } from "react"
import { portfolioSections, type PortfolioSectionId } from "@/lib/sections"

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<PortfolioSectionId>(portfolioSections[0].id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrame = 0

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progressValue = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
      const probeY = window.scrollY + window.innerHeight * 0.45

      const sectionPositions = portfolioSections
        .map((section) => {
          const element = document.getElementById(section.id)
          return element ? { id: section.id, top: element.offsetTop } : null
        })
        .filter(Boolean) as Array<{ id: PortfolioSectionId; top: number }>

      const current = sectionPositions.reduce<PortfolioSectionId>((active, section) => {
        return section.top <= probeY ? section.id : active
      }, portfolioSections[0].id)

      setProgress(progressValue)
      setActiveSection(current)
    }

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(measure)
    }

    scheduleMeasure()
    window.addEventListener("scroll", scheduleMeasure, { passive: true })
    window.addEventListener("resize", scheduleMeasure)
    window.addEventListener("hashchange", scheduleMeasure)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("scroll", scheduleMeasure)
      window.removeEventListener("resize", scheduleMeasure)
      window.removeEventListener("hashchange", scheduleMeasure)
    }
  }, [])

  const activeIndex = portfolioSections.findIndex((section) => section.id === activeSection)

  return {
    activeIndex: Math.max(activeIndex, 0),
    activeSection,
    progress,
  }
}
