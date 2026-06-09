"use client"

import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-10 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[var(--void-black)]/45">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[var(--spectral-cyan)]/10 border border-[var(--spectral-cyan)]/25 flex items-center justify-center shadow-[0_0_22px_rgba(0,245,255,0.12)]">
            <span className="text-xs font-bold text-[var(--spectral-cyan)] tracking-tight">AB</span>
          </div>
          <span className="text-base font-medium text-white/80">ABDEV</span>
        </div>

        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} &mdash; {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  )
}
