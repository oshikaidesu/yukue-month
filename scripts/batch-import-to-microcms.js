/**
 * 複数のJSONファイルを一括でmicroCMSにインポートするスクリプト
 * 
 * 使用方法:
 *   node scripts/batch-import-to-microcms.js [年]
 * 
 * 例:
 *   node scripts/batch-import-to-microcms.js 2025  # 2025年のすべてのJSONファイルをインポート
 *   node scripts/batch-import-to-microcms.js       # すべての年のJSONファイルをインポート
 */

const fs = require('fs');
const path = require('path');
const { readJsonFile, generateYearMonth } = require('./import-json-to-microcms');

// 環境変数の読み込み（dotenvがあれば使用）
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenvがない場合は環境変数が既に設定されていることを前提とする
}

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const WRITE_API_KEY = process.env.MICROCMS_WRITE_API_KEY;

if (!SERVICE_DOMAIN || !WRITE_API_KEY) {
  console.error('❌ 環境変数が設定されていません');
  console.error('以下を .env.local に設定してください:');
  console.error('  MICROCMS_SERVICE_DOMAIN=your-service-domain');
  console.error('  MICROCMS_WRITE_API_KEY=your-write-api-key');
  process.exit(1);
}

/**
 * 年月を抽出する関数
 */
function extractYearMonth(filePath) {
  // src/data/2025/videos_09.json -> { year: 2025, month: '09' }
  // src/data/2025/videos_voca_winter.json -> { year: 2025, month: 'voca_winter' }
  const match = filePath.match(/(\d{4})\/videos_(\d{2}|[a-z_]+)\.json$/);
  if (match) {
    const year = parseInt(match[1], 10);
    const monthStr = match[2];
    const month = /^\d{2}$/.test(monthStr) ? parseInt(monthStr, 10) : monthStr;
    return {
      year,
      month,
      yearMonth: generateYearMonth(year, month),
      filePath
    };
  }
  return null;
}

/**
 * 指定された年のJSONファイルをすべて検索
 */
function findJsonFiles(targetYear = null) {
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const files = [];

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ データディレクトリが見つかりません: ${dataDir}`);
    return files;
  }

  const years = fs.readdirSync(dataDir).filter(item => {
    const yearPath = path.join(dataDir, item);
    return fs.statSync(yearPath).isDirectory() && /^\d{4}$/.test(item);
  });

  for (const year of years) {
    const yearNum = parseInt(year, 10);
    if (targetYear && yearNum !== targetYear) {
      continue;
    }

    const yearPath = path.join(dataDir, year);
    const jsonFiles = fs.readdirSync(yearPath)
      .filter(f => f.startsWith('videos_') && f.endsWith('.json'))
      .map(f => path.join(yearPath, f));

    for (const filePath of jsonFiles) {
      const info = extractYearMonth(filePath);
      if (info) {
        files.push(info);
      }
    }
  }

  return files.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (typeof a.month === 'number' && typeof b.month === 'number') {
      return a.month - b.month;
    }
    return String(a.month).localeCompare(String(b.month));
  });
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const targetYear = args[0] ? parseInt(args[0], 10) : null;

  if (targetYear && isNaN(targetYear)) {
    console.error('❌ 年は数値である必要があります');
    process.exit(1);
  }

  console.log('\n📂 JSONファイルを検索中...');
  const files = findJsonFiles(targetYear);

  if (files.length === 0) {
    console.log('⚠️  インポート対象のJSONファイルが見つかりませんでした');
    process.exit(0);
  }

  console.log(`✓ ${files.length}個のJSONファイルが見つかりました:\n`);
  files.forEach(({ filePath, yearMonth }) => {
    console.log(`  - ${filePath} (${yearMonth})`);
  });

  console.log('\n🚀 インポートを開始します...\n');

  const { spawn } = require('child_process');
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const relativePath = path.relative(path.join(__dirname, '..'), file.filePath);
    const monthArg = typeof file.month === 'number' 
      ? file.month.toString().padStart(2, '0')
      : file.month;

    console.log(`\n📤 処理中: ${file.yearMonth}...`);

    await new Promise((resolve) => {
      const child = spawn(
        'node',
        [
          path.join(__dirname, 'import-json-to-microcms.js'),
          relativePath,
          file.year.toString(),
          monthArg
        ],
        {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        }
      );

      child.on('close', (code) => {
        if (code === 0) {
          successCount++;
        } else {
          errorCount++;
        }
        resolve();
      });
    });

    // レート制限対策（1秒待機）
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ 完了: ${successCount}件成功, ${errorCount}件失敗`);
  console.log('='.repeat(50) + '\n');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ 処理に失敗しました:', error?.message || error);
    process.exit(1);
  });
}

