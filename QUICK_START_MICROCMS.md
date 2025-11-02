# microCMS クイックスタート

## ✅ セットアップ完了

パッケージはインストール済みです。以下の手順で使用できます。

## 🔧 環境変数の設定

`.env.local`ファイルに以下を追加：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-read-only-api-key
```

## 📝 基本的な使い方

### 方法1: 提供された関数を使用（推奨）

```typescript
// 最新のプレイリストを取得
import { getLatestPlaylist } from '@/lib/api/yukuemonth';

const latest = await getLatestPlaylist();
console.log(latest?.videos);

// 2025年04月を取得
import { getPlaylistByYearMonth } from '@/lib/api/yukuemonth';

const playlist = await getPlaylistByYearMonth(2025, 4);
console.log(playlist?.videos);
```

### 方法2: 直接クライアントを使用

```typescript
import { microcms } from '@/lib/microcms';

// すべて取得
const response = await microcms.get({
  endpoint: 'yukuemonth',
});

console.log(response.contents);
// response.contents は配列で、各要素に year, month, yearMonth, videos が含まれます
```

### 方法3: フィルタリング

```typescript
import { microcms } from '@/lib/microcms';

// 2025年のデータのみ取得
const response2025 = await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    filters: 'year[equals]2025',
  },
});

// 2024年04月を取得
const response202404 = await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    filters: 'yearMonth[equals]2024.04',
    limit: 1,
  },
});

console.log(response202404.contents[0]?.videos);
```

## 🎯 Next.jsでの実装例

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
      <ul>
        {playlist.videos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Client Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { microcms } from '@/lib/microcms';

export default function PlaylistView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    microcms
      .get({
        endpoint: 'yukuemonth',
      })
      .then((res) => {
        console.log(res);
        setData(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!data) return <div>読み込み中...</div>;

  return (
    <div>
      {data.contents.map((item) => (
        <div key={item.id}>
          <h2>{item.yearMonth}</h2>
          <p>動画数: {item.videos.length}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📋 レスポンス構造

```typescript
{
  contents: [
    {
      id: 'xxx',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      publishedAt: '2025-04-01T00:00:00.000Z',
      revisedAt: '2025-01-01T00:00:00.000Z',
      year: 2025,
      month: 4,
      yearMonth: '2025.04',
      videos: [
        {
          id: 'sm12345678',
          title: 'タイトル',
          url: 'https://www.nicovideo.jp/watch/sm12345678',
          artist: 'アーティスト名',
          thumbnail: '/thumbnails/sm12345678.jpg',
          ogpThumbnailUrl: 'https://...',
        },
      ],
    },
  ],
  totalCount: 2,
  offset: 0,
  limit: 10,
}
```

## 🔍 よく使うクエリ

```typescript
// 最新順で取得
await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    orders: '-publishedAt', // 降順
  },
});

// 特定のフィールドのみ取得
await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    fields: 'year,month,videos',
  },
});

// 件数制限
await microcms.get({
  endpoint: 'yukuemonth',
  queries: {
    limit: 5,
  },
});
```

## ✅ 動作確認

以下を実行して動作を確認：

```typescript
import { microcms } from '@/lib/microcms';

microcms
  .get({
    endpoint: 'yukuemonth',
  })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

これで2025年と2024年04月のデータが取得できるはずです！

