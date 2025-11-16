import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// CORSミドルウェア
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// ========== microCMS プロキシ ==========
async function fetchFromMicroCMS(env, path, query) {
  const serviceDomain = env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = env.MICROCMS_API_KEY;
  if (!serviceDomain || !apiKey) {
    throw new Error('MICROCMS credentials are not configured on Worker');
  }
  const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    headers: {
      'X-MICROCMS-API-KEY': apiKey,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`microCMS fetch failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

function parseVideos(content) {
  if (typeof content?.video === 'string') {
    try {
      return JSON.parse(content.video);
    } catch {
      return [];
    }
  }
  if (Array.isArray(content?.video)) return content.video;
  if (Array.isArray(content?.videos)) return content.videos;
  return [];
}

function toPlaylist(content) {
  const year = typeof content?.year === 'number'
    ? content.year
    : (typeof content?.year === 'string' ? parseInt(content.year, 10) : 0);
  const month = content?.month;
  const ym = content?.visual || content?.yearMonth || (() => {
    const y = typeof content?.year === 'string' ? content.year : String(content?.year || '');
    const m = typeof month === 'number' ? String(month).padStart(2, '0') : String(month || '');
    return `${y}.${m}`;
  })();
  return {
    id: content?.id,
    year,
    month,
    yearMonth: ym,
    videos: parseVideos(content),
    publishedAt: content?.publishedAt,
    createdAt: content?.createdAt,
    updatedAt: content?.updatedAt,
    isMain: !!content?.isMain,
  };
}

app.get('/cms', async (c) => {
  const type = c.req.query('type') || 'main';
  try {
    const env = c.env || {};
    if (type === 'main') {
      const data = await fetchFromMicroCMS(env, 'yukuemonth', {
        limit: 1,
        orders: '-publishedAt',
        filters: 'isMain[equals]true',
      });
      const content = (data?.contents || [])[0];
      if (!content) return c.json({ success: true, playlist: null });
      return c.json({ success: true, playlist: toPlaylist(content) });
    }
    if (type === 'latest') {
      const data = await fetchFromMicroCMS(env, 'yukuemonth', {
        limit: 1,
        orders: '-updatedAt',
      });
      const content = (data?.contents || [])[0];
      if (!content) return c.json({ success: true, playlist: null });
      return c.json({ success: true, playlist: toPlaylist(content) });
    }
    if (type === 'byYearMonth') {
      const year = c.req.query('year');
      const month = c.req.query('month');
      if (!year || !month) {
        return c.json({ success: false, error: 'year and month are required' }, 400);
      }
      const monthStr = /^\d+$/.test(month) ? String(month).padStart(2, '0') : month;
      const visual = `${year}.${monthStr}`;
      const data = await fetchFromMicroCMS(env, 'yukuemonth', {
        limit: 1,
        orders: '-updatedAt',
        filters: `visual[equals]${visual}`,
      });
      const content = (data?.contents || [])[0];
      if (!content) return c.json({ success: true, playlist: null });
      return c.json({ success: true, playlist: toPlaylist(content) });
    }
    return c.json({ success: false, error: 'unknown type' }, 400);
  } catch (e) {
    return c.json({ success: false, error: e.message || 'microCMS proxy error' }, 500);
  }
});

// ヘルパー関数: マイリストIDを抽出
function parseMylistIdFromUrl(targetUrl) {
  const newFormatMatch = targetUrl.match(/\/user\/\d+\/mylist\/(\d+)/);
  const oldFormatMatch = targetUrl.match(/\/mylist\/(\d+)/);
  
  if (newFormatMatch) {
    return newFormatMatch[1];
  } else if (oldFormatMatch) {
    return oldFormatMatch[1];
  }
  return null;
}

// ヘルパー関数: 動画情報を取得
async function getVideoInfo(videoUrl) {
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

// NVAPIからマイリスト取得
async function fetchMylistViaNvapi(mylistId) {
  const url = `https://nvapi.nicovideo.jp/v2/mylists/${mylistId}?pageSize=100&page=1&sortKey=addedAt&sortOrder=asc`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'X-Frontend-Id': '6',
      'X-Frontend-Version': '0',
      'Accept': 'application/json',
    },
  });
  
  if (!res.ok) {
    throw new Error(`NVAPI mylist fetch failed: ${res.status}`);
  }
  
  const json = await res.json();
  const items = json?.data?.mylist?.items || json?.data?.items || [];
  const videos = [];
  
  for (const it of items) {
    const video = it.video || it;
    const id = video?.id || it?.contentId || it?.watchId;
    if (!id) continue;
    const ownerName = video?.owner?.name || video?.owner?.nickname || video?.channel?.name || '';
    const title = video?.title || '';
    videos.push({ id, ownerName, title });
  }
  
  return videos;
}

// RSSからマイリスト取得（Cloudflare Workers用、DOMParser使用）
async function fetchMylistViaRss(mylistUrl) {
  const rssUrl = mylistUrl.includes('?') ? `${mylistUrl}&rss=2.0` : `${mylistUrl}?rss=2.0`;
  const res = await fetch(rssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  
  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status}`);
  }
  
  const xml = await res.text();
  const videos = [];
  
  // XMLをパース（DOMParser使用）
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = doc.querySelectorAll('item');
  
  items.forEach((item) => {
    const link = item.querySelector('link')?.textContent || '';
    const title = item.querySelector('title')?.textContent || '';
    const m = link.match(/\/watch\/([^/?#]+)/);
    if (m) {
      videos.push({ id: m[1], ownerName: '', title });
    }
  });
  
  return videos;
}

// タイトルをサニタイズ
function sanitizeTitle(rawTitle) {
  if (!rawTitle) return '';
  let title = rawTitle.trim();
  title = title.replace(/\s*-\s*ニコニコ動画\s*$/i, '');
  return title;
}

// タイトルからアーティスト名を推測
function deriveArtistFromTitle(title) {
  if (!title) return '';
  const t = title.trim();
  let m = t.match(/^([^\/]+)\s*\/\s*([^\/]+)$/);
  if (m && m[2]) return m[2].trim();
  m = t.match(/^([^-]+)\s*-\s*([^-]+)$/);
  if (m && m[2]) return m[2].trim();
  m = t.match(/feat\.?\s*([^\[\]\(\)\/-]+)/i);
  if (m && m[1]) return m[1].trim();
  return '';
}

// マイリスト取得処理
async function handleMylistRequest(targetUrl) {
  // 新しいマイリストURL形式に対応
  if (!targetUrl.includes('nicovideo.jp/user/') && !targetUrl.includes('nicovideo.jp/mylist/')) {
    throw new Error('Only nicovideo.jp mylist URLs are supported');
  }

  // マイリストIDを抽出（新旧両方の形式に対応）
  const mylistId = parseMylistIdFromUrl(targetUrl);
  
  if (!mylistId) {
    throw new Error('Invalid mylist URL format');
  }

  // NVAPIまたはRSSでマイリストを取得
  let list = [];
  try {
    list = await fetchMylistViaNvapi(mylistId);
    if (!list.length) {
      throw new Error('NVAPIで取得できる動画がありません');
    }
  } catch (e) {
    console.warn('NVAPI取得に失敗。RSSで再試行します...', e.message || e);
    try {
      list = await fetchMylistViaRss(targetUrl);
    } catch (rssError) {
      throw new Error(`マイリスト取得に失敗しました: ${e.message}, RSS取得にも失敗: ${rssError.message}`);
    }
  }

  if (list.length === 0) {
    throw new Error('No videos found in mylist');
  }

  const videoIdArray = list.map(v => v.id);

  // 各動画の情報を取得（NVAPI/RSSで取得した基本情報を使用）
  const videoData = [];
  const batchSize = 3;
  
  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize);
    const batchPromises = batch.map(async (item) => {
      // 既にOGP情報を取得済みの場合はそれを使用、なければ取得
      const videoInfo = await getVideoInfo(`https://www.nicovideo.jp/watch/${item.id}`);
      
      if (videoInfo) {
        // アーティスト情報を優先（NVAPIから取得したownerNameがあれば使用）
        if (item.ownerName) {
          videoInfo.artist = item.ownerName;
        }
        // タイトルが空の場合はRSSから取得したタイトルを使用
        if (!videoInfo.title && item.title) {
          videoInfo.title = sanitizeTitle(item.title);
          if (!videoInfo.artist) {
            videoInfo.artist = deriveArtistFromTitle(videoInfo.title);
          }
        }
        return videoInfo;
      }
      return null;
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        videoData.push(result.value);
      } else {
        console.warn('Failed to get info for video');
      }
    });
    
    // レート制限対策で待機
    if (i + batchSize < list.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return {
    success: true,
    mylistId: mylistId,
    totalVideos: videoData.length,
    data: videoData
  };
}

// 単一動画取得処理
async function handleSingleVideoRequest(targetUrl) {
  if (!targetUrl.includes('nicovideo.jp/watch/')) {
    throw new Error('Only nicovideo.jp URLs are supported');
  }

  const videoInfo = await getVideoInfo(targetUrl);
  
  if (!videoInfo) {
    throw new Error('Failed to get video information');
  }

  return {
    success: true,
    data: videoInfo
  };
}

// ルーティング
app.get('/', async (c) => {
  const targetUrl = c.req.query('url');
  const type = c.req.query('type') || 'single';

  if (!targetUrl) {
    return c.json({
      success: false,
      error: 'URL parameter is required'
    }, 400);
  }

  try {
    let result;
    if (type === 'mylist') {
      result = await handleMylistRequest(targetUrl);
    } else {
      result = await handleSingleVideoRequest(targetUrl);
    }
    return c.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to process request'
    }, 500);
  }
});

export default app;