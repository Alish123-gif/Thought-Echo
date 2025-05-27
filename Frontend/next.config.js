/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        unoptimized: true
    }
    // Removed output: 'export', trailingSlash, and distDir to enable NextAuth API routes
}

module.exports = nextConfig