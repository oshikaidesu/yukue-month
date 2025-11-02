/**
 * 既存のJSONファイルをmicroCMSにインポートするスクリプト
 * 
 * 使用方法:
 *   node scripts/import-json-to-microcms.js <JSONファイルパス> <年> <月>
 * 
 * 例:
 *   node scripts/import-json-to-microcms.js src/data/2025/videos_09.json 2025 09
 *   node scripts/import-json-to-microcms.js src/data/2025/videos_voca_winter.json 2025 voca_winter
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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
 * JSONファイルを読み込む
 */
function readJsonFile(filePath) {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`ファイルが見つかりません: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const json = JSON.parse(content);
    
    if (!Array.isArray(json)) {
      throw new Error('JSONは配列形式である必要があります');
    }

    return json;
  } catch (error) {
    console.error(`❌ JSONファイル読み込みエラー: ${error.message}`);
    throw error;
  }
}

/**
 * 年月からyearMonth文字列を生成
 */
function generateYearMonth(year, month) {
  if (typeof month === 'number') {
    return `${year}.${month.toString().padStart(2, '0')}`;
  }
  return `${year}.${month}`; // "voca_winter" などの場合
}

/**
 * microCMSにデータを送信（作成）
 */
function createInMicroCMS(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: `${SERVICE_DOMAIN}.microcms.io`,
      port: 443,
      path: '/api/v1/playlists',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-MICROCMS-API-KEY': WRITE_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ 作成成功: ${data.yearMonth}`);
          resolve(JSON.parse(responseData));
        } else {
          console.error(`❌ エラー (HTTP ${res.statusCode}): ${data.yearMonth}`);
          console.error(responseData);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ リクエストエラー: ${data.yearMonth}`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * microCMSにデータを送信（更新）
 */
function updateInMicroCMS(contentId, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: `${SERVICE_DOMAIN}.microcms.io`,
      port: 443,
      path: `/api/v1/playlists/${contentId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-MICROCMS-API-KEY': WRITE_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ 更新成功: ${data.yearMonth}`);
          resolve(JSON.parse(responseData));
        } else {
          console.error(`❌ エラー (HTTP ${res.statusCode}): ${data.yearMonth}`);
          console.error(responseData);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ リクエストエラー: ${data.yearMonth}`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 既存のコンテンツを検索（yearMonthで）
 */
function findExistingContent(yearMonth) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${SERVICE_DOMAIN}.microcms.io`,
      port: 443,
      path: `/api/v1/playlists?filters=yearMonth[equals]${encodeURIComponent(yearMonth)}&limit=1`,
      method: 'GET',
      headers: {
        'X-MICROCMS-API-KEY': WRITE_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const result = JSON.parse(responseData);
          if (result.contents && result.contents.length > 0) {
            resolve(result.contents[0]);
          } else {
            resolve(null);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log('使用方法:');
    console.log('  node scripts/import-json-to-microcms.js <JSONファイルパス> <年> <月>');
    console.log('');
    console.log('例:');
    console.log('  node scripts/import-json-to-microcms.js src/data/2025/videos_09.json 2025 09');
    console.log('  node scripts/import-json-to-microcms.js src/data/2025/videos_voca_winter.json 2025 voca_winter');
    process.exit(1);
  }

  const [jsonFilePath, yearStr, monthStr] = args;
  const year = parseInt(yearStr, 10);
  const month = isNaN(parseInt(monthStr, 10)) ? monthStr : parseInt(monthStr, 10);
  const yearMonth = generateYearMonth(year, month);

  console.log(`\n📂 JSONファイルを読み込み中: ${jsonFilePath}`);
  const videos = readJsonFile(jsonFilePath);
  console.log(`✓ ${videos.length}件の動画データを読み込みました`);

  // データ検証
  if (videos.length === 0) {
    console.warn('⚠️  動画データが空です');
  }

  // 既存コンテンツをチェック
  console.log(`\n🔍 既存コンテンツを確認中: ${yearMonth}`);
  let existingContent = null;
  try {
    existingContent = await findExistingContent(yearMonth);
  } catch (error) {
    console.warn(`⚠️  既存コンテンツの検索に失敗しましたが、続行します: ${error.message}`);
  }

  // microCMSデータ構造に変換
  const playlistData = {
    year: year,
    month: month,
    yearMonth: yearMonth,
    videos: videos,
    publishedAt: new Date().toISOString()
  };

  // 既存コンテンツがある場合は更新、ない場合は作成
  if (existingContent) {
    console.log(`\n📝 既存コンテンツを更新中...`);
    console.log(`   コンテンツID: ${existingContent.id}`);
    try {
      await updateInMicroCMS(existingContent.id, playlistData);
      console.log(`\n✅ 完了！既存のコンテンツを更新しました。`);
    } catch (error) {
      console.error(`\n❌ 更新に失敗しました:`, error.message);
      process.exit(1);
    }
  } else {
    console.log(`\n📤 新規コンテンツを作成中...`);
    try {
      await createInMicroCMS(playlistData);
      console.log(`\n✅ 完了！新しいコンテンツを作成しました。`);
    } catch (error) {
      console.error(`\n❌ 作成に失敗しました:`, error.message);
      process.exit(1);
    }
  }

  console.log(`\n📊 統計:`);
  console.log(`   年月: ${yearMonth}`);
  console.log(`   動画数: ${videos.length}`);
}

// 実行
if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ 処理に失敗しました:', error?.message || error);
    process.exit(1);
  });
}

module.exports = { readJsonFile, generateYearMonth };

