# API実装状況

現在のmicroCMS API実装の状況です。

## 📁 ファイル構成

```
src/
├── lib/
│   ├── microcms.ts              # microCMSクライアント（基本設定）
│   └── api/
│       ├── yukuemonth.ts        # メインAPI関数（推奨）
│       └── yukuemonth-simple.ts # 手動fetch版（理解用）
└── types/
    └── microcms.d.ts            # TypeScript型定義
```

## 🔧 実装済みの機能

### 1. microCMSクライアント (`src/lib/microcms.ts`)

```typescript
import { microcms } from '@/lib/microcms';
// 環境変数から自動的に設定される
```

**機能**:
- ✅ サービスドメインとAPIキーの設定
- ✅ 環境変数の検証
- ✅ クライアントインスタンスのエクスポート

### 2. API関数 (`src/lib/api/yukuemonth.ts`)

以下の6つの関数を実装済み：

#### ✅ `getAllPlaylists()`
すべてのプレイリストを取得（最大100件、公開日時降順）

```typescript
const playlists = await getAllPlaylists();
// Playlist[] を返す
```

#### ✅ `getLatestPlaylist()`
最新のプレイリストを取得（公開日時が最新の1件）

```typescript
const latest = await getLatestPlaylist();
// Playlist | null を返す
```

#### ✅ `getPlaylistByYearMonth(year, month)`
指定した年月のプレイリストを取得

```typescript
// 2025年04月を取得
const playlist = await getPlaylistByYearMonth(2025, 4);
// または
const playlist = await getPlaylistByYearMonth(2025, '04');
// Playlist | null を返す
```

#### ✅ `getPlaylistsByYear(year)`
指定した年のすべてのプレイリストを取得

```typescript
const playlists2025 = await getPlaylistsByYear(2025);
// Playlist[] を返す
```

#### ✅ `getAvailableYearMonths()`
利用可能な年月のリストを取得（重複なし）

```typescript
const yearMonths = await getAvailableYearMonths();
// [{ year: 2025, month: '04' }, ...] を返す
```

#### ✅ `getVideosByYearMonth(year, month)`
動画リストのみを取得（VideoItem[]）

```typescript
const videos = await getVideosByYearMonth(2025, 4);
// VideoItem[] を返す（プレイリスト情報なし）
```

## 📋 型定義 (`src/types/microcms.d.ts`)

### 主要な型

- ✅ `MicroCMSListResponse<T>` - リスト形式のレスポンス
- ✅ `MicroCMSContentResponse<T>` - 単一コンテンツのレスポンス
- ✅ `PlaylistContent` - プレイリストのデータ構造
- ✅ `Playlist` - アプリケーション層で使用する型

## 🎯 使い方の例

### Server Component（推奨）

```typescript
// src/app/page.tsx
import { getLatestPlaylist } from '@/lib/api/yukuemonth';

export default async function Home() {
  const playlist = await getLatestPlaylist();
  
  if (!playlist) {
    return <div>データが見つかりません</div>;
  }

  return (
    <div>
      <h1>{playlist.yearMonth}</h1>
      <p>動画数: {playlist.videos.length}</p>
      {/* 動画リストを表示 */}
    </div>
  );
}
```

### Client Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getPlaylistByYearMonth, type Playlist } from '@/lib/api/yukuemonth';

export default function PlaylistView({ year, month }: { year: number; month: number }) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    getPlaylistByYearMonth(year, month)
      .then(setPlaylist)
      .catch(console.error);
  }, [year, month]);

  if (!playlist) return <div>読み込み中...</div>;

  return (
    <div>
      <h2>{playlist.yearMonth}</h2>
      {/* 動画リストを表示 */}
    </div>
  );
}
```

## ✅ 完了していること

- ✅ microCMSクライアントの初期化
- ✅ 基本的なAPI関数（6つ）
- ✅ TypeScript型定義
- ✅ エラーハンドリング
- ✅ フィルタリング機能
- ✅ ソート機能

## 🔄 次のステップ（必要に応じて）

現在はAPI関数のみ実装済みで、実際のページでの使用はまだです。

1. **ホームページの更新** (`src/app/page.tsx`)
   - JSONファイルからmicroCMS APIに切り替え

2. **アーカイブページの更新** (`src/app/archive/page.tsx`)
   - 動的読み込みをAPI呼び出しに変更

3. **環境変数の設定**
   - `.env.local`に`MICROCMS_SERVICE_DOMAIN`と`MICROCMS_API_KEY`を設定

## 📝 使用方法まとめ

```typescript
// 基本的な使い方
import { 
  getAllPlaylists,
  getLatestPlaylist,
  getPlaylistByYearMonth,
  getPlaylistsByYear,
  getAvailableYearMonths,
  getVideosByYearMonth
} from '@/lib/api/yukuemonth';

// すべて取得
const all = await getAllPlaylists();

// 最新を取得
const latest = await getLatestPlaylist();

// 年月指定で取得
const playlist = await getPlaylistByYearMonth(2025, 4);

// 年のすべて取得
const year2025 = await getPlaylistsByYear(2025);

// 利用可能な年月リスト
const available = await getAvailableYearMonths();

// 動画のみ取得
const videos = await getVideosByYearMonth(2025, 4);
```

**すべての関数はTypeScript型がついているので、IDEで補完が効きます！**

