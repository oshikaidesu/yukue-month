import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "img.cdn.nimg.jp",
      "nicovideo.cdn.nimg.jp",
      "tn.smilevideo.jp", // ← 追加
      // 必要に応じて他のドメインも追加
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;
