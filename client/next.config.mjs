/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure domains if user needs to display uploaded user files/images
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file is a module.
