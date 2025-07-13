'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videos, VideoItem } from "@/data/videos";
import NicovideoThumbnail from "./NicovideoThumbnail";

export default function VideoCards() {
  const [shuffledVideos, setShuffledVideos] = useState<VideoItem[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [touchedCard, setTouchedCard] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });

  // ランダムな色を生成する関数
  const generateRandomColor = () => {
    const colors = [
      'bg-gradient-to-bl from-indigo-500 from-0% via-lime-100 via-50% to-fuchsia-500 to-100%', 'bg-gradient-to-t from-emerald-100 from-0% via-red-500 via-50% to-cyan-600 to-100%', 'bg-gradient-to-b from-pink-100 from-0% via-teal-300 via-50% to-green-500 to-100%', 'bg-gradient-to-t from-cyan-300 from-0% via-purple-400 via-50% to-zinc-100 to-100%', 
      'bg-gradient-to-b from-gray-600 from-0% via-rose-400 via-50% to-orange-500 to-100%', 'bg-gradient-to-t from-orange-300 from-0% to-sky-500 to-100%', 'bg-gradient-to-tl from-stone-500 from-0% via-rose-200 via-50% to-green-300 to-100%', 'bg-gradient-to-tr from-yellow-700 from-0% to-blue-600 to-100%',
      'bg-gradient-to-r from-blue-200 from-0% via-emerald-50 via-50% to-slate-300 to-100%', 'bg-gradient-to-br from-green-300 from-0% to-red-300 to-100%'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // ランダムなサイズを生成する関数
  const generateRandomSize = () => {
    const sizes = ['w-16 h-16', 'w-20 h-20', 'w-24 h-24', 'w-28 h-28', 'w-32 h-32', 'w-36 h-36', 'w-40 h-40'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  useEffect(() => {
    // 全動画を取得してランダムに並び替え
    const shuffled = [...videos].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledVideos(shuffled);

    // ウィンドウサイズの取得
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 初期サイズ設定
    handleResize();

    // リサイズイベントリスナー
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // カード位置計算関数
  const getCardPosition = (index: number) => {
    // デスクトップ（3列）
    if (windowSize.width >= 1024) {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const cardWidth = 100 / 3;
      const cardHeight = 280;
      const gap = 64;
      return {
        left: `${col * cardWidth + cardWidth / 2}%`,
        top: `${row * (cardHeight + gap) + cardHeight / 2}px`
      };
    }
    // タブレット（2列）
    else if (windowSize.width >= 768) {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const cardWidth = 100 / 2;
      const cardHeight = 280;
      const gap = 64;
      return {
        left: `${col * cardWidth + cardWidth / 2}%`,
        top: `${row * (cardHeight + gap) + cardHeight / 2}px`
      };
    }
    // モバイル（1列）
    else {
      const cardHeight = 280;
      const gap = 64;
      return {
        left: '50%',
        top: `${index * (cardHeight + gap) + cardHeight / 2}px`
      };
    }
  };

  return (
    <div className="py-16 bg-base-200">
      <div className="w-full px-4 max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            マンスリーピックアップ
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto mb-8">
            2025年7月
          </p>
        </div>

        {/* 動画リスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 relative">
          
          {shuffledVideos.map((video, index) => {
            const isHovered = hoveredCard === video.id;
            const isTouched = touchedCard === video.id;
            const isActive = isHovered || isTouched;
            
            return (
            <motion.div
              key={video.id}
                className="card bg-base-100 shadow-lg cursor-pointer group relative transition-all duration-300 ease-out hover:shadow-2xl w-full max-w-sm mx-auto min-h-[280px] z-10 overflow-visible"
              onClick={() => window.open(video.url, '_blank')}
                onHoverStart={() => setHoveredCard(video.id)}
                onHoverEnd={() => setHoveredCard(null)}
                onTouchStart={() => setTouchedCard(video.id)}
                onTouchEnd={() => setTouchedCard(null)}
              whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
              style={{ 
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              >
                {/* 装飾図形 - カード内に配置 */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'opacity', transform: 'translateZ(0)' }}>
                  {/* 丸 - 上方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()} rounded-full`}
                    style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 80,
                      y: -150,
                      scale: 1.4,
                      rotate: 360,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 8, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 三角 - 左上方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()}`}
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: -170,
                      y: -170,
                      scale: 1.4,
                      rotate: 360,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 10, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 四角 - 右上方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()}`}
                    style={{ transform: 'translate(-50%, -50%) translateZ(0) rotate(45deg)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 45 }}
                    animate={isActive ? {
                      x: 180,
                      y: -100,
                      scale: 1.4,
                      rotate: 405,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 7, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 45,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 渦巻き線 - 右方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} border-4 border-white border-dashed rounded-full`}
                    style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 220,
                      scale: 1.4,
                      rotate: 720,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 12, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 渦巻き線2 - 左方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} border-4 border-gray-400 border-dotted rounded-full`}
                    style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: -220,
                      y: 100,
                      scale: 1.4,
                      rotate: 720,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 12, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 小さな丸 - 下方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()} rounded-full`}
                    style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      y: 120,
                      scale: 1.4,
                      rotate: -360,
                      transition: { 
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 6, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 六角形 - 左上方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()}`}
                    style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: -10,
                      y: -20,
                      scale: 1.4,
                      rotate: 240,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 9, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 星型（20個のトゲ） - 右下方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()}`}
                    style={{ 
                      clipPath: 'polygon(100% 50%,69.66% 53.67%,96.62% 68.06%,67% 60.53%,86.95% 83.68%,62.05% 65.96%,72.29% 94.76%,55.47% 69.24%,54.61% 99.79%,48.15% 69.91%,36.32% 98.09%,41.09% 67.9%,19.87% 89.9%,35.22% 63.47%,7.49% 76.32%,31.35% 57.22%,0.85% 59.19%,30% 50%,0.85% 40.81%,31.35% 42.78%,7.49% 23.68%,35.22% 36.53%,19.87% 10.1%,41.09% 32.1%,36.32% 1.91%,48.15% 30.09%,54.61% 0.21%,55.47% 30.76%,72.29% 5.24%,62.05% 34.04%,86.95% 16.32%,67% 39.47%,96.62% 31.94%,69.66% 46.33%)',
                      transform: 'translate(-50%, -50%) translateZ(0) scale(0.8)'
                    }}
                    initial={{ x: 0, y: 0, scale: 0.8, rotate: 0 }}
                    animate={isActive ? {
                      x: 190,
                      y: 190,
                      scale: 1.4,
                      rotate: 180,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 5, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 0.8,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* ダイヤモンド - 左下方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${generateRandomSize()} ${generateRandomColor()}`}
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', transform: 'translate(-50%, -50%) translateZ(0)' }}
                    initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: -150,
                      y: 120,
                      scale: 1.4,
                      rotate: 90,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 4, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                </div>
              {/* サムネイル背景（ホバー時） */}
              <motion.div
                  className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              >
                <NicovideoThumbnail
                  videoId={video.id}
                  width={400}
                  height={225}
                  useServerApi={true}
                  className="w-full h-full object-cover"
                />
                {/* 暗いオーバーレイ */}
                  <div className="absolute inset-0 bg-black/30" />
              </motion.div>

              {/* 通常のサムネイル（非ホバー時） */}
              <motion.figure
                  className="relative z-20 opacity-100 group-hover:opacity-0 transition-all duration-500 ease-out"
              >
                <NicovideoThumbnail
                  videoId={video.id}
                  width={400}
                  height={225}
                  useServerApi={true}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </motion.figure>

              {/* 動画情報（常に表示） */}
                {/* カード情報の背景 */}
              <motion.div 
                  className="absolute inset-0 top-48 bg-base-100 z-10"
                layout
                />
                
                {/* カード情報の文字 */}
                <motion.div
                  className="card-body p-4 relative z-30 flex-1"
                  layout
                >
                  <motion.h3 
                    className="card-title text-base line-clamp-2 transition-all duration-500 ease-out group-hover:text-white group-hover:drop-shadow-lg"
                    layout
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                >
                  {video.title}
                </motion.h3>
                
                <motion.p 
                    className="text-sm mt-1 truncate transition-all duration-500 ease-out group-hover:text-white/90 group-hover:drop-shadow-lg"
                  layout
                    whileHover={{ 
                      y: -1,
                      transition: { duration: 0.3, ease: "easeOut", delay: 0.1 }
                    }}
                    title={`${video.artist} / ${video.vocaloid}`}
                >
                  {video.artist} / {video.vocaloid}
                </motion.p>
                
                {/* 外部リンクインジケーター */}
                <motion.div 
                  className="flex items-center justify-between mt-3 text-xs transition-colors group-hover:text-white/70 group-hover:drop-shadow-lg"
                  layout
                >
                  <span>ニコニコ動画</span>
                  <motion.svg 
                    className="w-3 h-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                      whileHover={{ 
                        x: 3,
                        y: -2,
                        scale: 1.2,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </motion.svg>
                </motion.div>
              </motion.div>
            </motion.div>
            );
          })}
        </div>
        
        {/* フッター */}
        <div className="text-center mt-12">
          <p className="text-base-content/60 text-sm">
            ホバー/タッチでプレビュー、クリックで再生
          </p>
        </div>
      </div>
    </div>
  );
}
