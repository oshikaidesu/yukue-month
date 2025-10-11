#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Lighthouse CI テストを開始します...\n');

// プロジェクトのルートディレクトリ
const projectRoot = path.join(__dirname, '..');

// ビルドが存在するかチェック
const outDir = path.join(projectRoot, 'out');
if (!fs.existsSync(outDir)) {
  console.log('📦 静的サイトをビルドしています...');
  try {
    execSync('npm run build', { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });
    console.log('✅ ビルドが完了しました\n');
  } catch (error) {
    console.error('❌ ビルドに失敗しました:', error.message);
    process.exit(1);
  }
}

// Lighthouse CIを実行（サーバー管理はLighthouse CIに任せる）
console.log('🔍 Lighthouse CI テストを実行しています...');
console.log('   Lighthouse CIが自動的にサーバーを起動・管理します\n');

try {
  execSync('npx lhci autorun', { 
    cwd: projectRoot, 
    stdio: 'inherit' 
  });
  console.log('\n✅ Lighthouse CI テストが完了しました！');
} catch (error) {
  console.error('\n❌ Lighthouse CI テストに失敗しました:', error.message);
  process.exit(1);
}

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  console.log('\n🛑 テストを中断しています...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});
