'use client';

import { useState } from 'react';
import VideoManager from '../../components/VideoManager';
import { VideoItem } from '../../data/videos';
import Link from "next/link";

export default function AdminPage() {
  const [videos, setVideos] = useState<VideoItem[]>([
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
  ]);

  const handleVideosChange = (newVideos: VideoItem[]) => {
    setVideos(newVideos);
    // ここで実際のアプリケーションでは、データベースやAPIに保存します
    console.log('動画データが更新されました:', newVideos);
  };

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="glass sticky top-0 z-50">
        <div className="navbar max-w-7xl mx-auto px-4">
          <div className="navbar-start">
            <h1 className="text-2xl font-bold text-white">動画管理画面</h1>
          </div>
          <div className="navbar-end">
            <Link href="/" className="btn btn-primary glass border-0">トップへ戻る</Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card glass border-0">
          <div className="card-body">
            <VideoManager videos={videos} onVideosChange={handleVideosChange} />
          </div>
        </div>
      </main>
    </div>
  );
} 