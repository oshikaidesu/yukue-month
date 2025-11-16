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

# 3. ビルドテストを実行
echo "🧪 ビルドテストを実行中..."
if ! ./scripts/test-build.sh; then
  echo "❌ ビルドテストが失敗しました。デプロイを中止します。"
  exit 1
fi

# 4. Cloudflare Pagesにデプロイ
echo "☁️ Cloudflare Pagesにデプロイ中..."
# wranglerの現在ログイン中アカウントIDを検出して使用
WHOAMI_OUTPUT=$(npx wrangler whoami 2>&1 || true)
# 32桁の16進を候補として抽出し、最後の1つを採用
ACCOUNT_ID=$(echo "$WHOAMI_OUTPUT" | grep -Eo '[a-f0-9]{32}' | tail -n 1)
if [ -n "$ACCOUNT_ID" ]; then
  echo "🔑 使用するAccount ID: $ACCOUNT_ID"
  DEPLOY_OUTPUT=$(CF_ACCOUNT_ID="$ACCOUNT_ID" CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" npx wrangler pages deploy out --project-name=yukue-month --commit-dirty=true)
else
  echo "⚠️  Account IDの自動取得に失敗。既定設定でデプロイを試みます。"
  DEPLOY_OUTPUT=$(npx wrangler pages deploy out --project-name=yukue-month --commit-dirty=true)
fi

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
