import { NextRequest, NextResponse } from 'next/server';
import type { OgpApiResponse } from '@/types/ogp';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' } as OgpApiResponse,
      { status: 400 }
    );
  }

  // テスト用のモックデータ
  const mockData = {
    success: true,
    data: {
      title: `Test Title for ${url}`,
      description: `This is a test description for ${url}`,
      image: 'https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Test+Image',
      siteName: 'Test Site',
      url: url,
      type: 'website',
    }
  } as OgpApiResponse;

  // 実際のURLに基づいて異なるレスポンスを返す
  if (url.includes('youtube.com')) {
    mockData.data = {
      title: 'YouTube Video - Test',
      description: 'This is a test YouTube video',
      image: 'https://via.placeholder.com/320x180/FF0000/FFFFFF?text=YouTube+Video',
      siteName: 'YouTube',
      url: url,
      type: 'video.other',
    };
  } else if (url.includes('nicovideo.jp')) {
    mockData.data = {
      title: 'ニコニコ動画 - Test',
      description: 'これはテスト用のニコニコ動画です',
      image: 'https://via.placeholder.com/320x180/00FF00/FFFFFF?text=Niconico+Video',
      siteName: 'ニコニコ動画',
      url: url,
      type: 'video.other',
    };
  } else if (url.includes('twitter.com') || url.includes('x.com')) {
    mockData.data = {
      title: 'Twitter/X Post - Test',
      description: 'This is a test Twitter/X post',
      image: 'https://via.placeholder.com/320x180/1DA1F2/FFFFFF?text=Twitter+Post',
      siteName: 'Twitter/X',
      url: url,
      type: 'website',
    };
  }

  return NextResponse.json(mockData);
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
    const mockData = {
      success: true,
      data: {
        title: `Test Title for ${url}`,
        description: `This is a test description for ${url}`,
        image: 'https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Test+Image',
        siteName: 'Test Site',
        url: url,
        type: 'website',
      }
    } as OgpApiResponse;

    if (url.includes('youtube.com')) {
      mockData.data = {
        title: 'YouTube Video - Test',
        description: 'This is a test YouTube video',
        image: 'https://via.placeholder.com/320x180/FF0000/FFFFFF?text=YouTube+Video',
        siteName: 'YouTube',
        url: url,
        type: 'video.other',
      };
    } else if (url.includes('nicovideo.jp')) {
      mockData.data = {
        title: 'ニコニコ動画 - Test',
        description: 'これはテスト用のニコニコ動画です',
        image: 'https://via.placeholder.com/320x180/00FF00/FFFFFF?text=Niconico+Video',
        siteName: 'ニコニコ動画',
        url: url,
        type: 'video.other',
      };
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      mockData.data = {
        title: 'Twitter/X Post - Test',
        description: 'This is a test Twitter/X post',
        image: 'https://via.placeholder.com/320x180/1DA1F2/FFFFFF?text=Twitter+Post',
        siteName: 'Twitter/X',
        url: url,
        type: 'website',
      };
    }

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('OGP Test API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as OgpApiResponse,
      { status: 500 }
    );
  }
} 