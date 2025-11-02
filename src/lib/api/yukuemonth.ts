/**
 * microCMS yukuemonth エンドポイント API関数
 */

import { microcms } from '@/lib/microcms';
import { VideoItem } from '@/types/video';
import type { Playlist, MicroCMSPlaylistList } from '@/types/microcms';

/**
 * videoフィールドをパースするヘルパー関数
 */
function parseVideos(content: any): VideoItem[] {
  // videoフィールドがJSON文字列の場合
  if (typeof content.video === 'string') {
    try {
      return JSON.parse(content.video);
    } catch (e) {
      console.warn('Failed to parse video JSON:', e);
      return [];
    }
  }
  // videoフィールドが配列の場合
  if (Array.isArray(content.video)) {
    return content.video;
  }
  // videosフィールドが配列の場合（フォールバック）
  if (Array.isArray(content.videos)) {
    return content.videos;
  }
  return [];
}

/**
 * yearMonthを取得するヘルパー関数
 */
function getYearMonth(content: any): string {
  // visualフィールドがあれば使用（microCMSでのフィールド名）
  if (content.visual) {
    return content.visual;
  }
  // yearMonthフィールドがあれば使用
  if (content.yearMonth) {
    return content.yearMonth;
  }
  // フォールバック: yearとmonthから生成
  const year = typeof content.year === 'string' ? content.year : String(content.year);
  const month = typeof content.month === 'number' 
    ? content.month.toString().padStart(2, '0') 
    : String(content.month);
  return `${year}.${month}`;
}

/**
 * yearを数値に変換するヘルパー関数
 */
function getYear(content: any): number {
  if (typeof content.year === 'number') {
    return content.year;
  }
  if (typeof content.year === 'string') {
    return parseInt(content.year, 10);
  }
  return 0;
}

/**
 * コンテンツをPlaylist型に変換するヘルパー関数
 */
function mapToPlaylist(content: any): Playlist {
  return {
    id: content.id,
    year: getYear(content),
    month: content.month,
    yearMonth: getYearMonth(content),
    videos: parseVideos(content),
    publishedAt: content.publishedAt,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
    isMain: content.isMain ?? false,
  };
}

/**
 * すべてのプレイリストを取得
 */
export async function getAllPlaylists(): Promise<Playlist[]> {
  const response = await microcms.get<MicroCMSPlaylistList>({
    endpoint: 'yukuemonth',
    queries: {
      limit: 100, // 最大100件
      orders: '-publishedAt', // 公開日時の降順
    },
  });

  const playlists = response.contents.map(mapToPlaylist);
  
  // 年月順でソート（新しい順：年→月）
  playlists.sort((a, b) => {
    // まず年で比較（降順）
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    // 同じ年の場合は月で比較（降順）
    const monthA = typeof a.month === 'string' && a.month === 'voca_winter' ? 0 : 
                   typeof a.month === 'number' ? a.month : parseInt(String(a.month), 10);
    const monthB = typeof b.month === 'string' && b.month === 'voca_winter' ? 0 : 
                   typeof b.month === 'number' ? b.month : parseInt(String(b.month), 10);
    return monthB - monthA;
  });

  return playlists;
}

/**
 * 最新のプレイリストを取得（更新日時が最新のもの）
 */
export async function getLatestPlaylist(): Promise<Playlist | null> {
  const response = await microcms.get<MicroCMSPlaylistList>({
    endpoint: 'yukuemonth',
    queries: {
      limit: 1,
      orders: '-updatedAt', // 最新の更新順（更新日時の降順）
    },
  });

  if (response.contents.length === 0) {
    return null;
  }

  return mapToPlaylist(response.contents[0]);
}

/**
 * メインページに表示するプレイリストを取得（isMain=trueのもの）
 * 複数ある場合は最新（publishedAt降順）を返す
 */
export async function getMainPlaylist(): Promise<Playlist | null> {
  const response = await microcms.get<MicroCMSPlaylistList>({
    endpoint: 'yukuemonth',
    queries: {
      filters: 'isMain[equals]true',
      limit: 1,
      orders: '-publishedAt', // 公開日時の降順（最新を優先）
    },
  });

  if (response.contents.length === 0) {
    return null;
  }

  return mapToPlaylist(response.contents[0]);
}

/**
 * 年月でプレイリストを取得
 */
export async function getPlaylistByYearMonth(
  year: number,
  month: number | string
): Promise<Playlist | null> {
  const monthStr = typeof month === 'number' ? month.toString().padStart(2, '0') : month;
  const yearMonth = `${year}.${monthStr}`;

  const response = await microcms.get<MicroCMSPlaylistList>({
    endpoint: 'yukuemonth',
    queries: {
      filters: `visual[equals]${yearMonth}`, // visualフィールドで検索
      limit: 1,
      orders: '-updatedAt', // 最新の更新順
    },
  });

  if (response.contents.length === 0) {
    return null;
  }

  return mapToPlaylist(response.contents[0]);
}

/**
 * 指定した年のプレイリストをすべて取得
 */
export async function getPlaylistsByYear(year: number): Promise<Playlist[]> {
  const response = await microcms.get<MicroCMSPlaylistList>({
    endpoint: 'yukuemonth',
    queries: {
      filters: `year[equals]${year}`,
      limit: 100,
      orders: '-updatedAt', // 最新の更新順（更新日時の降順）
    },
  });

  return response.contents.map(mapToPlaylist);
}

/**
 * 利用可能な年月のリストを取得
 */
export async function getAvailableYearMonths(): Promise<Array<{ year: number; month: string; yearMonth: string }>> {
  const response = await microcms.get<MicroCMSPlaylistList>({
    endpoint: 'yukuemonth',
    queries: {
      fields: 'year,month,visual',
      limit: 100,
      orders: '-updatedAt', // 最新の更新順（更新日時の降順）
    },
  });

  const yearMonths = response.contents.map((item) => {
    const year = getYear(item);
    const month = typeof item.month === 'number' 
      ? item.month.toString().padStart(2, '0') 
      : String(item.month);
    const yearMonth = getYearMonth(item);
    
    return {
      year: year,
      month: month,
      yearMonth: yearMonth,
    };
  });

  // 重複を削除（yearMonthで）
  const unique = Array.from(
    new Map(yearMonths.map(item => [item.yearMonth, item])).values()
  );

  // 年月順でソート（新しい順：年→月）
  unique.sort((a, b) => {
    // まず年で比較（降順）
    if (b.year !== a.year) {
      return b.year - a.year;
    }
    // 同じ年の場合は月で比較（降順）
    // monthは文字列の場合があるので、数値に変換して比較
    const monthA = a.month === 'voca_winter' ? 0 : parseInt(a.month, 10);
    const monthB = b.month === 'voca_winter' ? 0 : parseInt(b.month, 10);
    return monthB - monthA;
  });

  return unique;
}

/**
 * 動画リストのみを取得（VideoItem[]として返す）
 */
export async function getVideosByYearMonth(
  year: number,
  month: number | string
): Promise<VideoItem[]> {
  const playlist = await getPlaylistByYearMonth(year, month);
  return playlist?.videos || [];
}
