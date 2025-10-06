import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  
  // Importante: NO usar 'standalone' para Vercel
  // Vercel maneja el deployment automáticamente
  
  images: {
    unoptimized: true,
  },
  
  // Prisma necesita estar en serverExternalPackages
  serverExternalPackages: ['@prisma/client', 'prisma'],
  
  // Variables de entorno
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;