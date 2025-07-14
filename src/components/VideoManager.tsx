'use client';

import { useState } from 'react';
import { VideoItem } from '../data/videos';

interface VideoManagerProps {
  videos: VideoItem[];
  onVideosChange: (videos: VideoItem[]) => void;
}

const VideoManager: React.FC<VideoManagerProps> = ({ videos, onVideosChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    platform: 'youtube' as 'youtube' | 'vimeo' | 'other',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVideo) {
      // 編集モード
      const updatedVideos = videos.map(video => 
        video.id === editingVideo.id 
          ? { ...video, ...formData }
          : video
      );
      onVideosChange(updatedVideos);
      setEditingVideo(null);
    } else {
      // 追加モード
      const newVideo: VideoItem = {
        id: Date.now().toString(),
        ...formData,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      onVideosChange([...videos, newVideo]);
    }
    
    setFormData({
      title: '',
      description: '',
      url: '',
      platform: 'youtube',
      category: ''
    });
    setIsAdding(false);
  };

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      url: video.url,
      platform: video.platform,
      category: video.category || ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('この動画を削除しますか？')) {
      const updatedVideos = videos.filter(video => video.id !== id);
      onVideosChange(updatedVideos);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      platform: 'youtube',
      category: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">動画管理</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary glass border-0"
          disabled={isAdding || editingVideo !== null}
        >
          動画を追加
        </button>
      </div>

      {/* 追加・編集フォーム */}
      {(isAdding || editingVideo) && (
        <div className="card glass border-0">
          <div className="card-body">
            <h4 className="card-title text-white">
              {editingVideo ? '動画を編集' : '動画を追加'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">タイトル *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/50"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">説明</span>
                </label>
                <textarea
                  className="textarea textarea-bordered bg-white/20 border-white/30 text-white placeholder-white/50"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">URL *</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/50"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">プラットフォーム</span>
                </label>
                <select
                  className="select select-bordered bg-white/20 border-white/30 text-white"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as string })}
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="other">その他</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white">カテゴリ</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="例: プログラミング、デザイン、パフォーマンス"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="btn btn-primary glass border-0"
                >
                  {editingVideo ? '更新' : '追加'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline text-white border-white hover:bg-white hover:text-primary"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 動画リスト */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">動画一覧</h4>
        <div className="grid gap-4">
          {videos.map((video) => (
            <div key={video.id} className="card glass border-0 hover-lift">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="card-title text-white">{video.title}</h5>
                    <p className="text-sm text-white/70 mb-2">{video.description}</p>
                    <div className="flex gap-2 text-xs text-white/50">
                      <span>プラットフォーム: {video.platform}</span>
                      {video.category && <span>カテゴリ: {video.category}</span>}
                      {video.dateAdded && <span>追加日: {video.dateAdded}</span>}
                    </div>
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {video.url}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-primary"
                      disabled={isAdding || editingVideo !== null}
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="btn btn-sm btn-error glass border-0"
                      disabled={isAdding || editingVideo !== null}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoManager; 