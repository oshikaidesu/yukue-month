# Webhook経由ビルドのNode.jsバージョン問題 最終解決策

## 問題

Webhook経由でビルドをトリガーすると、Node.js 18.17.0が使われてビルドが失敗する。

## 原因

Cloudflare PagesのWebhook経由のビルドでは、環境変数`NODE_VERSION`が正しく適用されない可能性があります。

## 解決策：ビルドコマンドを変更（必須）

### 手順

1. [Cloudflareダッシュボード](https://dash.cloudflare.com)にログイン
2. **Workers & Pages** → **yukue-month** プロジェクトを選択
3. **設定** → **ビルドとデプロイ** を開く
4. **ビルドコマンド**フィールドを確認
5. 現在の設定（おそらく `npm run build` または `pnpm build`）を以下に変更：

### オプション1: 環境変数をコマンドで指定（推奨）

```
NODE_VERSION=20 npm run build
```

### オプション2: npxでNode.js 20を使用

```
npx -p node@20 npm run build
```

### オプション3: 完全なパス指定

```
/usr/local/bin/node20 npm run build
```
（ただし、Cloudflare Pagesの環境によっては使えない可能性があります）

6. **保存** をクリック

## 確認方法

1. microCMSでコンテンツを更新してWebhookを送信
2. Cloudflare Pagesダッシュボード → **「デプロイ」**タブで新しいビルドを確認
3. ビルドログで以下を確認：

**成功例**:
```
v20.x.x
```

**失敗例**:
```
v18.17.0
You are using Node.js 18.17.0...
```

## 追加の確認事項

### package.jsonのbuildスクリプト

現在、`build`スクリプトは以下のように設定されています：

```json
"build": "node -e \"if(process.version < 'v20.0.0') { console.error('❌ Node.js 20以上が必要です。現在: ' + process.version); process.exit(1); }\" && npm run optimize-thumbnails && next build"
```

これにより、Node.js 20未満の場合にビルドが失敗します。

### ビルドログの確認ポイント

ビルドログの最初の部分で以下を確認：

1. Node.jsのバージョン表示（`node --version`の出力）
2. エラーメッセージ（`❌ Node.js 20以上が必要です。現在: v18.17.0`など）

## それでも解決しない場合

1. **ビルドコマンドが正しく保存されているか再確認**
2. **新しいビルドを手動でトリガー**（環境変数の変更だけでは反映されない）
3. **Cloudflare Pagesのサポートに問い合わせ**:
   - Webhook経由のビルドでNode.jsバージョンが指定できない問題について

