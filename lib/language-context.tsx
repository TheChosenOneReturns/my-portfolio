"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "@/lib/translations"

type Language = "es" | "en"

interface LanguageContextType {
    language: Language
    toggleLanguage: () => void
    t: (key: string) => string
    isHydrated: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("es")
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        // Only access localStorage after hydration on the client
        const savedLanguage = localStorage.getItem("language") as Language | null
        if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
            setLanguage(savedLanguage)
        }
        setIsHydrated(true)
    }, [])

    const toggleLanguage = () => {
        const newLanguage = language === "es" ? "en" : "es"
        setLanguage(newLanguage)
        localStorage.setItem("language", newLanguage)
    }

    const t = (key: string): string => {
        return translations[language]?.[key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, isHydrated }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
