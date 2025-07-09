# Yukue Video Portfolio

動画リンクを埋め込めるポートフォリオサイトです。YouTube、Vimeo、その他の動画プラットフォームに対応し、カテゴリ別に動画を整理できます。

## 機能

- 🎥 **動画埋め込み**: YouTube、Vimeo、その他の動画プラットフォームに対応
- 📱 **レスポンシブデザイン**: あらゆるデバイスで美しく表示
- 🔍 **カテゴリ分け**: 動画をカテゴリ別に整理・フィルタリング
- ⚡ **モーダル再生**: クリックで動画をモーダルで再生
- 🛠️ **管理画面**: 動画の追加・編集・削除が可能
- 🌙 **ダークモード**: テーマ切り替え機能

## 技術スタック

- **Next.js 15**: React フレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **DaisyUI**: UI コンポーネントライブラリ

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 使用方法

### 動画の追加・編集

1. 管理画面（`/admin`）にアクセス
2. 「動画を追加」ボタンをクリック
3. 動画の情報を入力:
   - タイトル
   - 説明
   - URL（YouTube、Vimeo、その他）
   - プラットフォーム
   - カテゴリ（任意）

### 動画データの管理

動画データは `src/data/videos.ts` で管理されています。このファイルを編集することで、動画の追加・削除・更新が可能です。

```typescript
export const videos: VideoItem[] = [
  {
    id: '1',
    title: '動画タイトル',
    description: '動画の説明',
    url: 'https://www.youtube.com/watch?v=VIDEO_ID',
    platform: 'youtube',
    category: 'プログラミング',
    dateAdded: '2024-01-15'
  }
];
```

### カスタマイズ

- **ロゴ**: `public/logo.svg` を置き換えてロゴを変更
- **テーマ**: `tailwind.config.js` でDaisyUIテーマを変更
- **スタイル**: `src/app/globals.css` でカスタムスタイルを追加

## ディレクトリ構造

```
src/
├── app/
│   ├── admin/          # 管理画面
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # レイアウト
│   └── page.tsx        # メインページ
├── components/
│   ├── ThemeToggle.tsx # テーマ切り替え
│   ├── VideoManager.tsx # 動画管理
│   └── VideoPortfolio.tsx # 動画ポートフォリオ
└── data/
    └── videos.ts       # 動画データ
```

## デプロイ

このプロジェクトは [Vercel](https://vercel.com/) に簡単にデプロイできます。

1. GitHubにリポジトリをプッシュ
2. Vercelでプロジェクトをインポート
3. 自動デプロイが開始されます

## ライセンス

MIT License
