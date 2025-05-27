/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        unoptimized: true
    },
    output: 'export',
    trailingSlash: true,
    distDir: 'out'
}

module.exports = nextConfig