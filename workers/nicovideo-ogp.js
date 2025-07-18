export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'URL parameter is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    try {
      // ニコニコ動画のURLかどうかチェック
      if (!targetUrl.includes('nicovideo.jp/watch/')) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Only nicovideo.jp URLs are supported'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }

      // ニコニコ動画のページを取得
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }

      const html = await response.text();

      // HTML Rewriterを使ってOGP情報を抽出
      let ogpData = {
        title: '',
        description: '',
        image: '',
        siteName: 'ニコニコ動画',
        url: targetUrl,
        type: 'video.other',
        videoId: ''
      };

      // ビデオIDを抽出
      const videoIdMatch = targetUrl.match(/\/watch\/([^\/\?]+)/);
      if (videoIdMatch) {
        ogpData.videoId = videoIdMatch[1];
      }

      // HTML Rewriterを使ってメタタグを抽出
      const rewriter = new HTMLRewriter()
        .on('meta[property="og:title"]', {
          element(element) {
            ogpData.title = element.getAttribute('content') || '';
          }
        })
        .on('meta[property="og:description"]', {
          element(element) {
            ogpData.description = element.getAttribute('content') || '';
          }
        })
        .on('meta[property="og:image"]', {
          element(element) {
            ogpData.image = element.getAttribute('content') || '';
          }
        })
        .on('meta[property="og:site_name"]', {
          element(element) {
            ogpData.siteName = element.getAttribute('content') || 'ニコニコ動画';
          }
        })
        .on('meta[property="og:type"]', {
          element(element) {
            ogpData.type = element.getAttribute('content') || 'video.other';
          }
        })
        .on('title', {
          text(text) {
            if (!ogpData.title) {
              ogpData.title = text.text || '';
            }
          }
        });

      // HTMLを処理
      await rewriter.transform(new Response(html)).text();

      // タイトルが取得できなかった場合のフォールバック
      if (!ogpData.title) {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          ogpData.title = titleMatch[1].trim();
        }
      }

      // 説明が取得できなかった場合のフォールバック
      if (!ogpData.description) {
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
        if (descMatch) {
          ogpData.description = descMatch[1].trim();
        }
      }

      // 画像が取得できなかった場合のフォールバック
      if (!ogpData.image) {
        const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
        if (imgMatch) {
          ogpData.image = imgMatch[1].trim();
        }
      }

      return new Response(JSON.stringify({
        success: true,
        data: ogpData
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });

    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to process request',
        details: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }
  }
}; 