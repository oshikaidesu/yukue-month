#!/bin/bash

# Cloudflare Pages デプロイスクリプト
# 使用方法: ./deploy.sh

echo "🚀 Cloudflare Pages デプロイを開始します..."

# 1. 変更をコミット
echo "📝 変更をコミット中..."
git add .
git commit -m "自動デプロイ: $(date '+%Y-%m-%d %H:%M:%S')"

# 2. リモートにプッシュ
echo "📤 リモートにプッシュ中..."
git push origin main

# 3. Next.jsで静的ビルド
echo "🔨 Next.jsで静的ビルド中..."
npm run build

# 4. Cloudflare Pagesにデプロイ
echo "☁️ Cloudflare Pagesにデプロイ中..."
npx wrangler pages deploy dist --project-name=yukue-month --commit-dirty=true

echo "✅ デプロイ完了！"
echo "🌐 URL: https://aec165ca.yukue-month-exy.pages.dev"
