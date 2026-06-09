import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { SoundProvider } from "@/lib/sound-context"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ariel Balmaceda - ABDEV | Full Stack, IA & Automatizacion",
  description:
    "Portfolio de Ariel Balmaceda. Especializado en inteligencia artificial aplicada, automatizacion de flujos y arquitecturas web modernas.",
  keywords: ["Ariel Balmaceda", "ABDEV", "Full Stack", "IA", "Automatizacion", "n8n", "Next.js", "MLOps"],
  authors: [{ name: "Ariel Balmaceda", url: "https://github.com/TheChosenOneReturns" }],
  openGraph: {
    title: "Ariel Balmaceda - ABDEV",
    description: "Construyo sistemas que piensan.",
    type: "website",
    locale: "es_AR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-black text-white">
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  )
}
