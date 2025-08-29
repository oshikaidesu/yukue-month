const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const ogs = require('open-graph-scraper');

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
const CONCURRENCY = 5;

/**
 * 文字列ユーティリティ
 */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function sanitizeTitle(rawTitle) {
  if (!rawTitle) return '';
  let title = rawTitle.trim();
  title = title.replace(/\s*-\s*ニコニコ動画\s*$/i, '');
  return title;
}

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

function parseMylistIdFromUrl(mylistUrl) {
  const m = mylistUrl.match(/\/mylist\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * マイリストAPI(NVAPI)から一覧取得（公開マイリストのみ）
 */
async function fetchMylistViaNvapi(mylistId) {
  const url = `https://nvapi.nicovideo.jp/v2/mylists/${mylistId}?pageSize=100&page=1&sortKey=addedAt&sortOrder=asc`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': DEFAULT_UA,
      'X-Frontend-Id': '6',
      'X-Frontend-Version': '0',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`NVAPI mylist fetch failed: ${res.status}`);
  const json = await res.json();
  const items = json?.data?.mylist?.items || json?.data?.items || [];
  const videos = [];
  for (const it of items) {
    const video = it.video || it;
    const id = video?.id || it?.contentId || it?.watchId; // sm45123456 など
    if (!id) continue;
    const ownerName = video?.owner?.name || video?.owner?.nickname || video?.channel?.name || '';
    const title = video?.title || '';
    videos.push({ id, ownerName, title });
  }
  return videos;
}

/**
 * RSSフォールバックで一覧取得
 */
async function fetchMylistViaRss(mylistUrl) {
  const rssUrl = mylistUrl.includes('?') ? `${mylistUrl}&rss=2.0` : `${mylistUrl}?rss=2.0`;
  const res = await fetch(rssUrl, { headers: { 'User-Agent': DEFAULT_UA } });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  const videos = [];
  $('item').each((_, el) => {
    const link = $(el).find('link').text();
    const title = $(el).find('title').text();
    const m = link.match(/\/watch\/([^/?#]+)/);
    if (m) {
      videos.push({ id: m[1], ownerName: '', title });
    }
  });
  return videos;
}

/**
 * OGPを取得
 */
async function fetchOgp(videoUrl) {
  const { result } = await ogs({ url: videoUrl, headers: { 'user-agent': DEFAULT_UA } });
  const ogTitle = result?.ogTitle || '';
  let ogImage = '';
  if (Array.isArray(result?.ogImage) && result.ogImage.length > 0) {
    ogImage = result.ogImage[0]?.url || '';
  } else if (typeof result?.ogImage === 'object' && result?.ogImage?.url) {
    ogImage = result.ogImage.url;
  }
  return { ogTitle, ogImage };
}

/**
 * 個別動画の最終成形
 */
async function buildVideoItem(raw, useOwnerAsArtist = true) {
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
async function processWithConcurrency(items, handler, concurrency = CONCURRENCY) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index++;
      try {
        const r = await handler(items[current], current);
        if (r) results.push(r);
      } catch (_) {
        // continue
      }
      await sleep(200);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

/**
 * メイン: マイリストURLから -> NVAPI (失敗時RSS) -> 各動画OGP -> JSON保存
 */
async function fetchMylistVideos(mylistUrl) {
  console.log(`マイリストを取得中: ${mylistUrl}`);
  const mylistId = parseMylistIdFromUrl(mylistUrl);
  if (!mylistId) throw new Error('マイリストIDをURLから抽出できませんでした');

  let list = [];
  try {
    list = await fetchMylistViaNvapi(mylistId);
    if (!list.length) throw new Error('NVAPIで取得できる動画がありません');
  } catch (e) {
    console.warn('NVAPI取得に失敗/空。RSSで再試行します...', e.message || e);
    list = await fetchMylistViaRss(mylistUrl);
  }

  console.log(`${list.length}件の動画IDを取得`);
  const data = await processWithConcurrency(list, (item) => buildVideoItem(item), CONCURRENCY);
  return data;
}

function saveToJson(videoData, filename) {
  const outputPath = path.join(__dirname, '..', 'src', 'data', filename);
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(videoData, null, 2), 'utf8');
  console.log(`\n✓ データを保存しました: ${outputPath}`);
}

// 単一動画の再取得（ID指定）
async function fetchSingleVideo(videoId, outputFilename) {
  const videoInfo = await buildVideoItem({ id: videoId, ownerName: '', title: '' });
  const outputPath = path.join(__dirname, '..', 'src', 'data', outputFilename);
  let existing = [];
  if (fs.existsSync(outputPath)) existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const idx = existing.findIndex((v) => v.id === videoId);
  if (idx >= 0) existing[idx] = videoInfo; else existing.push(videoInfo);
  saveToJson(existing, outputFilename);
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('使用方法:');
    console.log('  マイリスト取得: node scripts/fetch-mylist.js <マイリストURL> <出力ファイル名>');
    console.log('  単一動画取得: node scripts/fetch-mylist.js --single <動画ID> <出力ファイル名>');
    process.exit(1);
  }

  if (args[0] === '--single') {
    const videoId = args[1];
    const outputFilename = args[2];
    await fetchSingleVideo(videoId, outputFilename);
    return;
  }

  const mylistUrl = args[0];
  const outputFilename = args[1];
  const videoData = await fetchMylistVideos(mylistUrl);
  saveToJson(videoData, outputFilename);
  console.log(`\n完了！ ${videoData.length}個の動画データを取得しました。`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error('処理に失敗しました:', e?.message || e);
    process.exit(1);
  });
}

module.exports = { fetchMylistVideos, fetchSingleVideo };
