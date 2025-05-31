/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true
    },
    // Ensure API routes work correctly on Netlify
    trailingSlash: false
}

module.exports = nextConfig