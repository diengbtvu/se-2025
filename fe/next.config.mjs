/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },

  // Temporarily disable type checking for Docker build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
      return config;
    },
  }),
  
  // Production webpack config
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config) => {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
      return config;
    },
  }),
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig; 