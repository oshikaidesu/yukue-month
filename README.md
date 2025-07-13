# Yukue - 動画ポートフォリオサイト

美しい動画ポートフォリオサイトです。Next.js、React、Tailwind CSSを使用して構築されており、YouTube、Vimeo、ニコニコ動画の動画を美しく表示できます。

## 🎥 主な機能

- **動画埋め込み**: YouTube、Vimeo、ニコニコ動画の動画を簡単に埋め込み
- **ニコニコ動画プレイリスト解析**: Pythonスクリプトでプレイリストから自動的に動画情報を取得
- **動画管理システム**: 動画の追加、編集、削除が可能な管理画面
- **カテゴリ分け**: 動画をカテゴリ別に整理（VOCALOID、その他など）
- **検索機能**: タイトル、説明、カテゴリで動画を検索
- **ランキング表示**: 再生回数、いいね数、ランク順での表示
- **レスポンシブデザイン**: あらゆるデバイスで美しく表示
- **モダンなUI**: ガラス効果とグラデーションを使用した美しいデザイン
- **アニメーション**: Framer Motionによる滑らかなアニメーション

## 🚀 技術スタック

- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + DaisyUI
- **アニメーション**: Framer Motion
- **開発環境**: Turbopack
- **スクリプト**: Python 3（ニコニコ動画プレイリスト解析用）

## 📦 セットアップ

### 前提条件

- Node.js 18.0.0以上
- Python 3.7以上（ニコニコ動画プレイリスト解析用）
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/oshikaidesu/next-website-yukue.git
cd next-website-yukue
```

2. 依存関係をインストール
```bash
npm install
```

3. Python依存関係をインストール（オプション）
```bash
cd scripts
pip install -r requirements.txt
cd ..
```

4. 開発サーバーを起動
```bash
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセス

## 🔧 ニコニコ動画プレイリスト解析

### 使用方法

1. ニコニコ動画のマイリストURLを取得
2. 以下のコマンドを実行：

```bash
cd scripts
python generate_videos_json.py "https://www.nicovideo.jp/mylist/12345678"
```

3. 生成されたJSONファイルが`src/data/videos.json`に保存されます

### 機能

- マイリストから動画IDを自動抽出
- 各動画の詳細情報（タイトル、説明、投稿者、再生回数、いいね数）を取得
- VOCALOID動画の自動判定
- タグ情報の取得

## 📁 プロジェクト構造

```
next-website-yukue/
├── public/                 # 静的ファイル
│   ├── logo.svg           # ロゴファイル
│   ├── Logo_Horizontal.svg
│   └── placeholder-video.jpg
├── scripts/               # Pythonスクリプト
│   ├── generate_videos_json.py  # ニコニコ動画プレイリスト解析
│   ├── requirements.txt
│   └── README.md
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # メインページ
│   │   ├── admin/         # 管理画面
│   │   │   └── page.tsx
│   │   ├── api/           # APIルート
│   │   │   └── preview/   # プレビューAPI
│   │   └── layout.tsx     # レイアウト
│   ├── components/        # Reactコンポーネント
│   │   ├── VideoCards.tsx # 動画カード表示
│   │   ├── VideoManager.tsx # 動画管理
│   │   ├── VideoPortfolio.tsx # 動画ポートフォリオ
│   │   ├── NicovideoThumbnail.tsx # ニコニコ動画サムネイル
│   │   ├── AnimatedButton.tsx # アニメーションボタン
│   │   ├── AnimatedCard.tsx # アニメーションカード
│   │   ├── AnimatedSection.tsx # アニメーションセクション
│   │   ├── TodoList.tsx # TODOリスト
│   │   ├── Header.tsx # ヘッダー
│   │   ├── Hero.tsx # ヒーローセクション
│   │   ├── Hero2.tsx # ヒーローセクション2
│   │   └── Footer.tsx # フッター
│   ├── data/              # データファイル
│   │   ├── videos.json    # 動画データ（JSON）
│   │   └── videos.ts      # 動画データとユーティリティ関数
│   ├── icons/             # アイコンファイル
│   │   └── yukue_Logo/    # Yukueロゴ
│   └── types/             # TypeScript型定義
│       └── json.d.ts
├── tailwind.config.js     # Tailwind設定
└── package.json
```

## 🎯 主要コンポーネント

### VideoCards
動画の表示とURLからの自動取得機能を担当

### VideoManager
動画の管理機能（追加、編集、削除）を提供

### VideoPortfolio
動画のポートフォリオ表示を担当

### NicovideoThumbnail
ニコニコ動画のサムネイル表示を担当

### 動画データ管理
`src/data/videos.ts`で動画データを管理し、以下の機能を提供：
- 最新動画の取得
- ランキング順での取得
- カテゴリ別での取得
- 再生回数順での取得
- いいね数順での取得
- 検索機能

## 🎨 カスタマイズ

### 動画の追加方法

#### 1. 手動追加
`src/data/videos.json`を編集して動画を追加：

```json
{
  "id": "sm12345678",
  "title": "動画タイトル",
  "description": "動画の説明",
  "url": "https://www.nicovideo.jp/watch/sm12345678",
  "platform": "nicovideo",
  "category": "VOCALOID",
  "dateAdded": "2024-01-01",
  "views": 1000,
  "likes": 100,
  "artist": "投稿者名",
  "tags": ["タグ1", "タグ2"]
}
```

#### 2. ニコニコ動画プレイリストから自動取得（推奨）
```bash
cd scripts
python generate_videos_json.py "https://www.nicovideo.jp/mylist/12345678"
```

#### 3. 管理画面から追加
`/admin`ページにアクセスして、Webインターフェースから動画を管理

### スタイルの変更
`tailwind.config.js`でTailwind CSSの設定をカスタマイズ

### ロゴの変更
`public/`ディレクトリ内のロゴファイルを新しいロゴに置き換え

## 📱 レスポンシブ対応

- モバイル: 1列グリッド
- タブレット: 2列グリッド
- デスクトップ: 3列グリッド

## 🔧 開発コマンド

```bash
npm run dev      # 開発サーバー起動（Turbopack使用）
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

---

**Yukue** - 美しい動画ポートフォリオサイト
