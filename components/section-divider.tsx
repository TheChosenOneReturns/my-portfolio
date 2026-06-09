export function SectionDivider() {
  return (
    <div className="pointer-events-none relative mx-auto h-px w-[min(72rem,calc(100%-2rem))] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,var(--spectral-blue),var(--spectral-cyan),var(--spectral-magenta),var(--accretion-orange),transparent)] opacity-70" />
      <div className="absolute inset-x-1/4 -top-3 h-6 bg-[radial-gradient(ellipse_at_center,var(--spectral-cyan),transparent_65%)] opacity-20 blur-xl" />
    </div>
  )
}

