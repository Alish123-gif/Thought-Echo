/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ik.imagekit.io'],
    },
    experimental: {
        appDir: true,
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            'react-quill/dist/quill.snow.css': require.resolve('react-quill/dist/quill.snow.css'),
        };
        return config;
    },
};

module.exports = nextConfig;
