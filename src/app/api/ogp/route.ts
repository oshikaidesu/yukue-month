import { NextRequest, NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';
import type { OgpApiResponse } from '@/types/ogp';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' } as OgpApiResponse,
      { status: 400 }
    );
  }

  try {
    const options = {
      url: url,
      timeout: 10000, // 10秒のタイムアウト
      retry: 2, // リトライ回数
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)',
      },
    };

    const { result } = await ogs(options);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          title: result.ogTitle || result.twitterTitle || result.dcTitle || 'No title available',
          description: result.ogDescription || result.twitterDescription || result.dcDescription || 'No description available',
          image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
          siteName: result.ogSiteName || result.twitterSite,
          url: result.ogUrl || url,
          type: result.ogType,
        }
      } as OgpApiResponse);
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch OGP data', details: result.error } as OgpApiResponse,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('OGP API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as OgpApiResponse,
      { status: 500 }
    );
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

    const options = {
      url: url,
      timeout: 10000,
      retry: 2,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)',
      },
    };

    const { result } = await ogs(options);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          title: result.ogTitle || result.twitterTitle || result.dcTitle || 'No title available',
          description: result.ogDescription || result.twitterDescription || result.dcDescription || 'No description available',
          image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
          siteName: result.ogSiteName || result.twitterSite,
          url: result.ogUrl || url,
          type: result.ogType,
        }
      } as OgpApiResponse);
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch OGP data', details: result.error } as OgpApiResponse,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('OGP API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as OgpApiResponse,
      { status: 500 }
    );
  }
} 