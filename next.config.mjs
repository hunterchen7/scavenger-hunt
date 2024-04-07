/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'magenta-peaceful-sole-762.mypinata.cloud',
                port: '',
            }
        ],
    },
};

export default nextConfig;
