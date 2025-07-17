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
          } catch (oembedError) {
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
      try {
        // oEmbed APIを試行
        const oembedUrl = `https://www.nicovideo.jp/api/oembed?url=${encodeURIComponent(url)}&format=json`;
        const oembedResponse = await axios.get<NicoOEmbedResponse>(oembedUrl);
        
        return NextResponse.json({
          ...oembedResponse.data,
          platform: 'nicovideo'
        });
      } catch (oembedError: unknown) {
        // axiosエラーの詳細を確認
        if (axios.isAxiosError(oembedError)) {
          const status = oembedError.response?.status;
          
          // エラーログを出力
          if (status) {
            console.warn(`oEmbed API error: ${status} for ${url}`);
          }
        }
        
        if (oembedError instanceof Error) {
          console.warn('oEmbed failed, falling back to scraping:', oembedError.message);
        } else if (typeof oembedError === "object" && oembedError && "message" in oembedError) {
          console.warn('oEmbed failed, falling back to scraping:', (oembedError as { message: string }).message);
        } else {
          console.warn('oEmbed failed, falling back to scraping:', oembedError);
        }
      }
    }

    // 通常のスクレイピング
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
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