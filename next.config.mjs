const nextConfig = {
  // <CHANGE> Agregar output: 'export' para GitHub Pages
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // <CHANGE> basePath para GitHub Pages (cambiar 'tu-repo' por el nombre real)
  // basePath: '/tu-repo',
  // assetPrefix: '/tu-repo/',
}

export default nextConfig
