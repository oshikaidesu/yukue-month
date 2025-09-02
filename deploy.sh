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
DEPLOY_OUTPUT=$(npx wrangler pages deploy out --project-name=yukue-month --commit-dirty=true)

echo "✅ デプロイ完了！"

# デプロイ出力からURLを抽出
if echo "$DEPLOY_OUTPUT" | grep -q "https://.*\.yukue-month-exy\.pages\.dev"; then
  ACTUAL_URL=$(echo "$DEPLOY_OUTPUT" | grep -o "https://[a-zA-Z0-9]*\.yukue-month-exy\.pages\.dev" | head -1)
  echo "🌐 実際のデプロイ先URL: $ACTUAL_URL"
else
  echo "⚠️  デプロイ先URLの取得に失敗しました"
  echo "📋 デプロイ出力:"
  echo "$DEPLOY_OUTPUT"
fi
