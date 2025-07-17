import { NextRequest, NextResponse } from 'next/server';

// oEmbed APIのレスポンス型を定義
interface NicoOEmbedResponse {
  type: string;
  version: string;
  title: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  width: number;
  height: number;
  [key: string]: unknown; // 追加のプロパティも許容
}

interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  provider_name: string;
  thumbnail_url: string;
  html: string;
  [key: string]: unknown;
}

export const runtime = 'edge';

// ニコニコ動画IDを抽出する関数
function extractNicovideoId(url: string): string | null {
  const match = url.match(/sm\d+|so\d+|nm\d+/);
  return match ? match[0] : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    // YouTube動画の場合
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      try {
        // YouTube動画IDを抽出
        let videoId: string | null = null;
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          /youtube\.com\/v\/([^&\n?#]+)/,
        ];
        
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match && match[1]) {
            videoId = match[1];
            break;
          }
        }
        
        if (videoId) {
          // YouTube oEmbed APIを使用
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
          try {
            const oembedResponse = await fetch(oembedUrl);
            const data = await oembedResponse.json() as YouTubeOEmbedResponse;
            
            return NextResponse.json({
              title: data.title,
              description: data.author_name,
              image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              url: url,
              platform: 'youtube',
              provider_name: data.provider_name,
              author_name: data.author_name,
              thumbnail_url: data.thumbnail_url,
              html: data.html
            });
          } catch {
            // oEmbedが失敗した場合、直接情報を返す
            return NextResponse.json({
              title: `YouTube Video ${videoId}`,
              description: 'YouTube',
              image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              url: url,
              platform: 'youtube'
            });
          }
        }
      } catch (error) {
        console.error('YouTube preview error:', error);
      }
    }

    // ニコニコ動画の場合
    if (url.includes('nicovideo.jp')) {
      const videoId = extractNicovideoId(url);
      
      if (videoId) {
        try {
          // oEmbed APIを試行
          const oembedUrl = `https://www.nicovideo.jp/api/oembed?url=${encodeURIComponent(url)}&format=json`;
          const oembedResponse = await fetch(oembedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)'
            }
          });
          
          if (oembedResponse.ok) {
            const data = await oembedResponse.json() as NicoOEmbedResponse;
            return NextResponse.json({
              ...data,
              platform: 'nicovideo'
            });
          }
        } catch (oembedError: unknown) {
          // Cloudflare環境では外部APIが制限される可能性があるため、
          // 直接サムネイルURLを返すフォールバック
          console.warn('oEmbed API failed, using direct thumbnail URL:', oembedError);
        }
        
        // フォールバック
        return NextResponse.json({
          title: `ニコニコ動画 ${videoId}`,
          description: 'ニコニコ動画',
          image: `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`,
          url: url,
          platform: 'nicovideo',
          thumbnail_url: `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`
        });
      }
    }

    // Edge Runtimeではスクレイピングは制限されるため、基本的な情報のみ返す
    return NextResponse.json({
      title: '動画',
      description: '動画情報を取得できませんでした',
      url: url,
      platform: 'unknown'
    });
  } catch (error: unknown) {
    console.error('Preview API Error:', error);
    
    return NextResponse.json(
      { error: 'プレビューの取得に失敗しました' }, 
      { status: 500 }
    );
  }
} 