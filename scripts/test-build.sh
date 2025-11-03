#!/bin/bash

# Cloudflare Pages用ビルドテストスクリプト
# 使用方法: ./scripts/test-build.sh

echo "🧪 Cloudflare Pages用ビルドテストを開始します..."
echo ""

# 1. Node.jsバージョンを確認
echo "📌 Node.jsバージョンを確認中..."
NODE_VERSION=$(node --version)
echo "現在のNode.jsバージョン: $NODE_VERSION"
echo ""

# 2. .tool-versionsファイルを確認
if [ -f ".tool-versions" ]; then
  echo "📄 .tool-versionsファイルを確認中..."
  cat .tool-versions
  echo ""
else
  echo "⚠️  .tool-versionsファイルが見つかりません"
  echo ""
fi

# 3. wranglerでビルドテストを実行
echo "🔨 wranglerでビルドテストを実行中..."
echo "ビルドコマンド: npm run build"
echo ""

# 環境変数を設定（Cloudflare Pagesと同等の環境を再現）
export NODE_ENV=production

# ビルドを実行
if npm run build; then
  echo ""
  echo "✅ ビルドテスト成功！"
  echo "📊 ビルド結果:"
  echo "  - out/ ディレクトリが生成されました"
  
  # outディレクトリのサイズを確認
  if [ -d "out" ]; then
    OUT_SIZE=$(du -sh out | cut -f1)
    FILE_COUNT=$(find out -type f | wc -l)
    echo "  - 出力サイズ: $OUT_SIZE"
    echo "  - ファイル数: $FILE_COUNT"
  fi
  
  echo ""
  echo "🚀 これでCloudflare Pagesにデプロイ可能です"
  exit 0
else
  echo ""
  echo "❌ ビルドテスト失敗"
  echo "⚠️  Cloudflare Pagesへのデプロイは行わないでください"
  exit 1
fi

