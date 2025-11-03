# microCMS Webhook × Cloudflare Pages 自動デプロイ設定

microCMSでコンテンツが更新されると、自動的にCloudflare Pagesを再ビルド・デプロイします。

## 設定手順

### 1. Cloudflare Pagesでデプロイフックを作成

**デプロイフック**とは、HTTP POSTリクエストを送信して新しいビルドをトリガーする一意のURLです。

1. [Cloudflareダッシュボード](https://dash.cloudflare.com)にログイン
2. **Workers & Pages** → **yukue-month** プロジェクトを選択
3. **設定** → **ビルドとデプロイ** を開く
4. **デプロイフック** セクションで **「デプロイフックを作成」** をクリック
5. 以下を設定：
   - **名前**: `microcms-webhook` (任意)
   - **ビルドするブランチ**: `main`
6. **保存** をクリック
7. 作成されたデプロイフックのURLをコピー
   - 例: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`
   - ⚠️ **このURLは一度しか表示されないため、必ずコピーしてください**

### 2. microCMSでWebhookを設定

1. [microCMS管理画面](https://app.microcms.io)にログイン
2. **yukuemonth** APIを選択
3. 左メニューから **「API設定」** → **「Webhook」** タブを開く
4. **「追加」** ボタンをクリック
5. 以下を設定：
   - **Webhook名**: `Cloudflare Pages自動デプロイ` (任意)
   - **Webhook URL**: 上記でコピーしたCloudflare PagesデプロイフックURLを貼り付け
   - **通知タイミング**: 
     - ✅ **コンテンツ公開時**
     - ✅ **コンテンツ更新時**
     - ❌ **コンテンツ削除時** (通常は不要)
6. **保存** をクリック

## 動作確認

1. microCMSで任意のコンテンツを更新または公開
2. Cloudflare Pagesダッシュボードの **「デプロイ」** タブを確認
3. 自動的に新しいビルドが開始されることを確認

## トラブルシューティング

### ビルドが開始されない場合

1. **Webhook URLの確認**
   - microCMSのWebhook設定でURLが正しく設定されているか確認
   - デプロイフックのURLを再確認
   - URLに誤字がないか確認
2. **ネットワークエラーの確認**
   - microCMSのWebhook送信ログにエラーが表示されていないか確認

### ビルドが失敗する場合

**Node.jsのバージョンエラー**
- エラー: `You are using Node.js 18.17.0. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required.`
- **原因**: Cloudflare Pagesのビルド環境でNode.jsのバージョンが正しく指定されていない

**解決策**: `.tool-versions`ファイルを使用してNode.jsバージョンを指定

Cloudflare Pagesは`.tool-versions`ファイルを使ってNode.jsのバージョンを指定します。
プロジェクトルートに`.tool-versions`ファイルを作成し、以下のいずれかを指定してください：

```
nodejs 18.17.1
```

または

```
nodejs 20.19.0
```

または

```
nodejs 22.16.0
```

⚠️ **重要**: Cloudflare Pagesで利用可能なバージョンは以下のとおりです：
- 14.21.3
- 16.20.2
- 18.17.1
- 20.19.0
- 22.16.0

最新バージョン（例: 23.6.0）は対応していない可能性があるため、上記のいずれかを指定してください。

参考: [Cloudflare Pages で node.js のバージョンエラーでビルドできなくなった話](https://zenn.dev/abebe123000/articles/713d1f724f0e68)

### セキュリティを強化したい場合

認証トークンを使った安全なWebhook連携が必要な場合は、以下のオプションを検討してください：
- Cloudflare WorkersでWebhookを受け取る中間エンドポイントを作成
- 認証トークンを検証してからCloudflare Pages APIを呼び出す

詳細は `MICROCMS_WEBHOOK_WORKER.md` を参照してください。
