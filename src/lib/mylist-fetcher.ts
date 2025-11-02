/**
 * ブラウザ対応版マイリスト取得ロジック
 * 既存の scripts/fetch-mylist.js をブラウザ環境向けに移植
 */

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
const CONCURRENCY = 5;

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  artist: string;
  thumbnail: string;
  ogpThumbnailUrl: string | null;
}

/**
 * 文字列ユーティリティ
 */
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function sanitizeTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  let title = rawTitle.trim();
  title = title.replace(/\s*-\s*ニコニコ動画\s*$/i, '');
  return title;
}

function deriveArtistFromTitle(title: string): string {
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

function parseMylistIdFromUrl(mylistUrl: string): string | null {
  const m = mylistUrl.match(/\/mylist\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * Cloudflare Workers経由でマイリストを取得
 * 既存のworkers/nicovideo-ogp.jsを使用
 */
async function fetchMylistViaWorkers(mylistUrl: string): Promise<VideoItem[]> {
  // 環境変数からWorkersのエンドポイントを取得（必須）
  // クライアント側では process.env.NEXT_PUBLIC_* のみアクセス可能
  const workerUrl = typeof window !== 'undefined' 
    ? (process.env as any).NEXT_PUBLIC_WORKER_URL
    : process.env.NEXT_PUBLIC_WORKER_URL;
  
  if (!workerUrl) {
    throw new Error('NEXT_PUBLIC_WORKER_URLが設定されていません。Cloudflare Workersのエンドポイントを設定してください。');
  }
  
  const apiUrl = `${workerUrl}?url=${encodeURIComponent(mylistUrl)}&type=mylist`;
  
  const res = await fetch(apiUrl);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `マイリスト取得失敗: HTTP ${res.status}`);
  }
  
  const data = await res.json();
  
  // Cloudflare Workersのレスポンス形式に対応
  if (!data.success) {
    throw new Error(data.error || 'マイリスト取得に失敗しました');
  }
  
  // Workersの形式: { success: true, data: [{ id, title, artist, url, thumbnail, ogpThumbnailUrl }, ...] }
  // 既に完全な動画情報が含まれているので、そのままVideoItem[]に変換
  const videos: VideoItem[] = (data.data || []).map((video: any) => ({
    id: video.id || '',
    title: video.title || '',
    url: video.url || `https://www.nicovideo.jp/watch/${video.id}`,
    artist: video.artist || '',
    thumbnail: video.thumbnail || `/thumbnails/${video.id}.jpg`,
    ogpThumbnailUrl: video.ogpThumbnailUrl || null,
  }));
  
  return videos;
}


/**
 * OGPを取得（Cloudflare Workers経由でCORS問題を回避）
 * 既存のscripts/fetch-mylist.jsのfetchOgp関数と同じロジック
 */
async function fetchOgp(videoUrl: string): Promise<{ ogTitle: string; ogImage: string }> {
  try {
    // 環境変数からWorkersのエンドポイントを取得（必須）
    // クライアント側では process.env.NEXT_PUBLIC_* のみアクセス可能
    const workerUrl = typeof window !== 'undefined'
      ? (process.env as any).NEXT_PUBLIC_WORKER_URL
      : process.env.NEXT_PUBLIC_WORKER_URL;
    
    if (!workerUrl) {
      throw new Error('NEXT_PUBLIC_WORKER_URLが設定されていません');
    }
    
    const apiUrl = `${workerUrl}?url=${encodeURIComponent(videoUrl)}&type=single`;
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`OGP取得失敗: HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    // Cloudflare Workersのレスポンス形式に対応
    if (!data.success) {
      throw new Error(data.error || 'OGP取得に失敗しました');
    }
    
    // Workersの形式: { success: true, data: { title, ogpThumbnailUrl } }
    if (data.data) {
      return {
        ogTitle: data.data.title || '',
        ogImage: data.data.ogpThumbnailUrl || '',
      };
    }
    
    // 開発環境のAPI Route形式: { success: true, ogTitle, ogImage }
    return {
      ogTitle: data.ogTitle || '',
      ogImage: data.ogImage || '',
    };
  } catch (error) {
    // エラー時は空文字を返す（既存のスクリプトと同様）
    console.warn(`OGP取得失敗: ${videoUrl}`, error);
    return { ogTitle: '', ogImage: '' };
  }
}

/**
 * 個別動画の最終成形
 */
async function buildVideoItem(
  raw: { id: string; ownerName: string; title: string },
  useOwnerAsArtist: boolean = true
): Promise<VideoItem> {
  const id = raw.id;
  const url = `https://www.nicovideo.jp/watch/${id}`;
  let artist = '';
  let title = '';
  let ogpThumbnailUrl = '';

  try {
    const og = await fetchOgp(url);
    title = sanitizeTitle(og.ogTitle || raw.title || '');
    ogpThumbnailUrl = og.ogImage || '';
  } catch (e) {
    title = sanitizeTitle(raw.title || '');
    ogpThumbnailUrl = '';
  }

  if (useOwnerAsArtist && raw.ownerName) {
    artist = raw.ownerName;
  }
  if (!artist) {
    artist = deriveArtistFromTitle(title);
  }

  return {
    id,
    title,
    url,
    artist,
    thumbnail: `/thumbnails/${id}.jpg`,
    ogpThumbnailUrl: ogpThumbnailUrl || null,
  };
}

/**
 * 並列制御つきで動画配列を処理
 */
async function processWithConcurrency<T, R>(
  items: T[],
  handler: (item: T, index: number) => Promise<R>,
  concurrency: number = CONCURRENCY,
  onProgress?: (current: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;
  let completed = 0;
  const total = items.length;
  
  async function worker() {
    while (index < items.length) {
      const current = index++;
      try {
        const r = await handler(items[current], current);
        if (r) {
          results.push(r);
        }
      } catch (error) {
        console.warn(`処理失敗: index ${current}`, error);
        // エラーがあっても続行
      }
      completed++;
      if (onProgress) {
        onProgress(completed, total);
      }
      await sleep(200);
    }
  }
  
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

/**
 * メイン: マイリストURLから -> NVAPI (失敗時RSS) -> 各動画OGP -> JSON返却
 */
export async function fetchMylistVideos(
  mylistUrl: string,
  onProgress?: (current: number, total: number) => void
): Promise<VideoItem[]> {
  console.log(`マイリストを取得中: ${mylistUrl}`);
  
  // Cloudflare Workers経由で取得（CORS問題を回避）
  // Workersは既に完全な動画情報（OGP含む）を返すので、そのまま使用
  try {
    const videos = await fetchMylistViaWorkers(mylistUrl);
    if (!videos.length) {
      throw new Error('マイリストから動画が見つかりませんでした');
    }
    
    // 進捗通知（Workersは一括取得なので即座に完了を通知）
    if (onProgress) {
      onProgress(videos.length, videos.length);
    }
    
    console.log(`✓ ${videos.length}件の動画データを取得`);
    return videos;
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    throw new Error(`マイリスト取得に失敗しました: ${errorMsg}`);
  }
}

