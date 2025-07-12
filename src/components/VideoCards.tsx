'use client'

import { useState } from 'react'

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  category: string
  url: string
}

const videos: Video[] = [
  {
    id: 1,
    title: "Next.js 15の新機能を徹底解説",
    description: "Next.js 15で追加された新機能について詳しく解説します。App Router、Server Components、そしてパフォーマンスの改善点について学びましょう。",
    thumbnail: "/placeholder-video.jpg",
    duration: "15:30",
    views: "12.5K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 2,
    title: "daisyUIで美しいUIを作る方法",
    description: "daisyUIを使用して、モダンで美しいユーザーインターフェースを作成する方法を紹介します。コンポーネントの使い方からカスタマイズまで。",
    thumbnail: "/placeholder-video.jpg",
    duration: "22:15",
    views: "8.9K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 3,
    title: "TypeScriptの型システム完全ガイド",
    description: "TypeScriptの型システムについて、基礎から応用まで詳しく解説します。型安全性を高めるテクニックも紹介。",
    thumbnail: "/placeholder-video.jpg",
    duration: "45:20",
    views: "25.3K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 4,
    title: "React Hooksの実践的な使い方",
    description: "React Hooksを使った実践的な開発テクニックを紹介します。カスタムフックの作成方法も含めて解説。",
    thumbnail: "/placeholder-video.jpg",
    duration: "18:45",
    views: "15.7K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 5,
    title: "Tailwind CSSでレスポンシブデザイン",
    description: "Tailwind CSSを使用してレスポンシブデザインを実装する方法を紹介します。モバイルファーストの考え方も解説。",
    thumbnail: "/placeholder-video.jpg",
    duration: "32:10",
    views: "11.2K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 6,
    title: "Webアプリケーションのセキュリティ",
    description: "Webアプリケーション開発におけるセキュリティの重要性と実装方法について詳しく解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "28:30",
    views: "9.8K",
    category: "セキュリティ",
    url: "#"
  },
  {
    id: 7,
    title: "Vue.js 3 Composition API入門",
    description: "Vue.js 3のComposition APIについて、Options APIとの違いや実践的な使い方を詳しく解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "35:15",
    views: "14.2K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 8,
    title: "Figmaでプロトタイプ作成",
    description: "Figmaを使用したプロトタイプ作成の基本から応用まで、実践的なテクニックを紹介します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "42:30",
    views: "7.6K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 9,
    title: "Node.jsでAPI開発",
    description: "Node.jsとExpress.jsを使用したRESTful APIの開発方法について、実践的な例を交えて解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "38:45",
    views: "16.8K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 10,
    title: "CSS GridとFlexboxの使い分け",
    description: "CSS GridとFlexboxの特徴と使い分けについて、実践的なレイアウト例を交えて詳しく解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "25:20",
    views: "13.4K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 11,
    title: "Dockerコンテナ化入門",
    description: "Dockerを使用したアプリケーションのコンテナ化について、基礎から実践まで詳しく解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "50:10",
    views: "19.1K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 12,
    title: "GraphQL vs REST API",
    description: "GraphQLとREST APIの比較について、それぞれの特徴と使い分けを実践的な例で解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "33:25",
    views: "11.7K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 13,
    title: "Adobe XDでUIデザイン",
    description: "Adobe XDを使用したUIデザインのワークフローについて、実践的なテクニックを紹介します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "29:40",
    views: "8.3K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 14,
    title: "AWS Lambda関数開発",
    description: "AWS Lambdaを使用したサーバーレス関数の開発方法について、実践的な例を交えて解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "44:15",
    views: "15.9K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 15,
    title: "Sketchでアイコンデザイン",
    description: "Sketchを使用したアイコンデザインの基本から応用まで、実践的なテクニックを紹介します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "27:30",
    views: "6.8K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 16,
    title: "OAuth 2.0認証実装",
    description: "OAuth 2.0を使用した認証システムの実装方法について、セキュリティの観点から詳しく解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "41:20",
    views: "12.3K",
    category: "セキュリティ",
    url: "#"
  },
  {
    id: 17,
    title: "React Nativeアプリ開発",
    description: "React Nativeを使用したクロスプラットフォームアプリ開発について、実践的な例を交えて解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "47:35",
    views: "18.6K",
    category: "プログラミング",
    url: "#"
  },
  {
    id: 18,
    title: "InVisionでプロトタイプ作成",
    description: "InVisionを使用したプロトタイプ作成の基本から応用まで、実践的なテクニックを紹介します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "31:45",
    views: "9.2K",
    category: "デザイン",
    url: "#"
  },
  {
    id: 19,
    title: "SQLインジェクション対策",
    description: "SQLインジェクション攻撃の仕組みと対策方法について、実践的な例を交えて詳しく解説します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "36:50",
    views: "14.7K",
    category: "セキュリティ",
    url: "#"
  },
  {
    id: 20,
    title: "Python機械学習入門",
    description: "Pythonを使用した機械学習の基礎から実践まで、scikit-learnを使った実践的な例を紹介します。",
    thumbnail: "/placeholder-video.jpg",
    duration: "52:15",
    views: "21.3K",
    category: "プログラミング",
    url: "#"
  }
]

export default function VideoCards() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [favorites, setFavorites] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const categories = ['all', 'プログラミング', 'デザイン', 'セキュリティ', 'AI・機械学習', 'モバイル開発', 'DevOps', 'データベース', 'フロントエンド', 'バックエンド', 'クラウド', 'ブロックチェーン']
  const itemsPerPage = 10 // 1ページあたりの表示件数
  
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory)

  // ページネーション計算
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVideos = filteredVideos.slice(startIndex, endIndex)

  const toggleFavorite = (videoId: number) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  // ページ変更時にカードセクションの先頭にスクロール
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // カードセクションの先頭にスクロール
    const cardsSection = document.getElementById('video-cards-section')
    if (cardsSection) {
      cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // カテゴリ変更時にページを1に戻す
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-base-content mb-4">
          おすすめ動画
        </h2>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          厳選された動画コンテンツをお楽しみください。新しい発見と学びをお届けします。
        </p>
      </div>

      {/* カテゴリフィルター */}
      <div className="mb-8">
        <div className="tabs tabs-boxed overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max px-4">
            {categories.map(category => (
              <a
                key={category}
                className={`tab tab-sm whitespace-nowrap ${selectedCategory === category ? 'tab-active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category === 'all' ? 'すべて' : category}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div className="text-center mb-6">
        <p className="text-base-content/70">
          {filteredVideos.length}件中 {startIndex + 1}-{Math.min(endIndex, filteredVideos.length)}件を表示
        </p>
      </div>

      {/* 動画カードグリッド */}
      <div id="video-cards-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentVideos.map(video => (
          <div key={video.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <div className="badge badge-primary">{video.duration}</div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button className="btn btn-circle btn-primary opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </figure>
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="card-title text-lg line-clamp-2">{video.title}</h3>
                  <p className="text-base-content/70 text-sm line-clamp-2 mt-2">{video.description}</p>
                </div>
                <button 
                  className="btn btn-ghost btn-sm btn-circle ml-2"
                  onClick={() => toggleFavorite(video.id)}
                >
                  <svg className={`w-5 h-5 ${favorites.includes(video.id) ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                    </svg>
                    {video.views}
                  </span>
                  <div className="badge badge-outline badge-sm">{video.category}</div>
                </div>
                <button className="btn btn-primary btn-sm">
                  視聴する
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join">
            {/* 前のページボタン */}
            <button 
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            
            {/* ページ番号ボタン */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            
            {/* 次のページボタン */}
            <button 
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 