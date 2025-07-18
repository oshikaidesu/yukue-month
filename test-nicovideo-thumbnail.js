const puppeteer = require('puppeteer');

// テスト用の動画IDリスト
const testVideoIds = [
  'sm44500976',
  'sm44549917', 
  'sm44510974',
  'sm44528232',
  'sm44570717'
];

async function testNicovideoThumbnails() {
  console.log('🚀 ニコニコ動画サムネイルテスト開始...');
  
  const browser = await puppeteer.launch({
    headless: false, // Chromeを表示
    defaultViewport: { width: 1200, height: 800 }
  });

  try {
    const page = await browser.newPage();
    
    // テスト結果を格納する配列
    const results = [];
    
    for (const videoId of testVideoIds) {
      console.log(`\n📹 テスト中: ${videoId}`);
      
      // 1. ニコニコ動画の公式サムネイルURL
      const officialThumbnailUrl = `https://tn.smilevideo.jp/smile?i=${videoId}`;
      
      // 2. 代替サムネイルURL
      const alternativeThumbnailUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;
      
      // 3. 動画ページからOGP情報を取得
      const videoUrl = `https://www.nicovideo.jp/watch/${videoId}`;
      
      let ogpThumbnailUrl = null;
      try {
        await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 10000 });
        
        // OGP画像URLを取得
        ogpThumbnailUrl = await page.evaluate(() => {
          const ogImage = document.querySelector('meta[property="og:image"]');
          return ogImage ? ogImage.getAttribute('content') : null;
        });
        
        console.log(`  ✅ OGP画像URL取得: ${ogpThumbnailUrl}`);
      } catch (error) {
        console.log(`  ❌ OGP画像URL取得失敗: ${error.message}`);
      }
      
      results.push({
        videoId,
        videoUrl,
        officialThumbnailUrl,
        alternativeThumbnailUrl,
        ogpThumbnailUrl
      });
    }
    
    // 結果をHTMLで表示
    const htmlContent = generateTestHTML(results);
    await page.setContent(htmlContent);
    
    console.log('\n🎉 テスト完了！Chromeで結果を確認してください。');
    console.log('📊 各サムネイルURLの動作を確認できます。');
    
    // 30秒待機してからブラウザを閉じる
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ テスト中にエラーが発生:', error);
  } finally {
    await browser.close();
  }
}

function generateTestHTML(results) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ニコニコ動画サムネイルテスト結果</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .test-item {
            margin-bottom: 40px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 20px;
            background: #fafafa;
        }
        .video-info {
            margin-bottom: 20px;
        }
        .video-id {
            font-size: 1.5em;
            font-weight: bold;
            color: #2196F3;
            margin-bottom: 10px;
        }
        .video-url {
            color: #666;
            word-break: break-all;
        }
        .thumbnails-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        .thumbnail-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: white;
            text-align: center;
        }
        .thumbnail-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .thumbnail-url {
            font-size: 0.8em;
            color: #666;
            word-break: break-all;
            margin-bottom: 10px;
        }
        .thumbnail-image {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            border: 1px solid #eee;
        }
        .error-message {
            color: #f44336;
            font-style: italic;
        }
        .success-message {
            color: #4CAF50;
            font-weight: bold;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-success { background-color: #4CAF50; }
        .status-error { background-color: #f44336; }
        .status-loading { background-color: #FF9800; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 ニコニコ動画サムネイルテスト結果</h1>
        
        ${results.map(result => `
            <div class="test-item">
                <div class="video-info">
                    <div class="video-id">📹 ${result.videoId}</div>
                    <div class="video-url">🔗 <a href="${result.videoUrl}" target="_blank">${result.videoUrl}</a></div>
                </div>
                
                <div class="thumbnails-grid">
                    <div class="thumbnail-item">
                        <div class="thumbnail-title">
                            <span class="status-indicator status-success"></span>
                            公式サムネイル
                        </div>
                        <div class="thumbnail-url">${result.officialThumbnailUrl}</div>
                        <img src="${result.officialThumbnailUrl}" 
                             alt="公式サムネイル" 
                             class="thumbnail-image"
                             onload="this.parentElement.querySelector('.status-indicator').className='status-indicator status-success'"
                             onerror="this.parentElement.querySelector('.status-indicator').className='status-indicator status-error'; this.style.display='none'; this.parentElement.innerHTML+='<div class=error-message>画像読み込み失敗</div>'">
                    </div>
                    
                    <div class="thumbnail-item">
                        <div class="thumbnail-title">
                            <span class="status-indicator status-success"></span>
                            代替サムネイル
                        </div>
                        <div class="thumbnail-url">${result.alternativeThumbnailUrl}</div>
                        <img src="${result.alternativeThumbnailUrl}" 
                             alt="代替サムネイル" 
                             class="thumbnail-image"
                             onload="this.parentElement.querySelector('.status-indicator').className='status-indicator status-success'"
                             onerror="this.parentElement.querySelector('.status-indicator').className='status-indicator status-error'; this.style.display='none'; this.parentElement.innerHTML+='<div class=error-message>画像読み込み失敗</div>'">
                    </div>
                    
                    ${result.ogpThumbnailUrl ? `
                        <div class="thumbnail-item">
                            <div class="thumbnail-title">
                                <span class="status-indicator status-success"></span>
                                OGP画像
                            </div>
                            <div class="thumbnail-url">${result.ogpThumbnailUrl}</div>
                            <img src="${result.ogpThumbnailUrl}" 
                                 alt="OGP画像" 
                                 class="thumbnail-image"
                                 onload="this.parentElement.querySelector('.status-indicator').className='status-indicator status-success'"
                                 onerror="this.parentElement.querySelector('.status-indicator').className='status-indicator status-error'; this.style.display='none'; this.parentElement.innerHTML+='<div class=error-message>画像読み込み失敗</div>'">
                        </div>
                    ` : `
                        <div class="thumbnail-item">
                            <div class="thumbnail-title">
                                <span class="status-indicator status-error"></span>
                                OGP画像
                            </div>
                            <div class="error-message">OGP画像URLの取得に失敗しました</div>
                        </div>
                    `}
                </div>
            </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
            <p>✅ 緑の丸: 正常に読み込み</p>
            <p>❌ 赤の丸: 読み込み失敗</p>
            <p>🔄 オレンジの丸: 読み込み中</p>
        </div>
    </div>
</body>
</html>
  `;
}

// スクリプト実行
testNicovideoThumbnails().catch(console.error); 