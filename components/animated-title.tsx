"use client"

import { useEffect, useState, useCallback } from 'react'

interface AnimatedTitleProps {
    baseTitle?: string
    emojis?: string[]
    typingEffect?: boolean
    rotatingTexts?: string[]
    interval?: number
}

export function AnimatedTitle({
    baseTitle = "DEV & AI",
    emojis = ["⚡", "🚀", "💻", "🤖", "✨", "🔥"],
    typingEffect = false,
    rotatingTexts,
    interval = 2000
}: AnimatedTitleProps) {
    const [currentEmoji, setCurrentEmoji] = useState(0)
    const [currentText, setCurrentText] = useState(0)
    const [displayedTitle, setDisplayedTitle] = useState(baseTitle)
    const [isTyping, setIsTyping] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    // Track page visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden)
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    // Emoji rotation effect
    useEffect(() => {
        if (!emojis || emojis.length === 0) return

        const timer = setInterval(() => {
            setCurrentEmoji(prev => (prev + 1) % emojis.length)
        }, interval)

        return () => clearInterval(timer)
    }, [emojis, interval])

    // Rotating texts effect
    useEffect(() => {
        if (!rotatingTexts || rotatingTexts.length === 0) return

        const timer = setInterval(() => {
            setCurrentText(prev => (prev + 1) % rotatingTexts.length)
        }, interval * 2)

        return () => clearInterval(timer)
    }, [rotatingTexts, interval])

    // Typing effect
    useEffect(() => {
        if (!typingEffect) return

        const fullTitle = rotatingTexts ? rotatingTexts[currentText] : baseTitle
        let charIndex = 0
        setIsTyping(true)
        setDisplayedTitle('')

        const typeTimer = setInterval(() => {
            if (charIndex <= fullTitle.length) {
                setDisplayedTitle(fullTitle.slice(0, charIndex))
                charIndex++
            } else {
                clearInterval(typeTimer)
                setIsTyping(false)
            }
        }, 100)

        return () => clearInterval(typeTimer)
    }, [typingEffect, currentText, rotatingTexts, baseTitle])

    // Update document title
    useEffect(() => {
        const emoji = emojis[currentEmoji]

        if (!isVisible) {
            // When tab is not visible, show attention-grabbing message
            document.title = `👋 ¡Vuelve! | ${baseTitle}`
            return
        }

        if (typingEffect) {
            document.title = `${emoji} ${displayedTitle}${isTyping ? '|' : ''}`
        } else if (rotatingTexts && rotatingTexts.length > 0) {
            document.title = `${emoji} ${rotatingTexts[currentText]}`
        } else {
            document.title = `${emoji} ${baseTitle}`
        }
    }, [currentEmoji, currentText, displayedTitle, isTyping, isVisible, emojis, rotatingTexts, baseTitle, typingEffect])

    // This component doesn't render anything visible
    return null
}

// Alternative: Simple hook version
export function useAnimatedTitle(options: AnimatedTitleProps = {}) {
    const {
        baseTitle = "DEV & AI | Ariel Balmaceda",
        emojis = ["⚡", "🚀", "💻", "🤖", "✨"],
        interval = 2500
    } = options

    const [emojiIndex, setEmojiIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setEmojiIndex(prev => (prev + 1) % emojis.length)
        }, interval)

        return () => clearInterval(timer)
    }, [emojis.length, interval])

    useEffect(() => {
        document.title = `${emojis[emojiIndex]} ${baseTitle}`
    }, [emojiIndex, emojis, baseTitle])
}
