# ゆくえレコーズ MONTHLY PICKUP PLAYLIST

リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト

## 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール
```bash
npm install
```

## 開発サーバーの起動

### Next.js開発サーバー（通常の開発用）
```bash
npm run dev
```
- http://localhost:3000 でアクセス可能

### Wrangler開発サーバー（Cloudflare Pages用）
```bash
# ビルド
npm run build:pages

# 開発サーバー起動
npm run pages:dev
```
- http://localhost:8788 でアクセス可能

## ビルド

### 通常のビルド
```bash
npm run build
```

### Cloudflare Pages用ビルド
```bash
npm run build:pages
```

## デプロイ

### Cloudflare Pagesへのデプロイ
```bash
npm run pages:deploy
```

## OGP API

### 概要
open-graph-scraperを使用して、URLからOGP（Open Graph Protocol）情報を取得するAPIです。

### エンドポイント
- `GET /api/ogp?url={URL}` - URLパラメータでOGP情報を取得
- `POST /api/ogp` - リクエストボディでOGP情報を取得
- `GET /api/ogp/nicovideo?url={URL}` - ニコニコ動画専用API
- `POST /api/ogp/nicovideo` - ニコニコ動画専用API
- `GET /api/ogp/test?url={URL}` - テスト用API（モックデータ）
- `POST /api/ogp/test` - テスト用API（モックデータ）

### レスポンス形式
```json
{
  "success": true,
  "data": {
    "title": "ページタイトル",
    "description": "ページの説明",
    "image": "サムネイル画像URL",
    "siteName": "サイト名",
    "url": "ページURL",
    "type": "コンテンツタイプ",
    "videoId": "動画ID（ニコニコ動画専用）",
    "length": "動画の長さ（ニコニコ動画専用）",
    "viewCount": "再生回数（ニコニコ動画専用）",
    "commentCount": "コメント数（ニコニコ動画専用）",
    "mylistCount": "マイリスト数（ニコニコ動画専用）"
  }
}
```

### 使用例
```javascript
// 一般OGP API
const response = await fetch('/api/ogp?url=https://example.com');
const data = await response.json();

// ニコニコ動画専用API
const response = await fetch('/api/ogp/nicovideo?url=https://www.nicovideo.jp/watch/sm12345678');
const data = await response.json();

// POSTリクエスト
const response = await fetch('/api/ogp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com' })
});
const data = await response.json();

// テスト用API（モックデータ）
const response = await fetch('/api/ogp/test?url=https://example.com');
const data = await response.json();
```

### ニコニコ動画専用APIの特徴
- ニコニコ動画の公式API（getthumbinfo）を使用
- 動画の詳細情報（タイトル、説明、再生回数、コメント数など）を取得
- 高品質なサムネイル画像を提供
- フォールバック機能付き（API失敗時は基本的なサムネイルURLを返す）

### テストページ
- http://localhost:3008/test-api - OGP APIのテストページ
  - 本番APIとテスト用APIの切り替えが可能
  - 一般OGP APIとニコニコ動画専用APIの選択が可能
  - サムネイル表示の比較テスト
  - 各種URLのテスト例

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # ホームページ
│   ├── about/          # Aboutページ
│   ├── archive/        # アーカイブページ
│   ├── test-api/       # OGP APIテストページ
│   └── api/            # APIエンドポイント
│       └── ogp/        # OGP API
├── components/         # Reactコンポーネント
├── data/              # 動画データ（JSON）
└── types/             # TypeScript型定義
```

## 技術スタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + DaisyUI
- **アニメーション**: Framer Motion
- **デプロイ**: Cloudflare Pages
- **開発サーバー**: Wrangler
- **OGP取得**: open-graph-scraper

## ライセンス

Copyright © 2025 - All rights reserved by ゆくえレコーズ.
