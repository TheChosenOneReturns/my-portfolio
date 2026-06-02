"use client"

import { useState, useCallback } from "react"
import { LanguageProvider } from "@/lib/language-context"
import { SpaceInvaders } from "@/components/space-invaders"
import { useKonamiCode } from "@/hooks/use-konami-code"

function GameWrapper({ children }: { children: React.ReactNode }) {
    const [showGame, setShowGame] = useState(false)

    // Sequence: ↑ ↑ I A
    useKonamiCode(
        ["ArrowUp", "ArrowUp", "i", "a"],
        useCallback(() => {
            setShowGame(true)
        }, [])
    )

    return (
        <>
            {children}
            {showGame && <SpaceInvaders onClose={() => setShowGame(false)} />}
        </>
    )
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <GameWrapper>{children}</GameWrapper>
        </LanguageProvider>
    )
}
