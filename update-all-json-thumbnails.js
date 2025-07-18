const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// データディレクトリのパス
const DATA_DIR = './src/data';

// 特定のファイルのみを処理したい場合は以下のように変更
const SPECIFIC_FILE = './src/data/2024/videos_10.json';

// 処理済みファイルを記録
const processedFiles = new Set();

async function getThumbnailUrl(videoId, page, retryCount = 0) {
  console.log(`  📹 サムネイル取得中: ${videoId} (試行 ${retryCount + 1}/3)`);
  
  const videoUrl = `https://www.nicovideo.jp/watch/${videoId}`;
  
  try {
    await page.goto(videoUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 20000 
    });
    
    // 少し待機してページが完全に読み込まれるのを待つ
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // OGP画像URLを取得
    const ogpThumbnailUrl = await page.evaluate(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      return ogImage ? ogImage.getAttribute('content') : null;
    });
    
    if (ogpThumbnailUrl) {
      console.log(`  ✅ OGP画像URL取得成功: ${ogpThumbnailUrl.substring(0, 50)}...`);
      return ogpThumbnailUrl;
    } else {
      console.log(`  ⚠️ OGP画像URLが見つかりません`);
      return null;
    }
  } catch (error) {
    console.log(`  ❌ サムネイル取得失敗: ${error.message}`);
    
    // リトライロジック
    if (retryCount < 2) {
      console.log(`  🔄 リトライ中... (${retryCount + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return getThumbnailUrl(videoId, page, retryCount + 1);
    }
    
    return null;
  }
}

async function updateJsonFile(filePath, page) {
  console.log(`\n📁 ファイル処理中: ${filePath}`);
  
  try {
    // JSONファイルを読み込み
    const content = await fs.readFile(filePath, 'utf8');
    const videos = JSON.parse(content);
    
    let updatedCount = 0;
    let skippedCount = 0;
    const updatedVideos = [];
    
    for (const video of videos) {
      const videoId = video.id;
      
      // 既にOGPサムネイルURLがある場合はスキップ
      if (video.ogpThumbnailUrl) {
        console.log(`  ⏭️ 既にOGPサムネイルURLがあります: ${videoId}`);
        updatedVideos.push(video);
        skippedCount++;
        continue;
      }
      
      // OGPサムネイルURLを取得
      const ogpThumbnailUrl = await getThumbnailUrl(videoId, page);
      
      // 動画オブジェクトを更新
      const updatedVideo = {
        ...video,
        ogpThumbnailUrl: ogpThumbnailUrl
      };
      
      updatedVideos.push(updatedVideo);
      
      if (ogpThumbnailUrl) {
        updatedCount++;
      }
      
      // リクエスト間隔を空ける（サーバーに負荷をかけないため）
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // 更新されたJSONを保存
    await fs.writeFile(filePath, JSON.stringify(updatedVideos, null, 2), 'utf8');
    
    console.log(`  ✅ 更新完了: ${updatedCount}件のサムネイルURLを追加, ${skippedCount}件スキップ`);
    return { updatedCount, skippedCount };
    
  } catch (error) {
    console.error(`  ❌ ファイル処理エラー: ${error.message}`);
    return { updatedCount: 0, skippedCount: 0 };
  }
}

async function getAllJsonFiles(dir) {
  const files = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // 再帰的にサブディレクトリを探索
        const subFiles = await getAllJsonFiles(fullPath);
        files.push(...subFiles);
      } else if (item.name.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`ディレクトリ読み込みエラー: ${error.message}`);
  }
  
  return files;
}

async function main() {
  console.log('🚀 全JSONファイルOGPサムネイルURL追加スクリプト開始...');
  
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 1200, height: 800 },
      protocolTimeout: 60000,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    const page = await browser.newPage();
    
    // ページの設定を最適化
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // 全てのJSONファイルを取得
    const jsonFiles = await getAllJsonFiles(DATA_DIR);
    console.log(`📂 処理対象ファイル数: ${jsonFiles.length}`);
    
    let totalUpdated = 0;
    let totalSkipped = 0;
    let processedCount = 0;
    
    for (const filePath of jsonFiles) {
      try {
        console.log(`\n📊 進捗: ${processedCount + 1}/${jsonFiles.length}`);
        
        const result = await updateJsonFile(filePath, page);
        totalUpdated += result.updatedCount;
        totalSkipped += result.skippedCount;
        processedCount++;
        
        // ファイル間の待機時間
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ ファイル処理エラー (${filePath}): ${error.message}`);
        processedCount++;
        continue;
      }
    }
    
    console.log(`\n🎉 処理完了！`);
    console.log(`📊 合計 ${totalUpdated}件 のサムネイルURLを追加しました。`);
    console.log(`📊 合計 ${totalSkipped}件 をスキップしました。`);
    console.log(`📊 処理したファイル数: ${processedCount}/${jsonFiles.length}`);
    
  } catch (error) {
    console.error('❌ スクリプト実行中にエラーが発生:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// スクリプト実行
main().catch(console.error); 