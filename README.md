# Yukue Records Website

## 変更点（軽量化・最適化）

npm run deploy

- Header/ Footer をサーバーコンポーネント化（`'use client'` を削除）
  - これにより共通ナビゲーション分のクライアント JS を削減
- VideoCards から `react-device-detect` の依存を除去し、`window.innerWidth` ベースの分岐に統一
  - 追加バンドルの削減、実行コストの低減
- `console.log` を本番コードから削除（`Hero.tsx` / `VideoCards.tsx` / `NicovideoThumbnail.tsx`）
  - JS サイズの縮小、メインスレッド処理の削減
- `PickupBackground.tsx` のスクロールリスナーを `passive: true` 化
  - スクロール時のメインスレッド負荷を低減

これらはレイアウト・アニメーションの見た目を変えずに適用しています。

## Lighthouse/計測の注意（bfcache など）

開発サーバー（`next dev --turbopack`）では以下の理由でスコアが悪化しやすいです。

- HMR 用 WebSocket により「バックフォワードキャッシュ（bfcache）」が無効化される
- メインリソースに `Cache-Control: no-store` が付与される

本番相当での計測を行ってください。

```bash
npm run build
npm start
# http://localhost:3000 を Lighthouse/Pagespeed で計測
```

これで WebSocket/`no-store` は外れ、bfcache の失敗理由は解消されます。

## 期待される効果（目安）

- クライアント JS の初期実行時間を共通ヘッダー/フッター分だけ低減
- 依存削減とログ削除により JS バンドル縮小（数十 KB 規模）
- スクロール時のメインスレッド処理を軽量化

## 補足

- CSS/JS の最小化は本番ビルドで自動適用されます（Next.js 15）。
- 追加の削減候補（要検討）
  - `Hero.tsx` の背景データ（JSON）を動的 import して初期 JS をさらに削減
  - `framer-motion` を `LazyMotion` で読み分け（アニメーション仕様は据え置き）
  - DaisyUI の利用範囲を絞る（必要コンポーネントのみ）

## パフォーマンス改善

パフォーマンス改善に関する詳細な情報は [`PERFORMANCE_IMPROVEMENTS.md`](./PERFORMANCE_IMPROVEMENTS.md) を参照してください。

### 主な改善内容
- 基本的な軽量化（Header/Footer のサーバーコンポーネント化、依存削除等）
- サムネイル処理軽量化（iframeフォールバック削除）
- スマホでのアニメーション最適化（検討中）
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
- **アイコン**: [Flowbite Icons](https://flowbite.com/icons/)
- **デプロイ**: Cloudflare Pages
- **開発補助ツール**: Claude Code + Cursor

### 環境
- Node.js 18以上
- npm または yarn

## デプロイ

### Cloudflare Pagesへのデプロイ
```bash
npm run pages:deploy
```

### デプロイ先の選択理由
- **Cloudflare Pages**: 商用利用可
- **Vercel**: 商用利用不可

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # ホームページ
│   ├── concept/        # Conceptページ
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
- **thumbnail**: ローカルサムネイル画像のパス（youtubeサムネ用）
- **ogpThumbnailUrl**: OGPから取得した高品質サムネイル画像のURL

## 機能

- **動画カード表示**: ニコニコ動画とYouTubeの動画をカード形式で表示
- **サムネイル取得**: OGPを使用した動画サムネイルの自動取得
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **アニメーション**: Framer Motionを使用したスムーズなアニメーション
- **アーカイブ機能**: 過去のプレイリストを月別に表示

