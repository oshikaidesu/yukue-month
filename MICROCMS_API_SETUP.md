# microCMS API で必要な情報

microCMS APIを呼び出すために必要な情報は**2つだけ**です。

## 🔑 必要な情報

### 1. サービスドメイン（Service Domain）

microCMSの管理画面で確認できます。

**取得方法**:
1. microCMS管理画面にログイン
2. 左サイドバーの「API設定」→「APIの詳細」を開く
3. **API URL**の部分を確認

例: `https://yukue-month.microcms.io/api/v1/yukuemonth`
→ サービスドメインは `yukue-month` の部分

### 2. APIキー（読み取り専用）

**取得方法**:
1. microCMS管理画面にログイン
2. 「API設定」→「APIキー」を開く
3. **読み取り専用APIキー**をコピー

⚠️ **重要**: 本番環境では**読み取り専用APIキー**を使用してください。
書き込みAPIキーは開発時のみ使用し、本番では削除してください。

## 🔧 環境変数の設定

`.env.local`ファイルに以下を設定：

```env
MICROCMS_SERVICE_DOMAIN=yukue-month
MICROCMS_API_KEY=your-read-only-api-key-here
```

**注意**: 
- `MICROCMS_SERVICE_DOMAIN`は**サービスIDのみ**（`.microcms.io`は含めない）
- `MICROCMS_API_KEY`は**読み取り専用APIキー**

## 📝 実際の使い方

### SDKを使う場合（推奨）

```typescript
import { microcms } from '@/lib/microcms';

// SDKが自動的に以下を設定：
// - URL: https://${SERVICE_DOMAIN}.microcms.io/api/v1/yukuemonth
// - Header: X-MICROCMS-API-KEY: ${API_KEY}
const response = await microcms.get({
  endpoint: 'yukuemonth',
});
```

### 手動でfetchを使う場合

```typescript
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN; // "yukue-month"
const API_KEY = process.env.MICROCMS_API_KEY; // "your-api-key"

// URLを組み立て
const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/yukuemonth`;

// fetchで取得（HeadersにAPIキーを含める）
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'X-MICROCMS-API-KEY': API_KEY, // ← ここにAPIキーを設定
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

## 🔍 Headersで送信される情報

実際にHTTPリクエストで送信されるHeaders：

```
GET https://yukue-month.microcms.io/api/v1/yukuemonth
Headers:
  X-MICROCMS-API-KEY: your-read-only-api-key-here
  Content-Type: application/json
```

**必須**: `X-MICROCMS-API-KEY` のみです。

## ✅ チェックリスト

- [ ] microCMS管理画面でサービスドメインを確認
- [ ] 読み取り専用APIキーを取得
- [ ] `.env.local`に`MICROCMS_SERVICE_DOMAIN`を設定
- [ ] `.env.local`に`MICROCMS_API_KEY`を設定
- [ ] サーバーを再起動（環境変数の変更を反映）

## 🧪 動作確認

以下のコードで動作確認できます：

```typescript
import { microcms } from '@/lib/microcms';

microcms
  .get({
    endpoint: 'yukuemonth',
  })
  .then((res) => {
    console.log('成功:', res);
    console.log('件数:', res.totalCount);
    console.log('コンテンツ:', res.contents);
  })
  .catch((err) => {
    console.error('エラー:', err);
    // APIキーが間違っている場合、ここでエラーが出ます
  });
```

## ❌ よくあるエラー

### エラー: `MICROCMS_SERVICE_DOMAIN is not set`

→ `.env.local`に環境変数が設定されていない、またはサーバーを再起動していない

### エラー: `401 Unauthorized`

→ APIキーが間違っている、または読み取り専用APIキーではない

### エラー: `404 Not Found`

→ サービスドメインが間違っている、またはエンドポイント名が間違っている

## 📚 まとめ

必要な情報は**2つだけ**：

1. **サービスドメイン**: `yukue-month`（例）
2. **APIキー**: 読み取り専用APIキー

これらを環境変数に設定すれば、自動的にHeadersに含まれてAPIリクエストが送信されます！

