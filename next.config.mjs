/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'tickets',
  trailingSlash: true,
  assetPrefix: '.',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
