# microCMS × JSONファイル ハイブリッドアプローチ

## 📋 方針

**現在のJSONファイルベースのワークフローを維持**しつつ、将来的にmicroCMSへ移行する選択肢を残す設計です。

## 🎯 設計思想

1. **JSONファイルがメイン**: マイリストから生成したJSONファイルを直接使用
2. **microCMSはオプション**: 必要に応じてJSONをmicroCMSにエクスポート可能
3. **段階的移行**: JSON → microCMSの移行は任意のタイミングで可能
4. **ワークフロー維持**: 既存の`scripts/fetch-mylist.js`による生成プロセスを維持

## 📁 データフロー

### 現在のワークフロー（維持）

```
マイリスト (ニコニコ) 
  ↓ scripts/fetch-mylist.js
JSONファイル (src/data/YYYY/videos_MM.json)
  ↓ 直接import
Next.js アプリケーション
```

### microCMS連携（オプション）

```
マイリスト (ニコニコ)
  ↓ scripts/fetch-mylist.js
JSONファイル (src/data/YYYY/videos_MM.json)
  ↓ scripts/export-to-microcms.js (任意)
microCMS
  ↓ API取得
Next.js アプリケーション
```

## 🔧 実装方針

### 1. データソースの抽象化

JSONファイルとmicroCMS APIの両方に対応できるように、統一されたインターフェースを用意します。

```typescript
// src/lib/data-source.ts
export type DataSource = 'json' | 'microcms';

export interface PlaylistData {
  year: number;
  month: number | string;
  yearMonth: string;
  videos: VideoItem[];
}

export interface DataSourceAdapter {
  getLatestPlaylist(): Promise<PlaylistData | null>;
  getPlaylistByYearMonth(year: number, month: number | string): Promise<PlaylistData | null>;
  getAvailableYearMonths(): Promise<Array<{ year: number; month: string }>>;
}
```

### 2. 環境変数で切り替え

```env
# .env.local
DATA_SOURCE=json  # または 'microcms'

# microCMS設定（microCMS使用時のみ）
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

### 3. JSONファイル方式（デフォルト・推奨）

現在の実装を維持します：

```typescript
// src/lib/data-sources/json-source.ts
import { VideoItem } from '@/types/video';

export class JsonDataSource implements DataSourceAdapter {
  async getLatestPlaylist(): Promise<PlaylistData | null> {
    // 既存の実装（src/app/page.tsx のロジック）
    const playlist = await import('@/data/2025/videos_09.json');
    return {
      year: 2025,
      month: 9,
      yearMonth: '2025.09',
      videos: playlist.default as VideoItem[]
    };
  }
  
  // ... 他のメソッド
}
```

### 4. microCMS方式（オプション）

必要に応じて実装：

```typescript
// src/lib/data-sources/microcms-source.ts
import { microcms } from '@/lib/microcms';

export class MicroCMSDataSource implements DataSourceAdapter {
  async getLatestPlaylist(): Promise<PlaylistData | null> {
    const response = await microcms.get({
      endpoint: 'playlists',
      queries: {
        limit: 1,
        orders: '-publishedAt',
      },
    });
    // ...
  }
}
```

### 5. ファクトリーパターン

```typescript
// src/lib/data-source-factory.ts
import { DataSourceAdapter } from './data-source';
import { JsonDataSource } from './data-sources/json-source';
import { MicroCMSDataSource } from './data-sources/microcms-source';

export function createDataSource(): DataSourceAdapter {
  const source = process.env.DATA_SOURCE || 'json';
  
  switch (source) {
    case 'microcms':
      return new MicroCMSDataSource();
    case 'json':
    default:
      return new JsonDataSource();
  }
}
```

## 📝 JSON → microCMS エクスポートスクリプト（任意）

既存のJSONファイルをmicroCMSにエクスポートするスクリプトを作成します。

```javascript
// scripts/export-json-to-microcms.js
// 既存のJSONファイルをmicroCMSにエクスポート
// 実行は任意（JSONファイルがメイン）
```

## ✅ メリット

### JSONファイル方式（推奨）

- ✅ 既存のワークフローを維持
- ✅ マイリストから直接JSON生成可能
- ✅ バージョン管理しやすい（Git）
- ✅ デプロイ時に自動的に含まれる
- ✅ API呼び出し不要（高速）
- ✅ コストなし

### microCMS方式（オプション）

- ✅ 非エンジニアでも編集可能
- ✅ Web UIで管理
- ✅ 動的な更新（再デプロイ不要）
- ⚠️ 月額費用がかかる
- ⚠️ API呼び出しが必要

## 🚀 実装ステップ

### Phase 1: 現状維持（推奨）

1. 現在のJSONファイル方式を維持
2. `scripts/fetch-mylist.js`で継続的にJSON生成
3. 既存のコードは変更不要

### Phase 2: 抽象化レイヤーの追加（将来）

1. `DataSourceAdapter`インターフェースを定義
2. `JsonDataSource`を実装（既存ロジックをラップ）
3. 環境変数で切り替え可能にする

### Phase 3: microCMS統合（任意）

1. microCMS設定を完了
2. `MicroCMSDataSource`を実装
3. `export-json-to-microcms.js`でJSONをエクスポート
4. 環境変数で`DATA_SOURCE=microcms`に切り替え

## 📋 推奨アプローチ

**現在はJSONファイル方式を維持し、必要になった時点でmicroCMSに移行**することを推奨します。

### 理由

1. **コスト効率**: microCMSは月額費用がかかる（無料プランは制限あり）
2. **ワークフロー**: マイリストからの自動生成が既に機能している
3. **パフォーマンス**: JSONファイルはビルド時に含まれるため高速
4. **柔軟性**: いつでもmicroCMSに移行可能

### 移行のタイミング

以下の場合にmicroCMSへの移行を検討：

- 非エンジニアが直接コンテンツを編集する必要が出てきた
- 動的な更新（再デプロイなし）が必要になった
- 他のコンテンツ（お知らせ、アーティスト情報など）も管理したい

## 🔄 JSON → microCMS 移行手順（将来）

1. microCMSでAPIスキーマを設定
2. `scripts/export-json-to-microcms.js`を実行
3. データの整合性を確認
4. `.env.local`で`DATA_SOURCE=microcms`に設定
5. アプリケーションがmicroCMSからデータを取得することを確認
6. （オプション）JSONファイルを削除

---

**結論**: 現在のJSONファイル方式を維持し、microCMSは「将来の選択肢」として残しておく設計が最適です。

