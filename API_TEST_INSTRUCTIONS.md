# API動作確認の手順

## 🔍 現状確認

APIの実装は完了していますが、実際に動作させるには**環境変数の設定**が必要です。

## 📝 必要な設定

### 1. `.env.local`ファイルを作成

プロジェクトルートに`.env.local`ファイルを作成し、以下を設定してください：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-read-only-api-key
```

**取得方法**:
- **SERVICE_DOMAIN**: microCMS管理画面 → API設定 → サービスID（例: `yukue-month`）
- **API_KEY**: microCMS管理画面 → API設定 → APIキー → 読み取り専用APIキー

### 2. 動作確認

環境変数を設定したら、以下でテストできます：

```bash
node test-api.mjs
```

または、Next.jsの開発サーバーで直接使用：

```typescript
// src/app/test/page.tsx（一時的なテストページ）
import { getLatestPlaylist } from '@/lib/api/yukuemonth';

export default async function TestPage() {
  const playlist = await getLatestPlaylist();
  return <pre>{JSON.stringify(playlist, null, 2)}</pre>;
}
```

## ✅ 確認ポイント

環境変数が正しく設定されていれば：

1. ✅ `test-api.mjs`が成功する
2. ✅ Next.jsアプリでAPI関数が動作する
3. ✅ microCMSからデータが取得できる

## 🔧 実装状況

- ✅ **コード実装**: 完了
- ✅ **パッケージインストール**: 完了（`microcms-js-sdk`）
- ⏳ **環境変数設定**: 要設定（`.env.local`）
- ⏳ **動作確認**: 環境変数設定後

## 📋 次のステップ

1. `.env.local`に環境変数を設定
2. `node test-api.mjs`で動作確認
3. 実際のページでAPIを使用

**環境変数を設定すれば、すぐに使える状態です！**

