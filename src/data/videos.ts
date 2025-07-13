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

// 動画データ - ここで簡単に追加・削除・更新ができます
export const videos: VideoItem[] = [
  {
    id: 'sm45174208',
    title: '【XFD】MidLuster ミニアルバム『てるてる！』',
    description: 'MidLusterの最新ミニアルバム『てるてる！』のクロスフェードデモ',
    url: 'https://www.nicovideo.jp/watch/sm45174208',
    platform: 'nicovideo',
    category: 'VOCALOID',
    dateAdded: '2024-01-15',
    rank: 1,
    views: 15000,
    likes: 1200,
    tags: ['VOCALOID', '初音ミク', 'MidLuster', 'XFD'],
    artist: 'MidLuster',
    vocaloid: '初音ミク'
  },
  {
    id: 'sm45174209',
    title: '【初音ミク】オリジナル曲『星の軌跡』',
    description: '初音ミクによるオリジナル楽曲。夜空をテーマにした切ないバラード',
    url: 'https://www.nicovideo.jp/watch/sm45174209',
    platform: 'nicovideo',
    category: 'VOCALOID',
    dateAdded: '2024-01-20',
    rank: 2,
    views: 12000,
    likes: 980,
    tags: ['VOCALOID', '初音ミク', 'オリジナル', 'バラード'],
    artist: '星野奏',
    vocaloid: '初音ミク'
  },
  {
    id: 'sm45174210',
    title: '【鏡音リン・レン】デュエット曲『共鳴』',
    description: '鏡音リン・レンのデュエットによる力強いロックナンバー',
    url: 'https://www.nicovideo.jp/watch/sm45174210',
    platform: 'nicovideo',
    category: 'VOCALOID',
    dateAdded: '2024-01-25',
    rank: 3,
    views: 9800,
    likes: 850,
    tags: ['VOCALOID', '鏡音リン', '鏡音レン', 'ロック', 'デュエット'],
    artist: '共鳴楽団',
    vocaloid: '鏡音リン・レン'
  },
  {
    id: 'sm45174211',
    title: '【巡音ルカ】J-POP風『夏の記憶』',
    description: '巡音ルカによる爽やかな夏の楽曲',
    url: 'https://www.nicovideo.jp/watch/sm45174211',
    platform: 'nicovideo',
    category: 'VOCALOID',
    dateAdded: '2024-02-01',
    rank: 4,
    views: 8500,
    likes: 720,
    tags: ['VOCALOID', '巡音ルカ', 'J-POP', '夏'],
    artist: '夏音',
    vocaloid: '巡音ルカ'
  },
  {
    id: 'sm45174212',
    title: '【MEIKO】和風楽曲『桜舞い散る』',
    description: 'MEIKOによる美しい和風楽曲',
    url: 'https://www.nicovideo.jp/watch/sm45174212',
    platform: 'nicovideo',
    category: 'VOCALOID',
    dateAdded: '2024-02-05',
    rank: 5,
    views: 7200,
    likes: 650,
    tags: ['VOCALOID', 'MEIKO', '和風', '桜'],
    artist: '和音',
    vocaloid: 'MEIKO'
  },
  {
    id: 'sm45174213',
    title: '【KAITO】バラード『冬の詩』',
    description: 'KAITOによる心に響くバラード',
    url: 'https://www.nicovideo.jp/watch/sm45174213',
    platform: 'nicovideo',
    category: 'VOCALOID',
    dateAdded: '2024-02-10',
    rank: 6,
    views: 6800,
    likes: 580,
    tags: ['VOCALOID', 'KAITO', 'バラード', '冬'],
    artist: '冬音',
    vocaloid: 'KAITO'
  }
];

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