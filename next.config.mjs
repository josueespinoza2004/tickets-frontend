/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/tickets',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
