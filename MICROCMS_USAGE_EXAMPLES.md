# microCMS API 使用方法

## 📦 インストール

```bash
npm install microcms-js-sdk
```

## 🔧 環境変数の設定

`.env.local`に以下を設定：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-read-only-api-key
```

## 📝 基本的な使用方法

### 1. すべてのプレイリストを取得

```typescript
import { getAllPlaylists } from '@/lib/api/yukuemonth';

const playlists = await getAllPlaylists();
console.log(playlists);
```

### 2. 最新のプレイリストを取得

```typescript
import { getLatestPlaylist } from '@/lib/api/yukuemonth';

const latest = await getLatestPlaylist();
if (latest) {
  console.log(`最新: ${latest.yearMonth}`);
  console.log(`動画数: ${latest.videos.length}`);
}
```

### 3. 年月でプレイリストを取得

```typescript
import { getPlaylistByYearMonth } from '@/lib/api/yukuemonth';

// 2025年04月
const playlist = await getPlaylistByYearMonth(2025, 4);
// または
const playlist = await getPlaylistByYearMonth(2025, '04');

if (playlist) {
  console.log(playlist.videos);
}
```

### 4. 特定の年のすべてのプレイリストを取得

```typescript
import { getPlaylistsByYear } from '@/lib/api/yukuemonth';

const playlists2025 = await getPlaylistsByYear(2025);
playlists2025.forEach(p => {
  console.log(`${p.yearMonth}: ${p.videos.length}件`);
});
```

### 5. 動画リストのみを取得

```typescript
import { getVideosByYearMonth } from '@/lib/api/yukuemonth';

const videos = await getVideosByYearMonth(2025, 4);
// VideoItem[] が返ってくる
console.log(videos);
```

### 6. 利用可能な年月リストを取得

```typescript
import { getAvailableYearMonths } from '@/lib/api/yukuemonth';

const yearMonths = await getAvailableYearMonths();
// [{ year: 2025, month: '04' }, { year: 2024, month: '04' }, ...]
console.log(yearMonths);
```

## 🎯 Next.jsでの使用例

### Server Component (推奨)

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
// src/components/PlaylistView.tsx
'use client';

import { useEffect, useState } from 'react';
import { getPlaylistByYearMonth, type Playlist } from '@/lib/api/yukuemonth';

export default function PlaylistView({ year, month }: { year: number; month: number }) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPlaylistByYearMonth(year, month);
        setPlaylist(data);
      } catch (error) {
        console.error('エラー:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, month]);

  if (loading) return <div>読み込み中...</div>;
  if (!playlist) return <div>データが見つかりません</div>;

  return (
    <div>
      <h2>{playlist.yearMonth}</h2>
      <ul>
        {playlist.videos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### API Route

```typescript
// src/app/api/playlist/route.ts
import { NextResponse } from 'next/server';
import { getPlaylistByYearMonth } from '@/lib/api/yukuemonth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || '2025', 10);
  const month = searchParams.get('month') || '1';

  try {
    const playlist = await getPlaylistByYearMonth(year, parseInt(month, 10));
    
    if (!playlist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## 🔍 直接クライアントを使用する場合

より細かい制御が必要な場合：

```typescript
import { microcms } from '@/lib/microcms';

// すべて取得
const response = await microcms.get({
  endpoint: 'yukuemonth',
});

console.log(response.contents);
console.log(response.totalCount);

// フィルタリング
const filtered = await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    filters: 'year[equals]2025',
    limit: 10,
    orders: '-publishedAt',
  },
});

// 特定のフィールドのみ取得
const fieldsOnly = await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    fields: 'year,month,videos',
    limit: 1,
  },
});
```

## 🛠️ エラーハンドリング

```typescript
import { getPlaylistByYearMonth } from '@/lib/api/yukuemonth';

try {
  const playlist = await getPlaylistByYearMonth(2025, 4);
  if (!playlist) {
    console.log('プレイリストが見つかりません');
    return;
  }
  // 処理...
} catch (error) {
  console.error('API取得エラー:', error);
  // エラー処理...
}
```

## 📋 レスポンス型

```typescript
import type { Playlist, VideoItem } from '@/lib/api/yukuemonth';

const playlist: Playlist = {
  id: 'xxx',
  year: 2025,
  month: 4,
  yearMonth: '2025.04',
  videos: [
    {
      id: 'sm12345678',
      title: 'タイトル',
      url: 'https://...',
      artist: 'アーティスト',
      thumbnail: '/thumbnails/...',
      ogpThumbnailUrl: 'https://...',
    },
  ],
  publishedAt: '2025-04-01T00:00:00.000Z',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};
```

