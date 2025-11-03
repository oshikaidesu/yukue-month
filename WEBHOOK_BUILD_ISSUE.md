# Webhook経由ビルドの問題と解決策

## 問題の状況

- ✅ wranglerでの直接デプロイは成功（Node.js 22.16.0）
- ✅ ローカルビルドは成功
- ❌ Webhook経由のビルドでNode.js 18.17.0が使われ、エラーが発生

## 原因の推測

Webhook経由のビルドでは、環境変数やビルド設定が正しく適用されていない可能性があります。

## 解決策

### 方法1: Cloudflare Pagesのビルド設定でNode.jsバージョンを指定

Cloudflare Pagesダッシュボードで、ビルド設定にNode.jsバージョンを直接指定できるオプションがあるか確認：

1. **設定** → **ビルドとデプロイ** → **ビルド設定**
2. **Node.jsバージョン**や**ランタイムバージョン**の指定オプションを探す
3. あれば`20`または`20.x`を指定

### 方法2: ビルドコマンドでNode.jsバージョンを強制指定

Cloudflare Pagesのビルドコマンドを変更：

**現在**: `npm run build` または `pnpm build`

**変更後**: 以下の中から選択：

#### オプションA: npxでNode.jsバージョンを指定
```
npx -p node@20 npm run build
```

#### オプションB: ビルドスクリプトを変更
`package.json`に新しいスクリプトを追加：

```json
"build:cloudflare": "NODE_VERSION=20 npm run optimize-thumbnails && NODE_VERSION=20 next build"
```

そして、Cloudflare Pagesのビルドコマンドを `npm run build:cloudflare` に変更。

#### オプションC: ビルド前チェックとエラー（推奨）
ビルド前にNode.jsバージョンをチェック：

```json
"build": "node -e \"process.exit(require('process').version < 'v20.0.0' ? 1 : 0)\" && npm run optimize-thumbnails && next build"
```

これにより、Node.js 20未満の場合にビルドが失敗し、問題を明確にできます。

### 方法3: .nvmrcファイルの確認

`.nvmrc`ファイルが正しく配置されているか確認：

```bash
cat .nvmrc
# 出力: 20
```

### 方法4: package.jsonのenginesフィールドでチェック

`package.json`の`engines`フィールドを確認：

```json
"engines": {
  "node": ">=20.0.0",
  "pnpm": ">=8.0.0"
}
```

### 方法5: Cloudflare Pagesのビルド設定ファイルを作成

プロジェクトルートに `_build.yml` または類似の設定ファイルを作成し、Node.jsバージョンを指定できるか確認。

## 推奨される対応

### ステップ1: Cloudflare Pagesダッシュボードでビルドコマンドを変更

1. **設定** → **ビルドとデプロイ** → **ビルドコマンド**
2. 現在の設定を確認（おそらく `npm run build` または `pnpm build`）
3. 以下に変更：

#### オプションA: 環境変数をビルドコマンドで指定（推奨）
```
NODE_VERSION=20 npm run build
```

#### オプションB: npxでNode.js 20を使用
```
npx -p node@20 npm run build
```

#### オプションC: カスタムビルドスクリプトを使用
`package.json`に`build:cloudflare`スクリプトを追加済みなので、ビルドコマンドを以下に変更：
```
npm run build:cloudflare
```

### ステップ2: 環境変数の再設定

**設定** → **環境変数**で以下を再確認：
- `NODE_VERSION=20` が設定されている
- **本番環境**と**プレビュー環境**の両方にチェック

### ステップ3: 新しいビルドをトリガー

- Cloudflare Pagesダッシュボード → **「デプロイ」**タブ → **「新しいデプロイを作成」**
- または、microCMSでコンテンツを更新してWebhookを送信

### ステップ4: ビルドログで確認

ビルドログの最初の部分で以下を確認：
```
node --version
v20.x.x  ← これが表示されればOK
```

もし `v18.17.0` が表示される場合は、ビルドコマンドの変更が反映されていません。

## デバッグ用ビルドコマンド

Node.jsバージョンをログに出力するビルドコマンド：

```bash
node --version && npm run build
```

これにより、どのNode.jsバージョンが使われているか明確になります。

