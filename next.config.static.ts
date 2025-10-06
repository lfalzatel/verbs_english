import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Handle static assets properly - Export estático para Netlify
  output: 'export',
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Handle images and static files
  images: {
    unoptimized: true,
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Excluir rutas API de la exportación estática
  trailingSlash: true,
  // Deshabilitar generación de API routes
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;