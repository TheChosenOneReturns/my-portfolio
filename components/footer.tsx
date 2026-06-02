"use client"

import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="relative py-8 px-4 border-t border-border/30">
      <motion.div 
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="p-1.5 bg-cyan-500/20 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
            animate={{
              boxShadow: [
                "0 0 10px rgba(34, 211, 238, 0.2)",
                "0 0 20px rgba(34, 211, 238, 0.3)",
                "0 0 10px rgba(34, 211, 238, 0.2)"
              ]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity },
              scale: { duration: 0.2 }
            }}
          >
            <Bot className="w-4 h-4 text-cyan-400" />
          </motion.div>
          <span className="font-bold">
            DEV <span className="text-cyan-400">&</span>{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
          © {new Date().getFullYear()} • {t("footer.builtWith")}
        </p>
      </motion.div>
    </footer>
  )
}
