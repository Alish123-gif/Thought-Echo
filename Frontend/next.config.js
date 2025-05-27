/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true
    },
    // Ensure API routes work correctly on Netlify
    trailingSlash: false,
    // Output configuration for Netlify
    output: 'standalone'
}

module.exports = nextConfig