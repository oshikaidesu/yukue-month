import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 });
    }

    // ニコニコ動画の場合
    if (url.includes('nicovideo.jp')) {
      try {
        // oEmbed APIを試行
        const oembedUrl = `https://www.nicovideo.jp/api/oembed?url=${encodeURIComponent(url)}&format=json`;
        const oembedResponse = await axios.get(oembedUrl);
        
        return NextResponse.json({
          ...oembedResponse.data,
          platform: 'nicovideo'
        });
      } catch (oembedError: unknown) {
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
    return NextResponse.json(
      { error: 'プレビューの取得に失敗しました' }, 
      { status: 500 }
    );
  }
} 