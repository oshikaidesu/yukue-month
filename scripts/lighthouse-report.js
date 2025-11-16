#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 Lighthouse CI テスト結果レポート\n');

// レポートディレクトリをチェック
const reportsDir = path.join(__dirname, '..', 'lighthouse-reports');
if (!fs.existsSync(reportsDir)) {
  console.log('❌ レポートディレクトリが見つかりません。');
  console.log('   まず `npm run lighthouse` を実行してください。');
  process.exit(1);
}

// 最新のレポートファイルを探す
const files = fs.readdirSync(reportsDir);
const manifestFile = files.find(file => file.includes('manifest.json'));

if (!manifestFile) {
  console.log('❌ レポートファイルが見つかりません。');
  process.exit(1);
}

try {
  const manifestPath = path.join(reportsDir, manifestFile);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log('🎯 テスト対象URL:');
  manifest.forEach((run, index) => {
    console.log(`   ${index + 1}. ${run.url}`);
  });
  
  console.log('\n📈 パフォーマンススコア:');
  manifest.forEach((run, index) => {
    const scores = run.summary;
    console.log(`\n   URL ${index + 1}: ${run.url}`);
    console.log(`   🚀 パフォーマンス: ${Math.round(scores.performance * 100)}/100`);
    console.log(`   ♿ アクセシビリティ: ${Math.round(scores.accessibility * 100)}/100`);
    console.log(`   🛠️  ベストプラクティス: ${Math.round(scores['best-practices'] * 100)}/100`);
    console.log(`   🔍 SEO: ${Math.round(scores.seo * 100)}/100`);
  });
  
  console.log('\n📁 詳細レポート:');
  console.log(`   ${reportsDir}`);
  console.log('\n💡 ヒント: ブラウザでHTMLレポートを開いて詳細を確認できます。');
  
} catch (error) {
  console.error('❌ レポートの読み込みに失敗しました:', error.message);
  process.exit(1);
}





