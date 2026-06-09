# Ariel Balmaceda Portfolio

Portfolio personal construido con Next.js, React, Tailwind CSS, Framer Motion, Lenis y React Three Fiber. La experiencia combina una narrativa profesional con un fondo WebGL sci-fi, paleta cromática iridiscente, navegación por secciones, soporte ES/EN y un juego oculto.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run build:github
```

## Desarrollo

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000` para trabajar localmente. El build local usa rutas normales; el build de GitHub Pages agrega el prefijo `/my-portfolio`.

## Deploy en GitHub Pages

Para generar el sitio estático con el `basePath` correcto:

```bash
npm run build:github
```

El resultado queda en `out/`, listo para publicarse en GitHub Pages para el repositorio `TheChosenOneReturns/my-portfolio`.

También hay un workflow en `.github/workflows/deploy-pages.yml` que publica automáticamente en GitHub Pages al hacer push a `main`. La URL pública esperada es:

```text
https://thechosenonereturns.github.io/my-portfolio/
```

Si más adelante se usa un dominio propio, quitá la variable `GITHUB_PAGES=true` del build de producción o ajustá `next.config.mjs`.

## Cómo funciona el agujero negro

El fondo vive en `components/webgl-background.tsx` y usa React Three Fiber para montar un `Canvas` fijo detrás del contenido. La pieza central es un plano 2D con un shader propio: en vez de modelar geometría compleja, cada pixel se calcula desde sus coordenadas UV.

El shader transforma las UV para ubicar el centro del agujero negro, corregir el aspecto de pantalla y simular un disco de acreción inclinado. La distancia al centro define el horizonte oscuro, el photon ring brillante y las bandas del disco. Para que no parezca una textura plana, se agregan ruido procedural, turbulencia temporal y una curva de color tipo prisma con blanco caliente, naranja, cyan, azul, magenta y violeta.

La niebla viene de capas radiales suaves mezcladas con ruido. Eso crea profundidad hacia los bordes y evita que el canvas se vea como un rectángulo pegado al fondo. Los streaks cromáticos son líneas diagonales generadas dentro del shader; aparecen con baja intensidad alrededor del disco para dar ese efecto sci-fi/anime sin usar imágenes externas.

Las estrellas y partículas se generan de forma determinística con posiciones pseudoaleatorias estables. En desktop hay más densidad y bloom; en mobile se baja el DPR y la cantidad visual para cuidar rendimiento. Si el usuario activa `prefers-reduced-motion`, el Canvas no corre animación pesada y se muestra un fallback estático con glow y fog.

Para modificarlo, buscá estas ideas dentro del shader:

- `center`: mueve el agujero negro en pantalla.
- `diskUv.y *= ...`: controla qué tan inclinado se ve el disco.
- `temperature(...)` y `prism(...)`: cambian la paleta.
- `ring`, `disk`, `photon`: ajustan grosor e intensidad.
- `fog` y `chromaStreaks`: controlan atmósfera y fragmentos iridiscentes.
