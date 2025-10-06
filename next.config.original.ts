import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
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
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    
    // Handle database file in production
    if (!dev && !isServer) {
      // Exclude database from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3',
        'prisma': 'commonjs prisma',
        '@prisma/client': 'commonjs @prisma/client'
      });
    }
    
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Server external packages for better production handling
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
