# Yukue Video Portfolio

美しい動画ポートフォリオサイトです。Next.js、React、Tailwind CSSを使用して構築されています。

## 🎥 機能

- **動画埋め込み**: YouTube、Vimeoなどの動画を簡単に埋め込み
- **カテゴリ分け**: 動画をカテゴリ別に整理
- **レスポンシブデザイン**: あらゆるデバイスで美しく表示
- **管理画面**: 動画の追加・編集・削除が可能
- **モダンなUI**: ガラス効果とグラデーションを使用した美しいデザイン

## 🚀 技術スタック

- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + DaisyUI
- **アニメーション**: CSS Transitions
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

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## 📁 プロジェクト構造

```
next-website-yukue/
├── public/                 # 静的ファイル
│   ├── logo.svg           # ロゴファイル
│   └── placeholder-video.jpg
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # メインページ
│   │   ├── admin/         # 管理画面
│   │   └── layout.tsx     # レイアウト
│   ├── components/        # Reactコンポーネント
│   │   ├── VideoPortfolio.tsx
│   │   ├── VideoManager.tsx
│   │   └── ...
│   └── data/              # データファイル
│       └── videos.ts      # 動画データ
├── tailwind.config.js     # Tailwind設定
└── package.json
```

## 🎯 主要コンポーネント

### VideoPortfolio
動画の表示とカテゴリフィルタリングを担当

### VideoManager
管理画面での動画の追加・編集・削除を担当

### 動画データ管理
`src/data/videos.ts`で動画データを管理

## 🎨 カスタマイズ

### 動画の追加
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
2. 自動デプロイが有効になります

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
