"use client"

// Retro arcade sound generator using Web Audio API
// No external files needed - all sounds synthesized

class RetroSoundGenerator {
    private audioContext: AudioContext | null = null
    private masterGain: GainNode | null = null
    private enabled: boolean = true

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            this.masterGain = this.audioContext.createGain()
            this.masterGain.connect(this.audioContext.destination)
            this.masterGain.gain.value = 0.3 // Master volume
        }
        // Resume if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume()
        }
        return this.audioContext
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled
        if (this.masterGain) {
            this.masterGain.gain.value = enabled ? 0.3 : 0
        }
    }

    isEnabled(): boolean {
        return this.enabled
    }

    // Player shooting - short laser "pew" sound
    playShoot() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(this.masterGain!)

        osc.type = 'square'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1)

        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.1)
    }

    // Enemy explosion - noise burst
    playEnemyExplosion() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const bufferSize = ctx.sampleRate * 0.15
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
        }

        const noise = ctx.createBufferSource()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        noise.buffer = buffer
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(3000, ctx.currentTime)
        filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)

        noise.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain!)

        gain.gain.setValueAtTime(0.4, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

        noise.start(ctx.currentTime)
    }

    // Boss explosion - bigger, longer explosion
    playBossExplosion() {
        if (!this.enabled) return
        const ctx = this.getContext()

        // Play multiple layered explosions
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const bufferSize = ctx.sampleRate * 0.4
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
                const data = buffer.getChannelData(0)

                for (let j = 0; j < bufferSize; j++) {
                    data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize)
                }

                const noise = ctx.createBufferSource()
                const filter = ctx.createBiquadFilter()
                const gain = ctx.createGain()

                noise.buffer = buffer
                filter.type = 'lowpass'
                filter.frequency.setValueAtTime(2000, ctx.currentTime)
                filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4)

                noise.connect(filter)
                filter.connect(gain)
                gain.connect(this.masterGain!)

                gain.gain.setValueAtTime(0.5, ctx.currentTime)
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

                noise.start(ctx.currentTime)
            }, i * 100)
        }
    }

    // Player hit - descending tone
    playPlayerHit() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(this.masterGain!)

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3)

        gain.gain.setValueAtTime(0.4, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.3)
    }

    // Power-up collect - ascending arpeggio
    playPowerUp() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const notes = [523, 659, 784, 1047] // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.connect(gain)
            gain.connect(this.masterGain!)

            osc.type = 'sine'
            osc.frequency.value = freq

            const startTime = ctx.currentTime + i * 0.06
            gain.gain.setValueAtTime(0, startTime)
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

            osc.start(startTime)
            osc.stop(startTime + 0.15)
        })
    }

    // Wave transition - epic whoosh
    playWaveTransition() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(this.masterGain!)

        osc.type = 'sine'
        osc.frequency.setValueAtTime(100, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5)
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1)

        gain.gain.setValueAtTime(0.01, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 1)
    }

    // Game over - sad descending tones
    playGameOver() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const notes = [392, 349, 330, 262] // G4, F4, E4, C4

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.connect(gain)
            gain.connect(this.masterGain!)

            osc.type = 'triangle'
            osc.frequency.value = freq

            const startTime = ctx.currentTime + i * 0.25
            gain.gain.setValueAtTime(0.4, startTime)
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

            osc.start(startTime)
            osc.stop(startTime + 0.4)
        })
    }

    // Victory - triumphant fanfare
    playVictory() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const melody = [
            { freq: 523, duration: 0.15 }, // C5
            { freq: 659, duration: 0.15 }, // E5
            { freq: 784, duration: 0.15 }, // G5
            { freq: 1047, duration: 0.3 }, // C6
            { freq: 784, duration: 0.15 }, // G5
            { freq: 1047, duration: 0.5 }, // C6
        ]

        let time = ctx.currentTime
        melody.forEach(note => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.connect(gain)
            gain.connect(this.masterGain!)

            osc.type = 'square'
            osc.frequency.value = note.freq

            gain.gain.setValueAtTime(0.25, time)
            gain.gain.setValueAtTime(0.25, time + note.duration * 0.8)
            gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration)

            osc.start(time)
            osc.stop(time + note.duration)

            time += note.duration
        })
    }

    // UI Click - Sci-fi interface blip with FM synthesis
    playClick() {
        if (!this.enabled) return
        const ctx = this.getContext()

        // Carrier oscillator
        const carrier = ctx.createOscillator()
        const carrierGain = ctx.createGain()

        // Modulator for FM synthesis
        const modulator = ctx.createOscillator()
        const modGain = ctx.createGain()

        // FM synthesis routing
        modulator.connect(modGain)
        modGain.connect(carrier.frequency)
        carrier.connect(carrierGain)
        carrierGain.connect(this.masterGain!)

        // Sci-fi blip settings
        carrier.type = 'sine'
        carrier.frequency.setValueAtTime(2400, ctx.currentTime)
        carrier.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06)

        modulator.type = 'sine'
        modulator.frequency.setValueAtTime(40, ctx.currentTime)
        modGain.gain.setValueAtTime(200, ctx.currentTime)
        modGain.gain.exponentialRampToValueAtTime(10, ctx.currentTime + 0.06)

        carrierGain.gain.setValueAtTime(0.15, ctx.currentTime)
        carrierGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

        carrier.start(ctx.currentTime)
        modulator.start(ctx.currentTime)
        carrier.stop(ctx.currentTime + 0.08)
        modulator.stop(ctx.currentTime + 0.08)

        // High-frequency shimmer
        const shimmer = ctx.createOscillator()
        const shimmerGain = ctx.createGain()
        shimmer.connect(shimmerGain)
        shimmerGain.connect(this.masterGain!)
        shimmer.type = 'sine'
        shimmer.frequency.value = 4800
        shimmerGain.gain.setValueAtTime(0.03, ctx.currentTime)
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
        shimmer.start(ctx.currentTime)
        shimmer.stop(ctx.currentTime + 0.04)
    }

    // UI Hover - Futuristic scanner sweep
    playHover() {
        if (!this.enabled) return
        const ctx = this.getContext()

        // Main sweep tone
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain!)

        // Resonant filter sweep
        filter.type = 'bandpass'
        filter.Q.value = 8
        filter.frequency.setValueAtTime(400, ctx.currentTime)
        filter.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.05)

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(150, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05)

        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.07)

        // Sub-bass thump
        const sub = ctx.createOscillator()
        const subGain = ctx.createGain()
        sub.connect(subGain)
        subGain.connect(this.masterGain!)
        sub.type = 'sine'
        sub.frequency.setValueAtTime(80, ctx.currentTime)
        sub.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04)
        subGain.gain.setValueAtTime(0.06, ctx.currentTime)
        subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
        sub.start(ctx.currentTime)
        sub.stop(ctx.currentTime + 0.05)
    }

    // Navigation whoosh - Warp drive transition
    playWhoosh() {
        if (!this.enabled) return
        const ctx = this.getContext()

        // Noise swoosh
        const bufferSize = ctx.sampleRate * 0.2
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize
            data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * Math.pow(1 - t, 0.5)
        }

        const noise = ctx.createBufferSource()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        noise.buffer = buffer
        filter.type = 'bandpass'
        filter.Q.value = 3
        filter.frequency.setValueAtTime(500, ctx.currentTime)
        filter.frequency.exponentialRampToValueAtTime(6000, ctx.currentTime + 0.1)
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2)

        noise.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain!)

        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

        noise.start(ctx.currentTime)

        // Doppler tone
        const doppler = ctx.createOscillator()
        const dopplerGain = ctx.createGain()
        doppler.connect(dopplerGain)
        dopplerGain.connect(this.masterGain!)
        doppler.type = 'sine'
        doppler.frequency.setValueAtTime(200, ctx.currentTime)
        doppler.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08)
        doppler.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.18)
        dopplerGain.gain.setValueAtTime(0.08, ctx.currentTime)
        dopplerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
        doppler.start(ctx.currentTime)
        doppler.stop(ctx.currentTime + 0.18)
    }

    // Toggle sound - Power up/down with sci-fi energy
    playToggle(isOn: boolean) {
        if (!this.enabled) return
        const ctx = this.getContext()

        // Main toggle tone
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.masterGain!)

        filter.type = 'lowpass'
        filter.frequency.value = 4000

        osc.type = 'sawtooth'
        if (isOn) {
            // Power up - ascending with resonance
            osc.frequency.setValueAtTime(200, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12)
            filter.frequency.setValueAtTime(800, ctx.currentTime)
            filter.frequency.exponentialRampToValueAtTime(5000, ctx.currentTime + 0.12)
        } else {
            // Power down - descending
            osc.frequency.setValueAtTime(1200, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15)
            filter.frequency.setValueAtTime(5000, ctx.currentTime)
            filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15)
        }

        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isOn ? 0.12 : 0.15))

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + (isOn ? 0.12 : 0.15))

        // Electrical crackle
        const crackleSize = ctx.sampleRate * 0.08
        const crackleBuffer = ctx.createBuffer(1, crackleSize, ctx.sampleRate)
        const crackleData = crackleBuffer.getChannelData(0)
        for (let i = 0; i < crackleSize; i++) {
            crackleData[i] = (Math.random() > 0.9 ? Math.random() * 2 - 1 : 0) * (1 - i / crackleSize)
        }
        const crackle = ctx.createBufferSource()
        const crackleGain = ctx.createGain()
        crackle.buffer = crackleBuffer
        crackle.connect(crackleGain)
        crackleGain.connect(this.masterGain!)
        crackleGain.gain.setValueAtTime(0.08, ctx.currentTime)
        crackle.start(ctx.currentTime)
    }

    // Success chime - Holographic confirmation
    playSuccess() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const notes = [880, 1100, 1320, 1760] // A5, ~C#6, E6, A6 (major with shimmer)

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const filter = ctx.createBiquadFilter()

            osc.connect(filter)
            filter.connect(gain)
            gain.connect(this.masterGain!)

            filter.type = 'lowpass'
            filter.frequency.value = 6000
            filter.Q.value = 1

            osc.type = 'triangle'
            osc.frequency.value = freq

            const startTime = ctx.currentTime + i * 0.07
            gain.gain.setValueAtTime(0, startTime)
            gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02)
            gain.gain.setValueAtTime(0.12, startTime + 0.08)
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25)

            osc.start(startTime)
            osc.stop(startTime + 0.25)

            // Shimmer harmonic
            const shimmer = ctx.createOscillator()
            const shimmerGain = ctx.createGain()
            shimmer.connect(shimmerGain)
            shimmerGain.connect(this.masterGain!)
            shimmer.type = 'sine'
            shimmer.frequency.value = freq * 2
            shimmerGain.gain.setValueAtTime(0, startTime)
            shimmerGain.gain.linearRampToValueAtTime(0.03, startTime + 0.02)
            shimmerGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
            shimmer.start(startTime)
            shimmer.stop(startTime + 0.15)
        })
    }

    // Enemy shoot - lower pitch than player
    playEnemyShoot() {
        if (!this.enabled) return
        const ctx = this.getContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(this.masterGain!)

        osc.type = 'square'
        osc.frequency.setValueAtTime(220, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.08)

        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.08)
    }

    // Shield break sound
    playShieldBreak() {
        if (!this.enabled) return
        const ctx = this.getContext()

        // Glass break effect
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(this.masterGain!)

        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(2000, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2)

        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
    }
}

// Singleton instance
export const retroSound = new RetroSoundGenerator()
