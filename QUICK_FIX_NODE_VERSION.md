# Cloudflare Pages Node.jsバージョン問題の緊急対処

## 現在の問題

まだNode.js 18.17.0が使用され、ビルドが失敗しています。

## 即座に試すべき対処法

### 1. Cloudflare Pagesダッシュボードでの設定確認

1. **設定** → **ビルドとデプロイ** を開く
2. **ビルド設定** セクションを確認：
   - **ビルドコマンド**: 現在の設定を確認
   - **Node.jsバージョン**: 直接指定できるオプションがあるか確認

### 2. 環境変数の再確認

**設定** → **環境変数** で以下を確認：
- `NODE_VERSION=20` が設定されているか
- **本番環境**と**プレビュー環境**の両方にチェックが入っているか

### 3. ビルドコマンドでNode.jsバージョンを強制指定

`package.json`の`build`スクリプトを変更して、ビルド前にNode.jsバージョンを確認・警告する方法：

```json
"build": "node -e \"require('process').version >= 'v20.0.0' || process.exit(1)\" && npm run optimize-thumbnails && next build"
```

ただし、これは環境が正しく設定されていない場合に失敗するだけです。

### 4. 最も確実な方法：ビルドコマンドをカスタマイズ

Cloudflare Pagesのビルドコマンドを変更：

**現在**: `npm run build`
**変更後**: `NODE_VERSION=20 npm run build`

または、`package.json`に新しいスクリプトを追加：

```json
"build:cloudflare": "NODE_VERSION=20 npm run build"
```

そして、Cloudflare Pagesのビルドコマンドを `npm run build:cloudflare` に変更。

### 5. nvmを使用したビルドコマンド（推奨）

Cloudflare Pagesのビルドコマンドを以下に変更：

```bash
source ~/.nvm/nvm.sh && nvm use 20 && npm run build
```

ただし、Cloudflare Pagesのビルド環境でnvmが使えるかは不明です。

## 推奨される解決手順

1. **Cloudflare Pagesダッシュボード**で環境変数 `NODE_VERSION=20` が正しく設定されているか再確認
2. 設定を保存後、**「デプロイ」タブ** → **「新しいデプロイを作成」**で手動トリガー
3. ビルドログの最初の部分でNode.jsのバージョンを確認
4. まだ18.17.0が使われている場合、Cloudflare Pagesのサポートに問い合わせを検討

## 代替案：Next.jsのバージョンをダウングレード（非推奨）

最後の手段として、Next.js 15.3.4をNext.js 14にダウングレードする方法もありますが、これは推奨しません。

