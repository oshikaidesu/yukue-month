# microCMS Webhook用 Cloudflare Workers（認証付き）

セキュリティを強化したい場合、Cloudflare WorkersでWebhookを受け取り、認証後にCloudflare Pagesのビルドをトリガーする方法です。

## 前提条件

- Cloudflare Pagesプロジェクト名: `yukue-month`
- Cloudflare Account ID: `09ea9996e2032911d59d2a89b10e0778`
- Cloudflare API Token（後述）

## 1. Cloudflare API Tokenを取得

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/profile/api-tokens)にログイン
2. **「APIトークンを作成」** をクリック
3. 以下を設定：
   - **トークン名**: `Cloudflare Pages Deploy`
   - **権限**:
     - **Account** → **Cloudflare Pages** → **Edit** を選択
   - **アカウントリソース**: 対象アカウントを選択
4. **「続行してトークンを作成」** をクリック
5. 作成されたトークンをコピー（⚠️ このトークンは再表示できません）

## 2. WorkersでWebhookエンドポイントを作成

### 方法A: 既存のWorkersに追加（推奨）

既存の`nicovideo-ogp.js`にWebhookエンドポイントを追加します。

```javascript
// nicovideo-ogp.jsの最後に追加

// Webhookエンドポイント（microCMS → Cloudflare Pages）
app.post('/webhook/pages-deploy', async (c) => {
  // 認証トークンをチェック
  const authToken = c.req.header('Authorization')?.replace('Bearer ', '');
  const expectedToken = c.env?.WEBHOOK_SECRET_TOKEN || '';
  
  if (!expectedToken || authToken !== expectedToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Cloudflare Pages APIでビルドをトリガー
    const accountId = '09ea9996e2032911d59d2a89b10e0778';
    const projectName = 'yukue-month';
    const branch = 'main';

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: branch,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Pages API error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return c.json({
      success: true,
      deploymentId: result.result?.id,
      message: 'Deployment triggered successfully'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
```

### 方法B: 新しいWorkerとして作成

新しいWorkerファイルを作成します。

1. `workers/pages-webhook.js`を作成:

```javascript
import { Hono } from 'hono';

const app = new Hono();

// Webhookエンドポイント（microCMS → Cloudflare Pages）
app.post('/', async (c) => {
  // 認証トークンをチェック
  const authToken = c.req.header('Authorization')?.replace('Bearer ', '');
  const expectedToken = c.env?.WEBHOOK_SECRET_TOKEN || '';
  
  if (!expectedToken || authToken !== expectedToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Cloudflare Pages APIでビルドをトリガー
    const accountId = '09ea9996e2032911d59d2a89b10e0778';
    const projectName = 'yukue-month';
    const branch = 'main';

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branch: branch,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Pages API error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return c.json({
      success: true,
      deploymentId: result.result?.id,
      message: 'Deployment triggered successfully'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

export default app;
```

2. `workers/pages-webhook-wrangler.toml`を作成:

```toml
name = "pages-webhook"
main = "pages-webhook.js"
compatibility_date = "2025-07-09"
account_id = "09ea9996e2032911d59d2a89b10e0778"

[vars]
# 環境変数はwrangler secretコマンドで設定

[[rules]]
type = "ESModule"
globs = ["**/*.js"]
```

## 3. 環境変数を設定

Workersの環境変数を設定します：

```bash
cd workers

# Webhookの認証トークン（任意の文字列を生成）
# 例: openssl rand -hex 32
npx wrangler secret put WEBHOOK_SECRET_TOKEN

# Cloudflare API Token（上記で取得したトークン）
npx wrangler secret put CLOUDFLARE_API_TOKEN
```

## 4. Workersをデプロイ

```bash
cd workers
npx wrangler deploy
# または新しいWorkerの場合
npx wrangler deploy --config pages-webhook-wrangler.toml
```

## 5. microCMSでWebhookを設定

1. microCMS管理画面 → **「API設定」** → **「Webhook」**
2. **「追加」** をクリック
3. 以下を設定：
   - **Webhook URL**: `https://pages-webhook.YOUR-SUBDOMAIN.workers.dev` （または既存Workerの場合は`https://nicovideo-ogp.YOUR-SUBDOMAIN.workers.dev/webhook/pages-deploy`）
   - **カスタムヘッダー**:
     - **キー**: `Authorization`
     - **値**: `Bearer YOUR_WEBHOOK_SECRET_TOKEN` （上記で設定した値）
4. **保存**

## 注意事項

- **セキュリティ**: Webhook Secret Tokenは安全に管理してください
- **レート制限**: Cloudflare Pages APIにはレート制限があります。頻繁な更新には注意してください
- **エラーハンドリング**: エラーが発生した場合の通知設定を検討してください

## シンプルな方法（推奨）

セキュリティ要件が厳しくない場合は、**Cloudflare PagesデプロイフックURLを直接microCMSのWebhookに設定する方法**（`MICROCMS_WEBHOOK_SETUP.md`参照）が簡単です。

