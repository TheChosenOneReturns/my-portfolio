"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { retroSound } from './sounds'

interface SoundContextType {
    soundEnabled: boolean
    toggleSound: () => void
    playClick: () => void
    playHover: () => void
    playWhoosh: () => void
    playToggle: (isOn: boolean) => void
    playSuccess: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: ReactNode }) {
    const [soundEnabled, setSoundEnabled] = useState(true)

    // Load preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('portfolioSound')
        if (saved !== null) {
            const enabled = saved === 'true'
            setSoundEnabled(enabled)
            retroSound.setEnabled(enabled)
        }
    }, [])

    const toggleSound = () => {
        const newValue = !soundEnabled
        setSoundEnabled(newValue)
        retroSound.setEnabled(newValue)
        localStorage.setItem('portfolioSound', newValue ? 'true' : 'false')
        retroSound.playToggle(newValue)
    }

    const playClick = () => retroSound.playClick()
    const playHover = () => retroSound.playHover()
    const playWhoosh = () => retroSound.playWhoosh()
    const playToggle = (isOn: boolean) => retroSound.playToggle(isOn)
    const playSuccess = () => retroSound.playSuccess()

    return (
        <SoundContext.Provider value={{
            soundEnabled,
            toggleSound,
            playClick,
            playHover,
            playWhoosh,
            playToggle,
            playSuccess
        }}>
            {children}
        </SoundContext.Provider>
    )
}

export function useSound() {
    const context = useContext(SoundContext)
    if (context === undefined) {
        // Return no-op functions if not wrapped in provider
        return {
            soundEnabled: false,
            toggleSound: () => { },
            playClick: () => { },
            playHover: () => { },
            playWhoosh: () => { },
            playToggle: () => { },
            playSuccess: () => { }
        }
    }
    return context
}
