'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ThumbnailTest() {
  const [videoId, setVideoId] = useState('sm45178436');
  const [thumbnailData, setThumbnailData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThumbnail = async () => {
    if (!videoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/thumbnail/nicovideo?id=${videoId}`);
      const data = await response.json() as any;
      
      if (data.success) {
        setThumbnailData(data.data);
      } else {
        setError(data.error || 'サムネイルの取得に失敗しました');
      }
    } catch (err) {
      setError('APIリクエストに失敗しました');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            ニコニコ動画サムネイル取得テスト
          </h1>
          
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="動画ID (例: sm45178436)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={fetchThumbnail}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '取得中...' : 'サムネイル取得'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {thumbnailData && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">取得結果</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">サムネイル画像</h3>
                    <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={thumbnailData.thumbnailUrl}
                        alt={thumbnailData.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">動画ID</h3>
                      <p className="text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">
                        {thumbnailData.videoId}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">タイトル</h3>
                      <p className="text-gray-900">{thumbnailData.title}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">サムネイルURL</h3>
                      <a
                        href={thumbnailData.thumbnailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {thumbnailData.thumbnailUrl}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">使用方法</h3>
                <p className="text-blue-700 text-sm">
                  APIエンドポイント: <code className="bg-blue-100 px-2 py-1 rounded">/api/thumbnail/nicovideo?id=動画ID</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 