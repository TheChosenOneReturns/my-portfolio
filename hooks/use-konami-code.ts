"use client"

import { useEffect, useState, useCallback } from "react"

type Key = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | string

export function useKonamiCode(
    sequence: Key[],
    callback: () => void,
    timeout: number = 2000
) {
    const [inputSequence, setInputSequence] = useState<Key[]>([])
    const [lastKeyTime, setLastKeyTime] = useState(0)

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const now = Date.now()

            // Reset sequence if too much time has passed
            if (now - lastKeyTime > timeout) {
                setInputSequence([event.key])
            } else {
                setInputSequence((prev) => {
                    const newSequence = [...prev, event.key]

                    // Keep only the last N keys where N is the sequence length
                    if (newSequence.length > sequence.length) {
                        return newSequence.slice(-sequence.length)
                    }
                    return newSequence
                })
            }

            setLastKeyTime(now)
        },
        [lastKeyTime, timeout, sequence.length]
    )

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleKeyDown])

    useEffect(() => {
        // Check if the sequence matches
        if (inputSequence.length === sequence.length) {
            const matches = inputSequence.every(
                (key, index) => key.toLowerCase() === sequence[index].toLowerCase()
            )

            if (matches) {
                callback()
                setInputSequence([])
            }
        }
    }, [inputSequence, sequence, callback])

    return inputSequence
}
