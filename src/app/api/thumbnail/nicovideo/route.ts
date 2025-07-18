import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  try {
    // ニコニコ動画の公式APIからサムネイル情報を取得
    const apiUrl = `https://ext.nicovideo.jp/api/getthumbinfo/${videoId}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch niconico data: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // XMLをパースしてタイトルを抽出
    const titleMatch = xmlText.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'ニコニコ動画';

    // サムネイルURLを生成
    const thumbnailUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;

    return NextResponse.json({
      success: true,
      data: {
        thumbnailUrl: thumbnailUrl,
        title: title,
        videoId: videoId
      }
    });

  } catch (error) {
    console.error('Niconico API Error:', error);
    
    // エラー時でも基本的なサムネイルURLを返す
    const thumbnailUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;
    
    return NextResponse.json({
      success: true,
      data: {
        thumbnailUrl: thumbnailUrl,
        title: 'ニコニコ動画',
        videoId: videoId
      }
    });
  }
} 