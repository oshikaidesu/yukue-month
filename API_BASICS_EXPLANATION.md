# APIの基本 - microCMSの場合

## 🎯 APIとは？

APIは「**URLを叩いてJSONデータを取得する**」仕組みです。

## 📡 基本的な仕組み

```
プログラム
  ↓ HTTPリクエスト（GET）
  https://your-service.microcms.io/api/v1/yukuemonth
  ↓
microCMSサーバー
  ↓ JSONレスポンス
  {
    "contents": [...],
    "totalCount": 2
  }
  ↓
プログラム
```

## 🔍 microCMSのAPI URL構造

microCMSのAPI URLは以下の形式です：

```
https://{サービスID}.microcms.io/api/v1/{エンドポイント名}
```

**例**:
```
https://yukue-month.microcms.io/api/v1/yukuemonth
```

### クエリパラメータ

フィルタリングやソートなどは、URLに`?`以降で追加します：

```
https://yukue-month.microcms.io/api/v1/yukuemonth?limit=10&orders=-publishedAt
https://yukue-month.microcms.io/api/v1/yukuemonth?filters=year[equals]2025
```

## 🔑 APIキー

microCMSはAPIキーが必要です。HTTPヘッダーに含めて送信します：

```
X-MICROCMS-API-KEY: your-api-key-here
```

## 💻 実際の実装方法

### 方法1: SDKを使用（推奨・簡単）

SDKが内部でHTTPリクエストを送信してくれます：

```typescript
import { microcms } from '@/lib/microcms';

// これが内部で実行されること：
// GET https://your-service.microcms.io/api/v1/yukuemonth
// Header: X-MICROCMS-API-KEY: your-api-key
const response = await microcms.get({
  endpoint: 'yukuemonth',
});
```

### 方法2: fetch APIで直接取得（理解を深める）

SDKの内部でやっていることを手動で実装：

```typescript
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

// URLを組み立て
const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/yukuemonth`;

// fetchでHTTPリクエスト
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'X-MICROCMS-API-KEY': API_KEY,
  },
});

// JSONを取得
const data = await response.json();

console.log(data);
```

### 方法3: ブラウザで直接確認

ブラウザのアドレスバーに直接入力しても取得できます（ただし、APIキーが必要な場合はできません）：

```
https://yukue-month.microcms.io/api/v1/yukuemonth?X-MICROCMS-API-KEY=your-key
```

⚠️ **注意**: APIキーをURLに入れるのはセキュリティ上良くないので、実際にはcurlやPostmanなどを使います。

## 🔧 curlコマンドで確認

ターミナルから直接APIを叩いてみる：

```bash
curl -H "X-MICROCMS-API-KEY: your-api-key" \
  "https://your-service.microcms.io/api/v1/yukuemonth"
```

## 📋 レスポンス例

microCMSから返ってくるJSONの形式：

```json
{
  "contents": [
    {
      "id": "xxx",
      "year": 2025,
      "month": 4,
      "yearMonth": "2025.04",
      "videos": [
        {
          "id": "sm12345678",
          "title": "タイトル",
          "url": "https://...",
          "artist": "アーティスト",
          "thumbnail": "/thumbnails/...",
          "ogpThumbnailUrl": "https://..."
        }
      ],
      "publishedAt": "2025-04-01T00:00:00.000Z"
    }
  ],
  "totalCount": 2,
  "offset": 0,
  "limit": 10
}
```

## 🔄 SDKが内部でやっていること

`microcms.get()`を呼ぶと、内部的には：

```typescript
// 1. URLを組み立て
const url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}?${queryString}`;

// 2. fetchでHTTPリクエスト
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'X-MICROCMS-API-KEY': apiKey,
    'Content-Type': 'application/json',
  },
});

// 3. JSONをパース
const data = await response.json();

// 4. 返す
return data;
```

## 📝 実装例：手動でfetchを使う

```typescript
// src/lib/api/yukuemonth-manual.ts
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

export async function getPlaylistsManual() {
  // URLを組み立て
  const baseUrl = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/yukuemonth`;
  const url = `${baseUrl}?limit=100&orders=-publishedAt`;

  // HTTPリクエストを送信
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-MICROCMS-API-KEY': API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  // エラーチェック
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // JSONをパース
  const data = await response.json();

  // データを返す
  return data;
}

// 使用例
const data = await getPlaylistsManual();
console.log(data.contents); // プレイリストの配列
```

## 🌐 その他のHTTPメソッド

APIは基本的にGET（取得）ですが、他のメソッドもあります：

- **GET**: データを取得
- **POST**: データを作成（書き込みAPIキーが必要）
- **PATCH**: データを更新（書き込みAPIキーが必要）
- **DELETE**: データを削除（書き込みAPIキーが必要）

microCMSでは通常、読み取り専用APIキーを使うので、GETのみ使用します。

## ✅ まとめ

1. **API = URLを叩いてJSONを取得**
2. **microCMSはRESTful API**
3. **SDKは内部でfetchを使ってHTTPリクエストを送信**
4. **手動でもfetchで取得可能**

SDKを使うと簡単ですが、内部的には普通のHTTPリクエストです！

