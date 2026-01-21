/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@tinted-theming/core', '@tinted-theming/react'],
    async rewrites() {
        return [
            {
                source: '/vite_reactjs/:path*',
                destination: 'http://localhost:5173/vite_reactjs/:path*',
            },
            {
                source: '/vanilla-js/:path*',
                destination: 'http://localhost:5174/vanilla-js/:path*',
            },
            {
                source: '/vanilla-ts/:path*',
                destination: 'http://localhost:5175/vanilla-ts/:path*',
            },
            {
                source: '/remix/:path*',
                destination: 'http://localhost:5176/remix/:path*',
            },
        ]
    },
    trailingSlash: true,
}

export default nextConfig
