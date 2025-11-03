# Cloudflare Pages Node.jsバージョン設定

## 問題

ビルドエラー: `You are using Node.js 18.17.0. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required.`

## 原因

Cloudflare Pagesのビルド環境でNode.js 18.17.0が使用されているが、Next.js 15.3.4にはNode.js 20以上が必要です。

## 解決方法

### 方法1: 環境変数で指定（推奨・必須）

Cloudflare Pagesダッシュボードで環境変数を設定します：

1. [Cloudflareダッシュボード](https://dash.cloudflare.com)にログイン
2. **Workers & Pages** → **yukue-month** プロジェクトを選択
3. **設定** → **環境変数** を開く
4. **変数を追加** をクリック
5. 以下を設定：
   - **変数名**: `NODE_VERSION`
   - **値**: `20`
   - **環境**: **本番環境** と **プレビュー環境** の両方にチェック
6. **保存** をクリック

⚠️ **重要**: 
1. `.node-version`ファイルがある場合は削除してください（`.nvmrc`と競合する可能性があります）
2. 環境変数を設定した後、**一度新しいデプロイを手動でトリガー**してください
   - 設定画面の **「デプロイ」** タブ → **「新しいデプロイを作成」** または
   - GitHubにプッシュして新しいビルドをトリガー
3. 環境変数の変更は既存のビルドには反映されません

## 確認手順

環境変数を設定し、新しいビルドをトリガーした後、ビルドログで以下を確認：

```
✓ Using Node.js version 20.x.x
```

これが表示されれば、Node.js 20が使用されています。

### 方法2: .nvmrcファイル（補助的な方法）

プロジェクトルートに `.nvmrc` ファイルを作成し、`20` を記述しました。
ただし、Cloudflare Pagesでは環境変数 `NODE_VERSION` の設定が必要です。

### 方法3: package.jsonのenginesフィールド（補助的な方法）

`package.json` に `engines` フィールドを追加しました：
```json
"engines": {
  "node": ">=20.0.0",
  "pnpm": ">=8.0.0"
}
```

## 設定後の確認

1. 環境変数を設定した後、microCMSでコンテンツを更新してWebhookを送信
2. Cloudflare Pagesダッシュボードの **「デプロイ」** タブで新しいビルドが開始されることを確認
3. ビルドログでNode.jsのバージョンが20になっていることを確認

## 注意事項

- 環境変数 `NODE_VERSION=20` の設定は**必須**です
- `.nvmrc` や `package.json` の `engines` だけでは不十分な場合があります
- 設定後、次のビルドから有効になります

