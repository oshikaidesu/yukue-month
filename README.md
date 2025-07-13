# Yukue Video Portfolio

美しい動画ポートフォリオサイトです。Next.js、React、Tailwind CSSを使用して構築されています。

## 🎥 機能

- **動画埋め込み**: YouTube、Vimeo、ニコニコ動画などの動画を簡単に埋め込み
- **URL自動取得**: 動画URLから自動的にタイトル、説明、サムネイルを取得
- **カテゴリ分け**: 動画をカテゴリ別に整理
- **レスポンシブデザイン**: あらゆるデバイスで美しく表示
- **モダンなUI**: ガラス効果とグラデーションを使用した美しいデザイン

## 🚀 技術スタック

- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + DaisyUI
- **アニメーション**: Framer Motion
- **開発環境**: Turbopack

## 📦 セットアップ

### 前提条件

- Node.js 18.0.0以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/あなたのユーザー名/next-website-yukue.git
cd next-website-yukue
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定（オプション）
```bash
# .env.local ファイルを作成
cp .env.example .env.local

# 以下の環境変数を設定（YouTube Data API v3を使用する場合）
YOUTUBE_API_KEY=your_youtube_api_key_here

# Vimeo APIを使用する場合
VIMEO_ACCESS_TOKEN=your_vimeo_access_token_here
```

4. 開発サーバーを起動
```bash
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## 🔧 API設定（オプション）

### YouTube Data API v3
1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. YouTube Data API v3を有効化
3. APIキーを作成
4. `.env.local`に`YOUTUBE_API_KEY`を設定

### Vimeo API
1. [Vimeo Developer](https://developer.vimeo.com/)でアプリを作成
2. アクセストークンを取得
3. `.env.local`に`VIMEO_ACCESS_TOKEN`を設定

### ニコニコ動画
現在は組み込みのプレビューAPIを使用しており、追加設定は不要です。

## 📁 プロジェクト構造

```
next-website-yukue/
├── public/                 # 静的ファイル
│   ├── logo.svg           # ロゴファイル
│   └── placeholder-video.jpg
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # メインページ
│   │   ├── api/           # APIルート
│   │   │   └── preview/   # プレビューAPI
│   │   └── layout.tsx     # レイアウト
│   ├── components/        # Reactコンポーネント
│   │   ├── VideoCards.tsx # 動画カード表示
│   │   ├── NicovideoThumbnail.tsx
│   │   └── ...
│   └── data/              # データファイル
│       └── videos.ts      # 動画データとURL取得機能
├── tailwind.config.js     # Tailwind設定
└── package.json
```

## 🎯 主要コンポーネント

### VideoCards
動画の表示とURLからの自動取得機能を担当

### 動画データ管理
`src/data/videos.ts`で動画データを管理し、URLから自動取得機能を提供

## 🎨 カスタマイズ

### 動画の追加方法

#### 1. 手動追加
`src/data/videos.ts`を編集して動画を追加：

```typescript
export const videos: VideoItem[] = [
  {
    id: '1',
    title: '動画タイトル',
    description: '動画の説明',
    url: 'https://www.youtube.com/watch?v=...',
    platform: 'youtube',
    category: 'カテゴリ名',
    dateAdded: '2024-01-01'
  }
];
```

#### 2. URL自動取得（推奨）
サイト上で「URLから動画を追加」ボタンを使用して、動画URLを入力するだけで自動的に情報を取得

### スタイルの変更
`tailwind.config.js`でTailwind CSSの設定をカスタマイズ

### ロゴの変更
`public/logo.svg`を新しいロゴに置き換え

## 📱 レスポンシブ対応

- モバイル: 1列グリッド
- タブレット: 2列グリッド
- デスクトップ: 3列グリッド

## 🔧 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## 🌐 デプロイ

### Vercel（推奨）
1. VercelにGitHubリポジトリを接続
2. 環境変数を設定（必要に応じて）
3. 自動デプロイが有効になります

### その他のプラットフォーム
```bash
npm run build
npm run start
```

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

## 📞 お問い合わせ

ご質問やご相談がございましたら、お気軽にお問い合わせください。
