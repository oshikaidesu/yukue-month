export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  platform: 'youtube' | 'vimeo' | 'other';
  category?: string;
  dateAdded?: string;
}

// 動画データ - ここで簡単に追加・削除・更新ができます
export const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Next.js チュートリアル - 基礎から応用まで',
    description: 'Next.jsの基本的な使い方から、高度な機能までを詳しく解説します。',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    category: 'プログラミング',
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    title: 'React Hooks 完全ガイド',
    description: 'useState、useEffect、useContextなど、React Hooksの使い方を実践的に学べます。',
    url: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
    platform: 'youtube',
    category: 'プログラミング',
    dateAdded: '2024-01-20'
  },
  {
    id: '3',
    title: 'TypeScript 入門講座',
    description: 'TypeScriptの基本文法から、実践的な使い方までを丁寧に解説します。',
    url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    platform: 'youtube',
    category: 'プログラミング',
    dateAdded: '2024-01-25'
  },
  {
    id: '4',
    title: 'デザインシステムの構築',
    description: '効率的なデザインシステムの作り方と運用方法について解説します。',
    url: 'https://vimeo.com/123456789',
    platform: 'vimeo',
    category: 'デザイン',
    dateAdded: '2024-02-01'
  },
  {
    id: '5',
    title: 'Webアニメーションの実装',
    description: 'CSSアニメーションとJavaScriptを使った魅力的なWebアニメーションの作り方。',
    url: 'https://www.youtube.com/watch?v=example123',
    platform: 'youtube',
    category: 'デザイン',
    dateAdded: '2024-02-05'
  },
  {
    id: '6',
    title: 'パフォーマンス最適化テクニック',
    description: 'Webサイトの読み込み速度を改善するための実践的なテクニックを紹介します。',
    url: 'https://www.youtube.com/watch?v=performance123',
    platform: 'youtube',
    category: 'パフォーマンス',
    dateAdded: '2024-02-10'
  }
];

// カテゴリ別に動画を取得する関数
export const getVideosByCategory = (category: string): VideoItem[] => {
  if (category === 'all') return videos;
  return videos.filter(video => video.category === category);
};

// 最新の動画を取得する関数
export const getLatestVideos = (count: number = 6): VideoItem[] => {
  return videos
    .sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime())
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