/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.hostingersite.com' },
      { protocol: 'https', hostname: 'shreejeeblessingwood.in' },
      { protocol: 'https', hostname: 'www.shreejeeblessingwood.in' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['react-icons/fi', 'react-icons/fa', 'react-icons/io5'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  async headers() {
    return [
      {
        source: '/_next/static/css/:path*',
        headers: [
          { key: 'Content-Type', value: 'text/css; charset=utf-8' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      },
    ]
  },
}

module.exports = nextConfig
