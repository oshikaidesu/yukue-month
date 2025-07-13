import videosData from './videos.json';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  platform: 'youtube' | 'vimeo' | 'nicovideo' | 'other';
  category?: string;
  dateAdded?: string;
  rank?: number;
  views?: number;
  likes?: number;
  tags?: string[];
  artist?: string;
  vocaloid?: string;
}

// JSONファイルから動画データを読み込み
export const videos: VideoItem[] = videosData as VideoItem[];

// 最新の動画を取得する関数
export const getLatestVideos = (count: number = 6): VideoItem[] => {
  return videos
    .sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime())
    .slice(0, count);
};

// ランキング順で動画を取得する関数
export const getRankedVideos = (count: number = 10): VideoItem[] => {
  return videos
    .filter(video => video.rank)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, count);
};

// カテゴリ別に動画を取得する関数
export const getVideosByCategory = (category: string): VideoItem[] => {
  return videos.filter(video => video.category === category);
};

// 再生回数順で動画を取得する関数
export const getVideosByViews = (count: number = 10): VideoItem[] => {
  return videos
    .filter(video => video.views)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, count);
};

// いいね数順で動画を取得する関数
export const getVideosByLikes = (count: number = 10): VideoItem[] => {
  return videos
    .filter(video => video.likes)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, count);
};

// 動画を検索する関数
export const searchVideos = (query: string): VideoItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return videos.filter(video => 
    video.title.toLowerCase().includes(lowercaseQuery) ||
    video.description.toLowerCase().includes(lowercaseQuery) ||
    video.category?.toLowerCase().includes(lowercaseQuery)
  );
}; 