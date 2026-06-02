"use client"

import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-8 px-4 border-t border-border/20">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary tracking-tight">AB</span>
          </div>
          <span className="text-sm font-medium text-foreground/80">ABDEV</span>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} &mdash; {t("footer.builtWith")}
        </p>
      </div>
    </footer>
  )
}
