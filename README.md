# ゆくえレコーズ MONTHLY PICKUP PLAYLIST

リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト

## プロジェクト概要

ゆくえレコーズ マンスリープレイリストのサイト制作  
現状ニコニコのマイリスト機能 + kiite cafe を活用しているだけで告知がTwitterのみに止まっているため、サイトを制作することで掲載されることへの付加価値を上げる。=> 文化への貢献を狙う。  
アニメーションの味が強い、LPのようなビジュアルを重視したWebサイトの制作  

### コンセプト

- できる限り楽曲との出会いを公平するため、数字に関する情報を掲載しない。
- 並び順は順位といった曲の序列を意識させてしまうので、固定させるのではなく更新をかけるたびに順番を変更することで配慮する。
- 総じて雑誌のような質感を意識、平成のHPのような実験的感覚 => HTMLパワーを彷彿とさせる手作り感を念頭に置く。（かなりポップになった）
- 後々micro cmsにて管理をしやすいよう整えるつもりなので、Next.js、Daisy UIといった、モダンで整備されてる技術を採用。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + DaisyUI
- **アニメーション**: Framer Motion
- **デプロイ**: Cloudflare Pages
- **開発ツール**: Claude Code + Cursor

## 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール
```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```
- http://localhost:3000 でアクセス可能

## ビルド

```bash
npm run build
```

## デプロイ

### Cloudflare Pagesへのデプロイ
```bash
npm run pages:deploy
```

**注意**: このプロジェクトはNode.js機能（API Routes等）を使用しているため、GitHub Pages（静的サイトのみ）ではなく、Cloudflare Pagesでのデプロイを推奨しています。

### デプロイ先の選択理由
- **Cloudflare Pages**: Node.js機能をサポート、API Routesが使用可能
- **GitHub Pages**: 静的サイトのみ、Node.js機能は使用不可
- **Vercel**: 有料プランが必要な場合がある

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # ホームページ
│   ├── about/          # Aboutページ
│   ├── archive/        # アーカイブページ
│   ├── layout.tsx      # レイアウト
│   ├── globals.css     # グローバルスタイル
│   └── favicon.ico     # ファビコン
├── components/         # Reactコンポーネント
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── Footer.tsx      # フッターコンポーネント
│   ├── Hero.tsx        # ヒーローセクション
│   ├── VideoCards.tsx  # 動画カードコンポーネント
│   ├── NicovideoThumbnail.tsx # ニコニコ動画サムネイル
│   └── PickupBackground.tsx   # 背景アニメーション
├── data/              # 動画データ（JSON）
│   ├── 2024/         # 2024年の動画データ
│   ├── 2025/         # 2025年の動画データ
│   └── getYearMonthFromPath.ts # パスから年月を取得するユーティリティ
├── types/             # TypeScript型定義
│   ├── video.d.ts     # 動画データの型定義
│   ├── json.d.ts      # JSONデータの型定義
│   └── ogp.d.ts       # OGPデータの型定義
├── lib/               # ユーティリティ関数
│   └── utils.ts       # 共通ユーティリティ
└── icons/             # アイコンファイル
    ├── yukue_Logo/    # ゆくえレコーズロゴ
    └── nc296561__ニコニコ_シンボルマーク.png
```

## データ構造

### 動画データ（JSON）
各月の動画データは `src/data/YYYY/videos_MM.json` の形式で保存されています。

#### ファイル構造
```
src/data/
├── 2024/
│   ├── videos_04.json
│   ├── videos_05.json
│   ├── videos_08.json
│   ├── videos_09.json
│   ├── videos_10.json
│   ├── videos_11.json
│   └── videos_12.json
└── 2025/
    ├── videos_01.json
    ├── videos_02.json
    ├── videos_03.json
    ├── videos_04.json
    ├── videos_05.json
    ├── videos_06.json
    └── videos_voca_winter.json
```

#### フィールド説明
- **id**: ニコニコ動画の動画ID（例: `sm44500976`）
- **title**: 動画のタイトル
- **url**: 動画の完全URL
- **artist**: アーティスト名
- **thumbnail**: ローカルサムネイル画像のパス（現在は使用されていない）
- **ogpThumbnailUrl**: OGPから取得した高品質サムネイル画像のURL

## 機能

- **動画カード表示**: ニコニコ動画とYouTubeの動画をカード形式で表示
- **サムネイル取得**: OGPを使用した動画サムネイルの自動取得
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **アニメーション**: Framer Motionを使用したスムーズなアニメーション
- **アーカイブ機能**: 過去のプレイリストを月別に表示

## プロジェクト整理

このプロジェクトは以下の整理を行いました：

### 削除したファイル・ディレクトリ
- 開発用スクリプト（`update-*.js`, `test-*.js`）
- サンプルアプリ（`sampleapp/`）
- 不要な画像ファイル（`public/`内の未使用ファイル）
- 大量のサムネイル画像（`public/thumbnails/`）
- ビルドファイル（`.next/`, `out/`, `build/`）
- システムファイル（`.DS_Store`）

### 保持したファイル
- プロジェクトのソースコード（`src/`）
- 設定ファイル（`package.json`, `next.config.ts`等）
- ドキュメント（`README.md`）
- 必要な静的ファイル（`public/`内の使用中ファイル）
