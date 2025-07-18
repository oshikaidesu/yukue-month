import { NextRequest, NextResponse } from 'next/server';
import type { OgpApiResponse } from '@/types/ogp';

export const dynamic = 'force-dynamic';

// ニコニコ動画のビデオIDを抽出する関数
function extractNicovideoId(url: string): string | null {
  const patterns = [
    /nicovideo\.jp\/watch\/(sm\d+)/,
    /nicovideo\.jp\/watch\/(so\d+)/,
    /nicovideo\.jp\/watch\/(nm\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// ニコニコ動画のサムネイルURLを生成する関数（フォールバック用）
function generateNicovideoThumbnail(videoId: string): string {
  return `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;
}

// Cloudflare WorkersからOGP情報を取得する関数
async function fetchOgpFromWorker(url: string): Promise<OgpApiResponse | null> {
  try {
    // 開発環境と本番環境でWorkerのURLを切り替え
    const workerUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8787' 
      : 'https://nicovideo-ogp.yukue.workers.dev'; // 本番環境のWorker URL

    console.log(`Fetching OGP from worker for URL: ${url}`);
    console.log(`Worker URL: ${workerUrl}`);

    const response = await fetch(`${workerUrl}/?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`Worker response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Worker response not ok: ${response.status}`);
      return null;
    }

    const data = await response.json() as any;
    console.log(`Worker data:`, data);
    console.log(`Worker response:`, data);

    if (data.success && data.data) {
      return data as OgpApiResponse;
    }

    return null;
  } catch (error) {
    console.error('Worker fetch error:', error);
    return null;
  }
}

// 従来のニコニコ動画APIからメタデータを取得する関数（フォールバック用）
async function fetchNicovideoMetadata(videoId: string, url: string): Promise<OgpApiResponse> {
  try {
    const response = await fetch(`https://ext.nicovideo.jp/api/getthumbinfo/${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch niconico data: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // XMLをパースしてメタデータを抽出
    const titleMatch = xmlText.match(/<title>(.*?)<\/title>/);
    const descriptionMatch = xmlText.match(/<description>(.*?)<\/description>/);
    const thumbnailUrlMatch = xmlText.match(/<thumbnail_url>(.*?)<\/thumbnail_url>/);
    const lengthMatch = xmlText.match(/<length>(.*?)<\/length>/);
    const viewCountMatch = xmlText.match(/<view_counter>(.*?)<\/view_counter>/);
    const commentCountMatch = xmlText.match(/<comment_num>(.*?)<\/comment_num>/);
    const mylistCountMatch = xmlText.match(/<mylist_counter>(.*?)<\/mylist_counter>/);

    const title = titleMatch ? titleMatch[1] : `ニコニコ動画 - ${videoId}`;
    const description = descriptionMatch ? descriptionMatch[1] : 'ニコニコ動画の動画です';
    const thumbnailUrl = thumbnailUrlMatch ? thumbnailUrlMatch[1] : generateNicovideoThumbnail(videoId);

    return {
      success: true,
      data: {
        title: title,
        description: description,
        image: thumbnailUrl,
        siteName: 'ニコニコ動画',
        url: url,
        type: 'video.other',
        videoId: videoId,
        length: lengthMatch ? lengthMatch[1] : undefined,
        viewCount: viewCountMatch ? parseInt(viewCountMatch[1]) : undefined,
        commentCount: commentCountMatch ? parseInt(commentCountMatch[1]) : undefined,
        mylistCount: mylistCountMatch ? parseInt(mylistCountMatch[1]) : undefined,
      }
    } as OgpApiResponse;

  } catch (error) {
    console.error('Niconico API Error:', error);
    
    // フォールバック: 基本的なサムネイルURLのみ返す
    return {
      success: true,
      data: {
        title: `ニコニコ動画 - ${videoId}`,
        description: 'ニコニコ動画の動画です',
        image: generateNicovideoThumbnail(videoId),
        siteName: 'ニコニコ動画',
        url: url,
        type: 'video.other',
        videoId: videoId,
      }
    } as OgpApiResponse;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' } as OgpApiResponse,
      { status: 400 }
    );
  }

  // ニコニコ動画のビデオIDを抽出
  const videoId = extractNicovideoId(url);
  
  if (!videoId) {
    return NextResponse.json(
      { success: false, error: 'Invalid niconico video URL' } as OgpApiResponse,
      { status: 400 }
    );
  }

  try {
    // まずCloudflare WorkersからOGP情報を取得を試行
    const workerResponse = await fetchOgpFromWorker(url);
    
    if (workerResponse && workerResponse.success) {
      console.log('Using Worker response');
      return NextResponse.json(workerResponse);
    }

    // Workerが失敗した場合は従来のAPIにフォールバック
    console.log('Worker failed, falling back to legacy API');
    const legacyResponse = await fetchNicovideoMetadata(videoId, url);
    return NextResponse.json(legacyResponse);

  } catch (error) {
    console.error('API Error:', error);
    
    // 最終フォールバック
    return NextResponse.json({
      success: true,
      data: {
        title: `ニコニコ動画 - ${videoId}`,
        description: 'ニコニコ動画の動画です',
        image: generateNicovideoThumbnail(videoId),
        siteName: 'ニコニコ動画',
        url: url,
        type: 'video.other',
        videoId: videoId,
      }
    } as OgpApiResponse);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required in request body' } as OgpApiResponse,
        { status: 400 }
      );
    }

    // GETと同じロジック
    const videoId = extractNicovideoId(url);
    
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Invalid niconico video URL' } as OgpApiResponse,
        { status: 400 }
      );
    }

    try {
      // まずCloudflare WorkersからOGP情報を取得を試行
      const workerResponse = await fetchOgpFromWorker(url);
      
      if (workerResponse && workerResponse.success) {
        console.log('Using Worker response (POST)');
        return NextResponse.json(workerResponse);
      }

      // Workerが失敗した場合は従来のAPIにフォールバック
      console.log('Worker failed, falling back to legacy API (POST)');
      const legacyResponse = await fetchNicovideoMetadata(videoId, url);
      return NextResponse.json(legacyResponse);

    } catch (error) {
      console.error('API Error (POST):', error);
      
      // 最終フォールバック
      return NextResponse.json({
        success: true,
        data: {
          title: `ニコニコ動画 - ${videoId}`,
          description: 'ニコニコ動画の動画です',
          image: generateNicovideoThumbnail(videoId),
          siteName: 'ニコニコ動画',
          url: url,
          type: 'video.other',
          videoId: videoId,
        }
      } as OgpApiResponse);
    }
  } catch (error) {
    console.error('POST request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as OgpApiResponse,
      { status: 500 }
    );
  }
} 