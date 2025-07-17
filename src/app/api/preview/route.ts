import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
            const oembedResponse = await axios.get(oembedUrl);
            const data = oembedResponse.data;
            
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
          const oembedResponse = await axios.get<NicoOEmbedResponse>(oembedUrl, {
            timeout: 5000, // タイムアウトを短縮
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)'
            }
          });
          
          return NextResponse.json({
            ...oembedResponse.data,
            platform: 'nicovideo'
          });
        } catch (oembedError: unknown) {
          // Cloudflare環境では外部APIが制限される可能性があるため、
          // 直接サムネイルURLを返すフォールバック
          console.warn('oEmbed API failed, using direct thumbnail URL:', oembedError);
          
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
    }

    // 通常のスクレイピング（Cloudflare環境では制限される可能性）
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 5000 // タイムアウトを短縮
      });

      const $ = cheerio.load(response.data);
      
      const metadata = {
        title: $('meta[property="og:title"]').attr('content') || $('title').text(),
        description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
        image: $('meta[property="og:image"]').attr('content'),
        url: $('meta[property="og:url"]').attr('content') || url,
        type: $('meta[property="og:type"]').attr('content'),
        siteName: $('meta[property="og:site_name"]').attr('content'),
        platform: 'generic'
      };

      return NextResponse.json(metadata);
    } catch (scrapingError) {
      // スクレイピングが失敗した場合、基本的な情報のみ返す
      console.warn('Scraping failed, returning basic info:', scrapingError);
      
      if (url.includes('nicovideo.jp')) {
        const videoId = extractNicovideoId(url);
        if (videoId) {
          return NextResponse.json({
            title: `ニコニコ動画 ${videoId}`,
            description: 'ニコニコ動画',
            image: `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`,
            url: url,
            platform: 'nicovideo'
          });
        }
      }
      
      return NextResponse.json({
        title: '動画',
        description: '動画情報を取得できませんでした',
        url: url,
        platform: 'unknown'
      });
    }
  } catch (error: unknown) {
    console.error('Preview API Error:', error);
    
    // エラーの詳細をログに記録
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
    }
    
    return NextResponse.json(
      { error: 'プレビューの取得に失敗しました' }, 
      { status: 500 }
    );
  }
} 