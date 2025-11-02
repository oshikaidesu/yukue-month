# Cloudflare Workers エンドポイント設定

## 概要

`/importer`ページでマイリスト取得を行うには、Cloudflare Workersのエンドポイントが必要です。

## エンドポイントの確認方法

### 方法1: Cloudflareダッシュボードから確認

1. [Cloudflareダッシュボード](https://dash.cloudflare.com)にログイン
2. **Workers & Pages** → **nicovideo-ogp** を選択
3. **設定** → **カスタムドメイン** またはデプロイ情報からエンドポイントを確認
4. 通常の形式: `https://nicovideo-ogp.YOUR-SUBDOMAIN.workers.dev`

### 方法2: Wranglerで確認

```bash
cd workers
npx wrangler deployments list
```

最新のデプロイ情報からURLを確認できます。

### 方法3: スクリプトで確認（試行）

```bash
node scripts/get-worker-url.mjs
```

## 環境変数の設定

`.env.local`ファイルに以下を追加:

```env
NEXT_PUBLIC_WORKER_URL=https://nicovideo-ogp.YOUR-SUBDOMAIN.workers.dev
```

**重要**: `NEXT_PUBLIC_`プレフィックスが必要です（クライアント側からアクセス可能にするため）。

## Workersのデプロイ

### 初回デプロイ

```bash
cd workers
npx wrangler deploy
```

デプロイが完了すると、エンドポイントURLが表示されます:

```
 ✨  Deployed nicovideo-ogp
   https://nicovideo-ogp.YOUR-ACCOUNT.workers.dev
```

このURLを`.env.local`に設定してください。

### デプロイ確認

```bash
cd workers
npx wrangler deployments list
```

### アカウント情報の確認

現在のアカウント情報:

```bash
cd workers
npx wrangler whoami
```

**Account ID**: `09ea9996e2032911d59d2a89b10e0778`

Workersのエンドポイントは通常、以下の形式です:
- `https://nicovideo-ogp.{account-subdomain}.workers.dev`
- またはカスタムドメインが設定されている場合はそのURL

## トラブルシューティング

### エンドポイントが見つからない場合

1. Workersがデプロイされているか確認
2. Cloudflareダッシュボードで確認
3. カスタムドメインが設定されている場合は、そのURLを使用

### 認証エラーの場合

```bash
npx wrangler login
```

で再ログインしてください。

