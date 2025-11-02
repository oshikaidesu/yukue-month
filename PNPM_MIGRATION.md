# pnpmへの移行完了

プロジェクトをpnpmに統一しました。

## ✅ 実行した作業

1. ✅ pnpmをグローバルインストール
2. ✅ `package-lock.json`を削除（npm用）
3. ✅ `yarn.lock`を削除（yarn用）
4. ✅ `pnpm install`で依存関係を再インストール

## 📦 pnpmの使用方法

### 基本的なコマンド

```bash
# 依存関係のインストール
pnpm install

# パッケージの追加
pnpm add <package-name>

# 開発依存関係の追加
pnpm add -D <package-name>

# パッケージの削除
pnpm remove <package-name>

# スクリプトの実行
pnpm run dev
pnpm run build
pnpm run lint
```

### npm/yarnとの対応表

| npm/yarn | pnpm |
|----------|------|
| `npm install` | `pnpm install` |
| `npm add <pkg>` | `pnpm add <pkg>` |
| `npm run <script>` | `pnpm run <script>` |
| `yarn add <pkg>` | `pnpm add <pkg>` |
| `yarn install` | `pnpm install` |

## 🔧 注意事項

### ビルドスクリプトの警告

一部のパッケージ（`sharp`、`aws-crt`など）はビルドスクリプトを実行する必要があります。
警告が出た場合は以下のコマンドで承認できます：

```bash
pnpm approve-builds
```

ただし、通常は自動で処理されるので、必要になるまで待って問題ありません。

### `.gitignore`の確認

`pnpm-lock.yaml`は**コミット対象**です（`package-lock.json`や`yarn.lock`と同様）。
`.gitignore`に含まれていないことを確認してください。

## 📝 プロジェクトの状態

- ✅ `pnpm-lock.yaml`が作成されました
- ✅ `node_modules`がpnpm形式で管理されています
- ✅ すべての依存関係が正常にインストールされました

## 🎯 次のステップ

今後は**pnpmのみ**を使用してください：

```bash
# 新しいパッケージを追加する場合
pnpm add microcms-js-sdk  # 既にインストール済み

# 開発サーバーを起動
pnpm run dev

# ビルド
pnpm run build
```

## 🔍 トラブルシューティング

### エラーが出る場合

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
pnpm install
```

### 他のパッケージマネージャーのロックファイルが復活した場合

```bash
# 削除してpnpmのみを使用
rm -f package-lock.json yarn.lock
```

