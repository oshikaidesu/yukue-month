import VideosData from './2025/videos_05.json';

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  artist: string;
}

// JSONファイルから動画データを読み込み
export const videos: VideoItem[] = VideosData as VideoItem[];

// 最新の動画を取得する関数
enum SortKey {
  None,
}
export const getLatestVideos = (count: number = 6): VideoItem[] => {
  // 日付順ソートは不可のため、先頭から取得
  return videos.slice(0, count);
};

// ランキング順で動画を取得する関数
export const getRankedVideos = (count: number = 10): VideoItem[] => {
  // rankプロパティがないため、先頭から取得
  return videos.slice(0, count);
};

// カテゴリ別に動画を取得する関数
export const getVideosByCategory = (category: string): VideoItem[] => {
  // categoryプロパティがないため、空配列を返す
  return [];
};

// 再生回数順で動画を取得する関数
export const getVideosByViews = (count: number = 10): VideoItem[] => {
  // viewsプロパティがないため、先頭から取得
  return videos.slice(0, count);
};

// いいね数順で動画を取得する関数
export const getVideosByLikes = (count: number = 10): VideoItem[] => {
  // likesプロパティがないため、先頭から取得
  return videos.slice(0, count);
};

// 動画を検索する関数
export const searchVideos = (query: string): VideoItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return videos.filter(video => 
    video.title.toLowerCase().includes(lowercaseQuery)
    // description, category 参照不可
  );
}; 