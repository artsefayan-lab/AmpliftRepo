/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
// force redeploy Mon Apr 20 08:31:17 PDT 2026
// rebuild Mon Apr 20 19:34:04 PDT 2026
