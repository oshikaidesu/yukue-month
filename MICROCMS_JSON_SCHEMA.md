# microCMS JSONスキーマ設計

既存のJSONファイル構造をそのまま保持し、microCMSで以下のような構造で返す設計です。

```json
{
  "year": 2025,
  "month": 9,
  "yearMonth": "2025.09",
  "videos": [
    {
      "id": "sm45362043",
      "title": "知りたいこと feat. 初音ミク, 重音テトSV, Jin",
      "url": "https://www.nicovideo.jp/watch/sm45362043",
      "artist": "Tobokegao",
      "thumbnail": "/thumbnails/sm45362043.jpg",
      "ogpThumbnailUrl": "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/..."
    }
  ]
}
```

## 📋 microCMS エンドポイント設定

### エンドポイント: `playlists`

#### フィールド構成

1. **`year`** (数値・整数・必須)
2. **`month`** (数値・整数・必須) ※特別な場合は文字列フィールドを追加
3. **`yearMonth`** (文字列・必須) - 表示用 "2025.09"
4. **`videos`** (カスタムフィールドグループ・繰り返し・必須) - 既存JSON配列と同じ構造

### `videos`カスタムフィールドグループの詳細

繰り返し可能なカスタムフィールドグループとして、以下の6つのフィールドを設定：

| フィールドID | 表示名 | タイプ | 必須 | 説明 |
|------------|--------|--------|------|------|
| `id` | 動画ID | 文字列（1行） | ✓ | `sm45362043` |
| `title` | タイトル | 文字列（1行） | ✓ | 動画タイトル |
| `url` | URL | 文字列（1行） | ✓ | 完全URL |
| `artist` | アーティスト名 | 文字列（1行） | ✓ | アーティスト名 |
| `thumbnail` | サムネイル画像パス | 文字列（1行） | - | `/thumbnails/xxx.jpg` |
| `ogpThumbnailUrl` | OGPサムネイルURL | 文字列（1行） | - | OGP画像URL |

## 🔄 JSONファイル → microCMS 登録スクリプト

既存のJSONファイルを読み込んで、microCMSに登録するスクリプトを作成しました。

### セットアップ

1. **環境変数の設定**

`.env.local`に以下を追加（書き込みAPIキーは一時的に使用）：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_WRITE_API_KEY=your-write-api-key  # 書き込み用（一時的）
```

**重要**: インポート完了後は`MICROCMS_WRITE_API_KEY`を削除して、読み取り専用APIキーのみ使用してください。

### 使用方法

#### 1. 単一ファイルのインポート

```bash
node scripts/import-json-to-microcms.js <JSONファイルパス> <年> <月>
```

**例**:
```bash
# 通常の月
node scripts/import-json-to-microcms.js src/data/2025/videos_09.json 2025 09

# 特別な月（文字列）
node scripts/import-json-to-microcms.js src/data/2025/videos_voca_winter.json 2025 voca_winter
```

#### 2. 一括インポート

指定した年のすべてのJSONファイルを一括でインポート：

```bash
node scripts/batch-import-to-microcms.js [年]
```

**例**:
```bash
# 2025年のすべてのJSONファイルをインポート
node scripts/batch-import-to-microcms.js 2025

# すべての年のJSONファイルをインポート
node scripts/batch-import-to-microcms.js
```

### スクリプトの動作

1. JSONファイルを読み込み
2. 既存のコンテンツをチェック（`yearMonth`で検索）
3. 既存がある場合は**更新**、ない場合は**作成**
4. videos配列をそのままmicroCMSに登録

### データ構造

スクリプトは、既存のJSONファイル構造をそのまま保持してmicroCMSに登録します：

**入力 (JSONファイル)**:
```json
[
  {
    "id": "sm45362043",
    "title": "...",
    "url": "...",
    "artist": "...",
    "thumbnail": "...",
    "ogpThumbnailUrl": "..."
  }
]
```

**microCMSでの保存**:
```json
{
  "year": 2025,
  "month": 9,
  "yearMonth": "2025.09",
  "videos": [
    {
      "id": "sm45362043",
      "title": "...",
      "url": "...",
      "artist": "...",
      "thumbnail": "...",
      "ogpThumbnailUrl": "..."
    }
  ]
}
```

### APIレスポンス例

microCMSから取得すると、以下のような構造で返ってきます：

```json
{
  "contents": [
    {
      "id": "xxx",
      "createdAt": "2025-01-XX...",
      "updatedAt": "2025-01-XX...",
      "publishedAt": "2025-09-01T00:00:00.000Z",
      "revisedAt": "2025-01-XX...",
      "year": 2025,
      "month": 9,
      "yearMonth": "2025.09",
      "videos": [
        {
          "id": "sm45362043",
          "title": "知りたいこと feat. 初音ミク, 重音テトSV, Jin",
          "url": "https://www.nicovideo.jp/watch/sm45362043",
          "artist": "Tobokegao",
          "thumbnail": "/thumbnails/sm45362043.jpg",
          "ogpThumbnailUrl": "https://img.cdn.nimg.jp/s/nicovideo/thumbnails/..."
        }
      ]
    }
  ]
}
```

### ワークフロー

1. **マイリストからJSON生成**（既存のワークフロー）
   ```bash
   node scripts/fetch-mylist.js <マイリストURL> src/data/2025/videos_09.json
   ```

2. **JSONをmicroCMSにインポート**（新しいステップ）
   ```bash
   node scripts/import-json-to-microcms.js src/data/2025/videos_09.json 2025 09
   ```

3. **Next.jsアプリでmicroCMSから取得**（実装後）

### 注意事項

- **既存コンテンツの更新**: 同じ`yearMonth`のコンテンツが既にある場合、更新されます
- **レート制限**: 一括インポート時は自動的に1秒待機します
- **エラーハンドリング**: エラーが発生しても処理は続行されます（一括インポート時）
- **APIキー**: インポート完了後は書き込みAPIキーを削除してください

