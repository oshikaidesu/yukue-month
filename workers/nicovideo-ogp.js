export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const type = url.searchParams.get('type') || 'single';

    if (!targetUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'URL parameter is required'
      }), {
        status: 400,
        headers: this.getCorsHeaders()
      });
    }

    try {
      if (type === 'mylist') {
        return await this.handleMylistRequest(targetUrl);
      } else {
        return await this.handleSingleVideoRequest(targetUrl);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to process request',
        details: error.message
      }), {
        status: 500,
        headers: this.getCorsHeaders()
      });
    }
  },

  getCorsHeaders() {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
  },

  async handleMylistRequest(targetUrl) {
    // 新しいマイリストURL形式に対応
    if (!targetUrl.includes('nicovideo.jp/user/') && !targetUrl.includes('nicovideo.jp/mylist/')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Only nicovideo.jp mylist URLs are supported'
      }), {
        status: 400,
        headers: this.getCorsHeaders()
      });
    }

    // マイリストIDを抽出（新旧両方の形式に対応）
    let mylistId = '';
    const newFormatMatch = targetUrl.match(/\/user\/\d+\/mylist\/(\d+)/);
    const oldFormatMatch = targetUrl.match(/\/mylist\/(\d+)/);
    
    if (newFormatMatch) {
      mylistId = newFormatMatch[1];
    } else if (oldFormatMatch) {
      mylistId = oldFormatMatch[1];
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid mylist URL format'
      }), {
        status: 400,
        headers: this.getCorsHeaders()
      });
    }

    // マイリストページを取得
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch mylist page: ${response.status}`);
    }

    const html = await response.text();
    
    // 動画IDを抽出（複数のパターンに対応）
    const videoIds = new Set();
    
    // パターン1: watch/sm12345 形式
    const watchPattern = /watch\/([a-z]{2}\d+)/g;
    let match;
    while ((match = watchPattern.exec(html)) !== null) {
      videoIds.add(match[1]);
    }
    
    // パターン2: JSON内の動画ID
    const jsonPattern = /"contentId":"([a-z]{2}\d+)"/g;
    while ((match = jsonPattern.exec(html)) !== null) {
      videoIds.add(match[1]);
    }

    const videoIdArray = Array.from(videoIds);

    if (videoIdArray.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No videos found in mylist'
      }), {
        status: 404,
        headers: this.getCorsHeaders()
      });
    }

    // 各動画の情報を取得
    const videoData = [];
    const batchSize = 3; // 同時リクエスト数を制限（より保守的に）
    
    for (let i = 0; i < videoIdArray.length; i += batchSize) {
      const batch = videoIdArray.slice(i, i + batchSize);
      const batchPromises = batch.map(videoId => 
        this.getVideoInfo(`https://www.nicovideo.jp/watch/${videoId}`)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          videoData.push(result.value);
        } else {
          console.warn(`Failed to get info for video: ${batch[index]}`);
        }
      });
      
      // レート制限対策で待機
      if (i + batchSize < videoIdArray.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(JSON.stringify({
      success: true,
      mylistId: mylistId,
      totalVideos: videoData.length,
      data: videoData
    }), {
      headers: this.getCorsHeaders()
    });
  },

  async handleSingleVideoRequest(targetUrl) {
    // 既存の単一動画処理ロジック
    if (!targetUrl.includes('nicovideo.jp/watch/')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Only nicovideo.jp URLs are supported'
      }), {
        status: 400,
        headers: this.getCorsHeaders()
      });
    }

    const videoInfo = await this.getVideoInfo(targetUrl);
    
    if (!videoInfo) {
      throw new Error('Failed to get video information');
    }

    return new Response(JSON.stringify({
      success: true,
      data: videoInfo
    }), {
      headers: this.getCorsHeaders()
    });
  },

  async getVideoInfo(videoUrl) {
    try {
      const response = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }

      const html = await response.text();

      // プロジェクトの形式に合わせた動画情報を抽出
      let videoInfo = {
        id: '',
        title: '',
        artist: '',
        url: videoUrl,
        thumbnail: '',
        ogpThumbnailUrl: ''
      };

      // ビデオIDを抽出
      const videoIdMatch = videoUrl.match(/\/watch\/([^\/\?]+)/);
      if (videoIdMatch) {
        videoInfo.id = videoIdMatch[1];
        videoInfo.thumbnail = `/thumbnails/${videoInfo.id}.jpg`;
      }

      // OGP情報を抽出
      let ogpData = {
        title: '',
        image: ''
      };

      const rewriter = new HTMLRewriter()
        .on('meta[property="og:title"]', {
          element(element) {
            ogpData.title = element.getAttribute('content') || '';
          }
        })
        .on('meta[property="og:image"]', {
          element(element) {
            ogpData.image = element.getAttribute('content') || '';
          }
        });

      await rewriter.transform(new Response(html)).text();

      // タイトル処理
      if (ogpData.title) {
        videoInfo.title = ogpData.title;
        // タイトルからアーティスト名を推測
        const titleParts = ogpData.title.split(/\s*[-/]\s*/);
        if (titleParts.length >= 2) {
          // 最後の部分をアーティスト名として使用
          videoInfo.artist = titleParts[titleParts.length - 1].trim();
        }
      }

      // OGPサムネイル
      if (ogpData.image) {
        videoInfo.ogpThumbnailUrl = ogpData.image;
      }

      // フォールバック処理
      if (!videoInfo.title) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          videoInfo.title = titleMatch[1].trim();
        }
      }

      return videoInfo;

    } catch (error) {
      console.error(`Error getting video info for ${videoUrl}:`, error);
      return null;
    }
  }
};