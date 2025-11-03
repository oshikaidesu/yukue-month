# microCMS Webhook × Cloudflare Pages 自動デプロイ設定

microCMSでコンテンツが更新されると、自動的にCloudflare Pagesを再ビルド・デプロイします。

## 設定手順

### 1. Cloudflare Pagesでデプロイフックを作成

1. [Cloudflareダッシュボード](https://dash.cloudflare.com)にログイン
2. **Workers & Pages** → **yukue-month** プロジェクトを選択
3. **設定** → **ビルドとデプロイ** を開く
4. **デプロイフック** セクションで **「デプロイフックを作成」** をクリック
5. 以下を設定：
   - **名前**: `microcms-webhook` (任意)
   - **ビルドするブランチ**: `main`
6. **保存** をクリック
7. 作成されたデプロイフックのURLをコピー（例: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/...`）

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

1. **microCMSのWebhook送信ログを確認**
   - microCMS管理画面 → **「API設定」** → **「Webhook」** → 送信履歴を確認
2. **Cloudflare PagesのデプロイフックURLが正しいか確認**
   - デプロイフックのURLを再確認
   - URLに誤字がないか確認
3. **ネットワークエラーの確認**
   - microCMSのWebhook送信ログにエラーが表示されていないか確認

### セキュリティを強化したい場合

認証トークンを使った安全なWebhook連携が必要な場合は、以下のオプションを検討してください：

- Cloudflare WorkersでWebhookを受け取る中間エンドポイントを作成
- 認証トークンを検証してからCloudflare Pages APIを呼び出す

詳細は `MICROCMS_WEBHOOK_WORKER.md` を参照してください。

