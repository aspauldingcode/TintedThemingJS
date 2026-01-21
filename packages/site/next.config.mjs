/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@tinted-theming/core', '@tinted-theming/react'],
    basePath: '/nextjs',
    async rewrites() {
        return [
            {
                source: '/vite_reactjs/:path*',
                destination: 'http://localhost:5173/vite_reactjs/:path*',
                basePath: false,
            },
            {
                source: '/vanilla-js/:path*',
                destination: 'http://localhost:5174/vanilla-js/:path*',
                basePath: false,
            },
            {
                source: '/vanilla-ts/:path*',
                destination: 'http://localhost:5175/vanilla-ts/:path*',
                basePath: false,
            },
            {
                source: '/remix/:path*',
                destination: 'http://localhost:5176/remix/:path*',
                basePath: false,
            },
        ]
    },
    trailingSlash: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/nextjs',
                basePath: false,
                permanent: false,
            },
        ]
    },
}

export default nextConfig
