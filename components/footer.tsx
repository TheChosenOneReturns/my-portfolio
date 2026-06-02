"use client"

import { Bot } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-8 px-4 border-t border-border/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-pink-500/20 rounded-lg">
            <Bot className="w-4 h-4 text-pink-400" />
          </div>
          <span className="font-bold">
            DEV <span className="text-pink-400">&</span> AI
          </span>
        </div>

        <p className="text-sm text-muted-foreground" suppressHydrationWarning>© {new Date().getFullYear()} • {t("footer.builtWith")}</p>
      </div>
    </footer>
  )
}
