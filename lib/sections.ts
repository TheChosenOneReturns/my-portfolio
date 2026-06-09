export const portfolioSections = [
  { id: "inicio", labelKey: "nav.inicio" },
  { id: "sobre-mi-intro", labelKey: "nav.manifiesto" },
  { id: "proyectos", labelKey: "nav.proyectos" },
  { id: "stack", labelKey: "nav.stack" },
  { id: "sobre-mi", labelKey: "nav.trayectoria" },
  { id: "contacto", labelKey: "nav.contactar" },
] as const

export type PortfolioSectionId = (typeof portfolioSections)[number]["id"]
