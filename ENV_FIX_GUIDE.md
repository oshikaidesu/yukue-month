# 環境変数の設定修正ガイド

## 🔍 問題

エラーログを見ると、URLが二重になっています：

```
📍 接続先URL: https://https://eu5h4juwrg.microcms.io/api/v1/yukuemonth.microcms.io/api/v1/yukuemonth
```

これは`.env.local`の設定が間違っている可能性があります。

## ✅ 正しい設定

`.env.local`ファイルは以下のように設定してください：

```env
MICROCMS_SERVICE_DOMAIN=eu5h4juwrg
MICROCMS_API_KEY=wTcKgxlAxk...
```

**重要**:
- ❌ **間違い**: `MICROCMS_SERVICE_DOMAIN=https://eu5h4juwrg.microcms.io/api/v1/yukuemonth`
- ✅ **正しい**: `MICROCMS_SERVICE_DOMAIN=eu5h4juwrg`

`MICROCMS_SERVICE_DOMAIN`には**サービスIDのみ**を設定してください。
- `https://`は不要
- `.microcms.io`は不要
- `/api/v1/yukuemonth`は不要（エンドポイント名は別途指定）

## 🔧 修正手順

1. `.env.local`ファイルを開く
2. `MICROCMS_SERVICE_DOMAIN`の値を確認
3. 完全なURLではなく、サービスIDのみにする

例：
```env
# 修正前（間違い）
MICROCMS_SERVICE_DOMAIN=https://eu5h4juwrg.microcms.io/api/v1/yukuemonth

# 修正後（正しい）
MICROCMS_SERVICE_DOMAIN=eu5h4juwrg
```

## 📝 サービスIDの確認方法

microCMS管理画面で確認：
1. 管理画面にログイン
2. 「API設定」→「APIの詳細」
3. API URLを見る：`https://eu5h4juwrg.microcms.io/api/v1/yukuemonth`
4. **サービスIDは `eu5h4juwrg` の部分**

修正後、再度テストを実行してください：
```bash
node test-api-debug.mjs
```

