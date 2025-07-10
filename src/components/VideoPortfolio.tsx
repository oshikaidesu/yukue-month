'use client';

import { useState } from 'react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  platform: 'youtube' | 'vimeo' | 'other';
  category?: string;
}

interface VideoPortfolioProps {
  videos: VideoItem[];
}

const VideoPortfolio: React.FC<VideoPortfolioProps> = ({ videos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // カテゴリの取得
  const categories = ['all', ...new Set(videos.map(video => video.category).filter((category): category is string => Boolean(category)))];

  // フィルタリングされた動画
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  // YouTubeの埋め込みURLを生成
  const getEmbedUrl = (url: string, platform: string) => {
    if (platform === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (platform === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  // サムネイルを取得
  const getThumbnail = (video: VideoItem) => {
    if (video.thumbnail) return video.thumbnail;
    
    if (video.platform === 'youtube') {
      const videoId = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/placeholder-video.jpg';
    }
    
    return '/placeholder-video.jpg';
  };

  return (
    <div className="space-y-8">
      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn btn-sm ${
              selectedCategory === category 
                ? 'btn-primary' 
                : 'btn-outline border-base-content text-base-content hover:bg-base-content hover:text-base-100'
            }`}
          >
            {category === 'all' ? 'すべて' : category}
          </button>
        ))}
      </div>

      {/* 動画グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="modern-card cursor-pointer overflow-hidden hover-lift"
            onClick={() => setSelectedVideo(video)}
          >
            <figure className="relative overflow-hidden">
              <img
                src={getThumbnail(video)}
                alt={video.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-video.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                <div className="text-white text-6xl opacity-0 hover:opacity-100 transition-opacity duration-200">
                  ▶️
                </div>
              </div>
            </figure>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-base-content mb-2">{video.title}</h3>
              <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
                {video.description}
              </p>
              {video.category && (
                <div className="badge badge-primary badge-outline">
                  {video.category}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 動画モーダル */}
      {selectedVideo && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl bg-base-100 border border-base-300">
            <h3 className="font-bold text-xl mb-4 text-base-content">
              {selectedVideo.title}
            </h3>
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(selectedVideo.url, selectedVideo.platform)}
                title={selectedVideo.title}
                className="w-full h-full rounded-2xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="mt-4 text-sm text-base-content/70">
              {selectedVideo.description}
            </p>
            <div className="modal-action">
              <button
                onClick={() => setSelectedVideo(null)}
                className="btn-modern"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPortfolio; 