const repoName = "my-portfolio"
const isGithubPages = process.env.GITHUB_PAGES === "true"

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
}

export default nextConfig
