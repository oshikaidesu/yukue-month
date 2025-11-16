# Lighthouse CI テストガイド

このプロジェクトでは、Lighthouse CIを使用してパフォーマンス、アクセシビリティ、SEO、ベストプラクティスの自動テストを実行できます。

## 🚀 使用方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Lighthouse CIテストの実行

```bash
npm run lighthouse
```

このコマンドは以下を自動実行します：
- 静的サイトのビルド（必要に応じて）
- ローカルサーバーの起動
- Lighthouse CIテストの実行
- サーバーの停止

### 3. テスト結果の確認

```bash
npm run lighthouse:report
```

### 4. 手動でのLighthouse CI実行

```bash
npm run lighthouse:ci
```

## 📊 テスト対象

- **ホームページ**: `http://localhost:3000`
- **アーカイブページ**: `http://localhost:3000/archive`
- **コンセプトページ**: `http://localhost:3000/concept`

## 🎯 パフォーマンス基準

### スコア基準（警告レベル）
- **パフォーマンス**: 70点以上
- **アクセシビリティ**: 90点以上（エラーレベル）
- **ベストプラクティス**: 80点以上
- **SEO**: 80点以上

### メトリクス基準
- **First Contentful Paint**: 2.5秒以下
- **Largest Contentful Paint**: 5秒以下
- **Cumulative Layout Shift**: 0.15以下
- **Total Blocking Time**: 400ms以下
- **Speed Index**: 3.5秒以下

## 📁 レポート出力

テスト結果は `./lighthouse-reports/` ディレクトリに保存されます：
- HTMLレポート（ブラウザで開いて詳細確認可能）
- JSONデータ（プログラムでの解析用）
- マニフェストファイル（テスト実行情報）

## 🔧 設定のカスタマイズ

`lighthouserc.js` ファイルで以下をカスタマイズできます：
- テスト対象URL
- パフォーマンス基準
- テスト回数
- レポート出力設定

## 💡 トラブルシューティング

### Chromeが見つからない場合
```bash
# macOS
brew install --cask google-chrome

# Ubuntu
sudo apt-get install google-chrome-stable
```

### ポート3000が使用中の場合
`scripts/lighthouse-test.js` のポート番号を変更してください。

### メモリ不足の場合
`lighthouserc.js` の `chromeFlags` に `--max_old_space_size=4096` を追加してください。






