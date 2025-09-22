const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// 動画データを読み込む関数
async function loadVideoData() {
  const dataDir = path.join(__dirname, '../src/data');
  const years = ['2024', '2025'];
  const videos = [];
  
  for (const year of years) {
    const yearDir = path.join(dataDir, year);
    try {
      const files = await fs.readdir(yearDir);
      const jsonFiles = files.filter(file => file.endsWith('.json') && file.startsWith('videos_'));
      
      for (const file of jsonFiles) {
        const filePath = path.join(yearDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);
        videos.push(...data);
      }
    } catch (error) {
      console.log(`Warning: Could not read ${year} directory:`, error.message);
    }
  }
  
  return videos;
}

// 画像をダウンロードして最適化する関数
async function downloadAndOptimizeThumbnail(video, outputDir) {
  const { id, ogpThumbnailUrl, thumbnail } = video;
  
  // 優先順位: ogpThumbnailUrl > thumbnail
  const sourceUrl = ogpThumbnailUrl || thumbnail;
  
  if (!sourceUrl) {
    console.log(`No thumbnail URL for ${id}`);
    return false;
  }
  
  try {
    console.log(`Downloading thumbnail for ${id}...`);
    
    // 画像をダウンロード
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    // 複数サイズで最適化
    const sizes = [
      { width: 160, height: 90, suffix: '_sm', quality: 80 },
      { width: 320, height: 180, suffix: '_md', quality: 85 },
      { width: 640, height: 360, suffix: '_lg', quality: 90 }
    ];
    
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${id}${size.suffix}.webp`);
      
      await sharp(Buffer.from(buffer))
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ 
          quality: size.quality,
          effort: 6 // 最高品質
        })
        .toFile(outputPath);
      
      console.log(`  Generated: ${id}${size.suffix}.webp (${size.width}x${size.height})`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing ${id}:`, error.message);
    return false;
  }
}

// メイン処理
async function main() {
  console.log('🚀 Starting thumbnail optimization...');
  
  // 出力ディレクトリを作成
  const outputDir = path.join(__dirname, '../public/thumbnails');
  await fs.mkdir(outputDir, { recursive: true });
  
  // 動画データを読み込み
  const videos = await loadVideoData();
  console.log(`📊 Found ${videos.length} videos`);
  
  // 並列処理で画像を最適化（同時実行数を制限）
  const concurrency = 5;
  const results = [];
  
  for (let i = 0; i < videos.length; i += concurrency) {
    const batch = videos.slice(i, i + concurrency);
    const batchPromises = batch.map(video => downloadAndOptimizeThumbnail(video, outputDir));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    console.log(`Progress: ${Math.min(i + concurrency, videos.length)}/${videos.length}`);
  }
  
  const successCount = results.filter(Boolean).length;
  const totalCount = results.length;
  
  console.log(`✅ Optimization complete!`);
  console.log(`📈 Success: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  
  // 統計情報を出力
  try {
    const files = await fs.readdir(outputDir);
    const webpFiles = files.filter(file => file.endsWith('.webp'));
    console.log(`📁 Generated ${webpFiles.length} optimized images`);
  } catch (error) {
    console.log('Could not count generated files:', error.message);
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { downloadAndOptimizeThumbnail, loadVideoData };
