const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// microCMSからプレイリストを取得して動画配列に展開
async function loadVideoDataFromCMS() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain || !apiKey) {
    return null;
  }
  const endpointBase = `https://${serviceDomain}.microcms.io/api/v1/yukuemonth`;
  const allVideos = [];
  let offset = 0;
  const limit = 100;
  // 可能な限り少ないフィールドだけ取得（video は文字列/配列混在想定）
  const fields = [
    'id',
    'year',
    'month',
    'visual',
    'video',
    'videos',
    'publishedAt',
    'updatedAt',
  ].join(',');
  while (true) {
    const url = `${endpointBase}?limit=${limit}&offset=${offset}&orders=-updatedAt&fields=${encodeURIComponent(fields)}`;
    const res = await fetch(url, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`microCMS fetch failed: ${res.status} ${res.statusText} ${text}`);
    }
    const data = await res.json();
    const contents = Array.isArray(data.contents) ? data.contents : [];
    if (contents.length === 0) break;
    for (const content of contents) {
      // year, month, yearMonth を決定
      const year =
        typeof content.year === 'number'
          ? content.year
          : typeof content.year === 'string'
          ? parseInt(content.year, 10)
          : undefined;
      const monthRaw = content.month;
      const month =
        typeof monthRaw === 'number'
          ? String(monthRaw).padStart(2, '0')
          : typeof monthRaw === 'string'
          ? monthRaw
          : undefined;
      const yearMonth =
        typeof content.visual === 'string' && content.visual.includes('.')
          ? content.visual
          : year && month
          ? `${year}.${String(month).padStart(2, '0')}`
          : undefined;
      // videos 配列を抽出（文字列JSON / 配列 / videos配列）
      let videosField = content.video;
      if (typeof videosField === 'string') {
        try {
          videosField = JSON.parse(videosField);
        } catch {
          videosField = [];
        }
      }
      if (!Array.isArray(videosField) && Array.isArray(content.videos)) {
        videosField = content.videos;
      }
      const videos = Array.isArray(videosField) ? videosField : [];
      for (const v of videos) {
        if (!v || typeof v !== 'object') continue;
        const id = v.id || v.videoId || v.contentId;
        const ogpThumbnailUrl = v.ogpThumbnailUrl || v.thumbnailUrl || v.thumbnail;
        const thumbnail = v.thumbnail || v.thumbnailUrl;
        if (!id) continue;
        allVideos.push({
          ...v,
          id,
          ogpThumbnailUrl,
          thumbnail,
          year,
          month,
          yearMonth,
        });
      }
    }
    offset += contents.length;
    if (contents.length < limit) break;
  }
  return allVideos;
}

// 動画データを読み込む関数（年/月情報を含む）
async function loadVideoData() {
  // 1) まずmicroCMSからの取得を試みる
  try {
    const fromCMS = await loadVideoDataFromCMS();
    if (Array.isArray(fromCMS) && fromCMS.length > 0) {
      return fromCMS;
    }
  } catch (e) {
    console.log('Warning: Failed to load from microCMS, fallback to local JSON:', e.message);
  }
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
    // 再帰的にwebp数をカウント
    const walk = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      let count = 0;
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          count += await walk(full);
        } else if (entry.isFile() && entry.name.endsWith('.webp')) {
          count += 1;
        }
      }
      return count;
    };
    const webpCount = await walk(outputDir);
    console.log(`📁 Generated ${webpCount} optimized images`);
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
