import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SoundProvider } from "@/lib/sound-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DEV & AI | Full Stack, IA & Automatización",
  description:
    "Portfolio de desarrollador especializado en Full Stack, Inteligencia Artificial y Automatización con n8n",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <SoundProvider>
          {children}
        </SoundProvider>
      </body>
    </html>
  )
}
