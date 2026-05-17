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
}

module.exports = nextConfig
