/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        "@prisma/client",
        "@prisma/client-runtime-utils",
        "@prisma/adapter-pg"
    ]
};

export default nextConfig;
