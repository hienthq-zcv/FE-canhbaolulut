import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',             // Port của Backend Python
        pathname: '/uploads/**',  // Cho phép truy cập thư mục uploads
      },
      {
        protocol: 'https',
        hostname: 'be-canhbaolulut.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;