# microCMS導入計画書

## 📋 概要

このドキュメントは、現在JSONファイルで管理されている動画データをmicroCMSに移行する計画をまとめたものです。

## 🎯 導入目的

1. **コンテンツ管理の簡素化**: 非エンジニアでも動画データの追加・編集が可能になる
2. **運用効率の向上**: 手動でのJSONファイル編集から解放され、Web UIで管理できる
3. **データの一元管理**: すべてのプレイリストデータをmicroCMSで一元管理
4. **将来的な拡張性**: 将来的に他のコンテンツ（お知らせ、アーティスト情報など）も追加可能

## 📊 現状分析

### 現在のデータ構造

- **保存場所**: `src/data/YYYY/videos_MM.json`
- **データ形式**: JSON配列
- **データ型**: `VideoItem`（以下を参照）

```typescript
export type VideoItem = {
  id: string;              // ニコニコ動画の動画ID（例: sm44500976）
  title: string;           // 動画のタイトル
  url: string;            // 動画の完全URL
  artist: string;         // アーティスト名
  thumbnail?: string;      // ローカルサムネイル画像のパス
  ogpThumbnailUrl?: string | null; // OGPから取得した高品質サムネイル画像のURL
};
```

### 現在の利用箇所

1. **ホームページ** (`src/app/page.tsx`)
   - 最新のプレイリスト（`videos_2025_09.json`）を直接import

2. **アーカイブページ** (`src/app/archive/page.tsx`)
   - 動的に年月を選択してJSONファイルを読み込み

3. **コンポーネント**
   - `VideoCards.tsx`: 動画リストを表示
   - `Hero.tsx`: ヒーローセクションで動画情報を使用

## 🏗️ microCMSデータモデル設計

### エンドポイント構成

#### 1. プレイリスト（List）
- **API ID**: `playlists`
- **用途**: 月ごとのプレイリスト管理

**フィールド設計**:
| フィールドID | 表示名 | タイプ | 必須 | 説明 |
|------------|--------|--------|------|------|
| `year` | 年 | 数値（整数） | ✓ | プレイリストの年（例: 2025） |
| `month` | 月 | 数値（整数） | ✓ | プレイリストの月（1-12、特別な場合は文字列も可） |
| `yearMonth` | 年月表示 | 文字列（1行） | ✓ | 表示用の年月文字列（例: "2025.09"） |
| `videos` | 動画リスト | カスタムフィールド（繰り返し） | ✓ | 動画データの配列（下記参照） |
| `publishedAt` | 公開日時 | 日時 | ✓ | プレイリストの公開日時 |

**動画カスタムフィールド** (`videos`内):
| フィールドID | 表示名 | タイプ | 必須 | 説明 |
|------------|--------|--------|------|------|
| `id` | 動画ID | 文字列（1行） | ✓ | ニコニコ動画の動画ID（例: sm44500976） |
| `title` | タイトル | 文字列（1行） | ✓ | 動画のタイトル |
| `url` | URL | 文字列（1行） | ✓ | 動画の完全URL |
| `artist` | アーティスト名 | 文字列（1行） | ✓ | アーティスト名 |
| `thumbnail` | サムネイル画像パス | 文字列（1行） | - | ローカルサムネイル画像のパス |
| `ogpThumbnailUrl` | OGPサムネイルURL | 文字列（1行） | - | OGPから取得した高品質サムネイル画像のURL |

### APIレスポンス例

```json
{
  "contents": [
    {
      "id": "playlist-2025-09",
      "year": 2025,
      "month": 9,
      "yearMonth": "2025.09",
      "videos": [
        {
          "id": "sm44500976",
          "title": "パヘル・マータの音と機微 / 夏色花梨・四国めたん・楚瓷・嗒啦啦",
          "url": "https://www.nicovideo.jp/watch/sm44500976",
          "artist": "いふみ",
          "thumbnail": "/thumbnails/sm44500976.jpg",
          "ogpThumbnailUrl": "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/44500976/..."
        }
      ],
      "publishedAt": "2025-09-01T00:00:00.000Z"
    }
  ],
  "totalCount": 1,
  "offset": 0,
  "limit": 10
}
```

## 🔧 実装計画

### Phase 1: 環境準備

1. **microCMSアカウント・サービス作成**
   - microCMSのアカウント作成
   - 新しいサービス作成
   - APIキーの取得

2. **依存パッケージのインストール**
   ```bash
   npm install @microcms-io/sdk
   ```

3. **環境変数の設定**
   - `.env.local`に以下を追加:
     ```
     MICROCMS_SERVICE_DOMAIN=your-service-domain
     MICROCMS_API_KEY=your-api-key
     ```

### Phase 2: APIクライアント実装

1. **microCMSクライアント作成**
   - `src/lib/microcms.ts`を作成
   - APIクライアントの初期化

2. **型定義の拡張**
   - `src/types/microcms.d.ts`を作成
   - microCMSレスポンス型の定義

3. **データ取得関数の実装**
   - プレイリスト取得関数
   - 最新プレイリスト取得関数
   - 年月指定での取得関数

### Phase 3: 既存コードのリファクタリング

1. **ホームページ (`src/app/page.tsx`)**
   - JSON importをAPI呼び出しに変更
   - ISR（Incremental Static Regeneration）またはSSRに変更

2. **アーカイブページ (`src/app/archive/page.tsx`)**
   - 動的読み込みをAPI呼び出しに変更
   - 利用可能な年月リストをAPIから取得

3. **コンポーネント**
   - データ取得ロジックの分離
   - エラーハンドリングの追加

### Phase 4: キャッシュ戦略

1. **Next.js ISRの活用**
   - プレイリストデータは24時間ごとに再生成
   - `revalidate`オプションの設定

2. **Cloudflare Pages対応**
   - ISRが使えない場合は、On-demand Revalidationを検討
   - またはAPI Routeでのキャッシュ実装

### Phase 5: データ移行

1. **既存JSONデータのインポート**
   - 既存のJSONファイルをmicroCMSにインポート
   - 手動またはスクリプトで一括登録

2. **検証**
   - 既存データとAPIレスポンスの整合性確認
   - 表示の確認

### Phase 6: 運用開始

1. **JSONファイルの保持**
   - 移行期間中はJSONファイルも残しておく
   - フォールバック機能を実装

2. **完全移行後のクリーンアップ**
   - JSONファイルの削除
   - フォールバック機能の削除

## 📝 実装タスクリスト

### 環境準備
- [ ] microCMSアカウント作成・サービス作成
- [ ] APIキーの取得と環境変数設定
- [ ] `@microcms-io/sdk`のインストール
- [ ] `.env.local.example`の作成（Git管理用）

### 型定義・クライアント
- [ ] `src/types/microcms.d.ts`の作成
- [ ] `src/lib/microcms.ts`の作成
- [ ] プレイリスト取得関数の実装
- [ ] エラーハンドリングの実装

### データ取得ロジック
- [ ] `src/lib/api/playlists.ts`の作成（データ取得ロジック）
- [ ] 最新プレイリスト取得関数
- [ ] 年月指定取得関数
- [ ] 利用可能な年月リスト取得関数

### ページ更新
- [ ] `src/app/page.tsx`の更新（API呼び出しに変更）
- [ ] `src/app/archive/page.tsx`の更新
- [ ] ISR/SSRの実装
- [ ] ローディング状態の実装
- [ ] エラー状態の実装

### データ移行
- [ ] 既存JSONデータのmicroCMSへのインポート
- [ ] データ整合性の確認
- [ ] 表示の検証

### テスト・検証
- [ ] ホームページの表示確認
- [ ] アーカイブページの表示確認
- [ ] パフォーマンステスト
- [ ] エラーハンドリングのテスト

### ドキュメント・クリーンアップ
- [ ] README.mdの更新（microCMS使用の記載）
- [ ] 既存JSONファイルの削除（移行完了後）
- [ ] 不要なコードの削除

## 🔍 実装詳細

### microCMSクライアント (`src/lib/microcms.ts`)

```typescript
import { createClient } from '@microcms-io/sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is not set');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is not set');
}

export const microcms = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});
```

### プレイリスト取得関数 (`src/lib/api/playlists.ts`)

```typescript
import { microcms } from '@/lib/microcms';
import { VideoItem } from '@/types/video';

export type Playlist = {
  id: string;
  year: number;
  month: number;
  yearMonth: string;
  videos: VideoItem[];
  publishedAt: string;
};

export async function getLatestPlaylist(): Promise<Playlist | null> {
  const response = await microcms.get({
    endpoint: 'playlists',
    queries: {
      limit: 1,
      orders: '-publishedAt',
    },
  });

  if (response.contents.length === 0) {
    return null;
  }

  return response.contents[0] as Playlist;
}

export async function getPlaylistByYearMonth(
  year: number,
  month: number | string
): Promise<Playlist | null> {
  const monthStr = typeof month === 'number' ? month.toString().padStart(2, '0') : month;
  const yearMonth = `${year}.${monthStr}`;

  const response = await microcms.get({
    endpoint: 'playlists',
    queries: {
      filters: `yearMonth[equals]${yearMonth}`,
      limit: 1,
    },
  });

  if (response.contents.length === 0) {
    return null;
  }

  return response.contents[0] as Playlist;
}

export async function getAvailableYearMonths(): Promise<Array<{ year: number; month: string }>> {
  const response = await microcms.get({
    endpoint: 'playlists',
    queries: {
      fields: 'year,month',
      limit: 100,
      orders: '-publishedAt',
    },
  });

  const yearMonths = response.contents.map((item: any) => ({
    year: item.year,
    month: typeof item.month === 'number' 
      ? item.month.toString().padStart(2, '0') 
      : item.month,
  }));

  // 重複を削除
  const unique = Array.from(
    new Map(yearMonths.map(item => [`${item.year}-${item.month}`, item])).values()
  );

  return unique;
}
```

### ホームページ更新例 (`src/app/page.tsx`)

```typescript
import { getLatestPlaylist } from '@/lib/api/playlists';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // 1時間ごとに再生成

export default async function Home() {
  const playlist = await getLatestPlaylist();

  if (!playlist) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#EEEEEE]" data-theme="light">
      <Header />
      <main>
        <Hero videoList={playlist.videos} />
        <PickupBackground />
        <VideoCards videoList={playlist.videos} yearMonth={playlist.yearMonth} />
      </main>
      <Footer />
    </div>
  );
}
```

## ⚠️ 注意事項

### Cloudflare PagesでのISR制限

Cloudflare PagesではNext.jsのISR（Incremental Static Regeneration）が完全にはサポートされていません。以下の選択肢があります：

1. **SSR + キャッシュ**: API Routeでデータを取得し、Cloudflareのキャッシュを活用
2. **On-demand Revalidation**: microCMSのWebhookを使用して再生成をトリガー
3. **ビルド時生成**: デプロイ時に最新データを取得して静的生成

### フォールバック機能

移行期間中は、microCMS APIが失敗した場合に既存のJSONファイルを読み込むフォールバック機能を実装することを推奨します。

### パフォーマンス考慮

- API呼び出しの最適化（必要最小限のフィールド取得）
- キャッシュの活用（ISRまたはCloudflareキャッシュ）
- エラーハンドリングの徹底

### セキュリティ

- APIキーは環境変数で管理（`.env.local`はGit管理対象外）
- 本番環境では読み取り専用APIキーを使用
- microCMSのアクセス権限設定を適切に設定

## 📚 参考資料

- [microCMS公式ドキュメント](https://document.microcms.io/)
- [@microcms-io/sdk公式ドキュメント](https://github.com/microcmsio/microcms-js-sdk)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

## 🎯 完了基準

1. すべてのプレイリストデータがmicroCMSで管理されている
2. ホームページとアーカイブページがAPIから正常にデータを取得できる
3. 既存のJSONファイルを削除しても問題なく動作する
4. パフォーマンスが既存実装と同等以上である
5. エラーハンドリングが適切に実装されている

