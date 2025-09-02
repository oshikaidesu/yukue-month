import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Cloudflare Pages用の設定
  output: 'export', // 静的エクスポートを有効化
  trailingSlash: false,
  
  // Next.js 15での最適化設定
  experimental: {
    // 本番ビルドで console を除去（error/warn は維持）
    optimizePackageImports: [],
    // 静的生成の最適化
    optimizeCss: true,
    // バンドル分析の有効化（開発時のみ）
    bundlePagesRouterDependencies: true,
  },
  
  compiler: {
    // React 19 + Next 15: 本番 minify 時に console を除去
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },
  
  // Cloudflare Pagesでの最適化
  swcMinify: true,
  compress: true,
  images: {
    unoptimized: true,
    domains: [
      "img.cdn.nimg.jp",
      "nicovideo.cdn.nimg.jp",
      "tn.smilevideo.jp", // ← 追加
      "img.youtube.com", // YouTube サムネイル用
      "i.ytimg.com", // YouTube サムネイル用（別ドメイン）
      // 必要に応じて他のドメインも追加
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'img.cdn.nimg.jp',
        port: '',
        pathname: '/s/nicovideo/thumbnails/**',
      },
      {
        protocol: 'https',
        hostname: 'nicovideo.cdn.nimg.jp',
        port: '',
        pathname: '/thumbnails/**',
      },
      {
        protocol: 'https',
        hostname: 'tn.smilevideo.jp',
        port: '',
        pathname: '/smile**',
      },
    ],
  },
};

export default nextConfig;
