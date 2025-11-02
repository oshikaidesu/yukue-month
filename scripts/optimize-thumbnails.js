const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// 動画データを読み込む関数（年/月情報を含む）
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
        
        // ファイル名から年/月を抽出（例: videos_09.json -> 2025, 09）
        const monthMatch = file.match(/videos_(\d+)\.json$/);
        const month = monthMatch ? monthMatch[1] : null;
        
        // 各動画に年/月情報を追加
        const videosWithYearMonth = data.map(video => ({
          ...video,
          year: parseInt(year, 10),
          month: month,
          yearMonth: `${year}.${month || '01'}`,
        }));
        
        videos.push(...videosWithYearMonth);
      }
    } catch (error) {
      console.log(`Warning: Could not read ${year} directory:`, error.message);
    }
  }
  
  return videos;
}

// 画像をダウンロードして最適化する関数
async function downloadAndOptimizeThumbnail(video, outputBaseDir) {
  const { id, ogpThumbnailUrl, thumbnail, year, month, yearMonth } = video;
  
  // 優先順位: ogpThumbnailUrl > thumbnail
  const sourceUrl = ogpThumbnailUrl || thumbnail;
  
  if (!sourceUrl) {
    console.log(`No thumbnail URL for ${id}`);
    return false;
  }
  
  try {
    // 年/月ディレクトリを決定
    let yearMonthDir;
    if (year && month) {
      // 年/月形式（例: 2025/09）
      yearMonthDir = path.join(outputBaseDir, String(year), String(month).padStart(2, '0'));
    } else if (yearMonth) {
      // yearMonth形式（例: 2025.09）の場合は年/月に分割
      const [y, m] = yearMonth.split('.');
      if (y && m) {
        yearMonthDir = path.join(outputBaseDir, y, m.padStart(2, '0'));
      } else {
        // フォールバック: ルートディレクトリ
        yearMonthDir = outputBaseDir;
      }
    } else {
      // フォールバック: ルートディレクトリ
      yearMonthDir = outputBaseDir;
    }
    
    // ディレクトリを作成
    await fs.mkdir(yearMonthDir, { recursive: true });
    
    console.log(`Downloading thumbnail for ${id} (${yearMonth || 'unknown'})...`);
    
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
      const outputPath = path.join(yearMonthDir, `${id}${size.suffix}.webp`);
      
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
      
      console.log(`  Generated: ${yearMonthDir.replace(outputBaseDir, '')}/${id}${size.suffix}.webp (${size.width}x${size.height})`);
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
