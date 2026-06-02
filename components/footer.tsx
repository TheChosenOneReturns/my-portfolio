"use client"

import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-10 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#00f5ff]/10 border border-[#00f5ff]/20 flex items-center justify-center">
            <span className="text-xs font-bold text-[#00f5ff] tracking-tight">AB</span>
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
