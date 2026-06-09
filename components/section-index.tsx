"use client"

import { portfolioSections } from "@/lib/sections"
import { useLanguage } from "@/lib/language-context"
import { useActiveSection } from "@/hooks/use-active-section"

export function SectionIndex() {
  const { t } = useLanguage()
  const { activeIndex, activeSection, progress } = useActiveSection()

  return (
    <aside className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <nav className="glass-spectral glitch-sweep relative overflow-hidden rounded-full px-3 py-4">
        <div className="absolute left-[1.42rem] top-6 bottom-6 w-px bg-white/10" />
        <div
          className="absolute left-[1.42rem] top-6 w-px bg-[linear-gradient(to_bottom,var(--spectral-cyan),var(--spectral-magenta),var(--accretion-orange))] shadow-[0_0_18px_var(--spectral-cyan)]"
          style={{ height: `calc((100% - 3rem) * ${progress})` }}
        />

        <ol className="relative flex flex-col gap-2">
          {portfolioSections.map((section, index) => {
            const isActive = section.id === activeSection

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="glitch-hover group flex items-center gap-3 rounded-full py-2 pl-1 pr-3"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={`relative grid h-5 w-5 place-items-center rounded-full border text-[10px] font-mono transition-all ${
                      isActive
                        ? "border-[var(--hot-white)] bg-[var(--spectral-cyan)] text-black shadow-[0_0_24px_var(--spectral-cyan)]"
                        : "border-white/15 bg-black text-white/35 group-hover:border-[var(--spectral-cyan)] group-hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`max-w-0 overflow-hidden whitespace-nowrap text-xs font-mono uppercase tracking-[0.22em] transition-all duration-300 group-hover:max-w-28 ${
                      isActive ? "max-w-28 text-white text-glow" : "text-white/45"
                    }`}
                    data-text={t(section.labelKey)}
                  >
                    {t(section.labelKey)}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
        <span className="mt-3 block text-center text-[10px] font-mono text-white/25">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
      </nav>
    </aside>
  )
}
