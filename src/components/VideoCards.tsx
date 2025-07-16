'use client'

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { videos, VideoItem } from "@/data/videos";
import NicovideoThumbnail from "./NicovideoThumbnail";
import Link from "next/link";
import { getYearMonthFromPath } from "@/data/getYearMonthFromPath";
import throttle from 'lodash.throttle';
import { isMobile as isMobileDevice } from 'react-device-detect';

// props型を追加
interface VideoCardsProps {
  videoList?: VideoItem[];
  dataPath?: string; // 追加
}

export default function VideoCards({ videoList, dataPath }: VideoCardsProps) {
  const [shuffledVideos, setShuffledVideos] = useState<VideoItem[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [touchedCard, setTouchedCard] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const cardsRef = useRef<HTMLDivElement>(null);
  // SSR対策: マウント前は描画しない
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // 2列以上かどうかを判定するstateを追加
  const [isMultiColumn, setIsMultiColumn] = useState(false);
  useEffect(() => { 
    setMounted(true);
    setIsMobile(isMobileDevice);
    // 2列以上かどうかを判定（例: 640px以上で2列）
    const checkMultiColumn = () => {
      setIsMultiColumn(window.innerWidth >= 640); // sm: 640px以上で2列
    };
    checkMultiColumn();
    window.addEventListener('resize', checkMultiColumn);
    return () => window.removeEventListener('resize', checkMultiColumn);
  }, []);

  // スマホ用: 中央付近にあるカードIDを管理
  const [centerActiveId, setCenterActiveId] = useState<string | null>(null);
  // カードごとのref配列
  const cardItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 図形の種類数（丸・三角・四角・渦巻き線・渦巻き線2・小丸・六角形・星型・ダイヤモンド）
  const SHAPE_COUNT = 7;

  // useMemo で videos → videoList ?? videos に変更
  const fixedColorsAndSizes = useMemo(() => {
    const colors = [
      'bg-gradient-to-bl from-indigo-500 from-0% via-lime-100 via-50% to-fuchsia-500 to-100%',
      'bg-gradient-to-t from-emerald-100 from-0% via-red-500 via-50% to-cyan-600 to-100%',
      'bg-gradient-to-b from-pink-100 from-0% via-teal-300 via-50% to-green-500 to-100%',
      'bg-gradient-to-t from-cyan-300 from-0% via-purple-400 via-50% to-zinc-100 to-100%',
      'bg-gradient-to-b from-gray-600 from-0% via-rose-400 via-50% to-orange-500 to-100%',
      'bg-gradient-to-t from-orange-300 from-0% to-sky-500 to-100%',
      'bg-gradient-to-tl from-stone-500 from-0% via-rose-200 via-50% to-green-300 to-100%',
      'bg-gradient-to-tr from-yellow-700 from-0% to-blue-600 to-100%',
      'bg-gradient-to-r from-blue-200 from-0% via-emerald-50 via-50% to-slate-300 to-100%',
      'bg-gradient-to-br from-green-300 from-0% to-red-300 to-100%'
    ];
    const sizes = ['w-16 h-16', 'w-20 h-20', 'w-24 h-24', 'w-28 h-28', 'w-32 h-32', 'w-36 h-36', 'w-40 h-40'];
    // 各動画ごとに図形ごとに色・サイズをランダムで決定
    return (videoList ?? videos).map((_, videoIdx) =>
      Array.from({ length: SHAPE_COUNT }, (_, shapeIdx) => {
        // 疑似乱数: 動画indexと図形indexで決定的に
        const colorIdx = (videoIdx * 31 + shapeIdx * 17) % colors.length;
        const sizeIdx = (videoIdx * 13 + shapeIdx * 7) % sizes.length;
        return {
          color: colors[colorIdx],
          size: sizes[sizeIdx],
        };
      })
    );
  }, [videoList]);

  // 固定化された色・サイズを取得する関数
  const getFixedColor = (videoIdx: number, shapeIdx: number) => {
    return fixedColorsAndSizes[videoIdx]?.[shapeIdx]?.color || fixedColorsAndSizes[0][0].color;
  };
  const getFixedSize = (videoIdx: number, shapeIdx: number) => {
    return fixedColorsAndSizes[videoIdx]?.[shapeIdx]?.size || fixedColorsAndSizes[0][0].size;
  };

  // 年月の表示
  const yearMonth = dataPath ? getYearMonthFromPath(dataPath) : null;

  useEffect(() => {
    // 全動画を取得してランダムに並び替え
    const shuffled = [...(videoList ?? videos)].sort(() => Math.random() - 0.5);
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
  }, [videoList]);

  // スクロール・リサイズ時に中央付近判定
  useEffect(() => {
    if (!mounted) return;
    if (!isMobile) return;
    const handleCheckCenter = () => {
      const windowCenter = window.innerHeight / 2;
      let foundId: string | null = null;
      getDisplayVideos().forEach((video, idx) => {
        const ref = cardItemRefs.current[idx];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        if (Math.abs(cardCenter - windowCenter) < 200) {
          foundId = video.id;
        }
      });
      setCenterActiveId(foundId);
    };
    window.addEventListener('scroll', handleCheckCenter, { passive: true });
    window.addEventListener('resize', handleCheckCenter);
    // 初回も実行
    handleCheckCenter();
    return () => {
      window.removeEventListener('scroll', handleCheckCenter);
      window.removeEventListener('resize', handleCheckCenter);
    };
  }, [mounted, windowSize, currentPage, shuffledVideos]);

  if (!videoList || videoList.length === 0) {
    return <div className="text-center py-12">動画データがありません</div>;
  }

  // 表示する動画を決定（PCでは全件、スマホではページネーション）
  const getDisplayVideos = () => {
    if (windowSize.width >= 768) {
      // PC・タブレットでは全件表示
      return shuffledVideos;
    } else {
      // スマホでは10個区切りで表示
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return shuffledVideos.slice(startIndex, endIndex);
    }
  };

  // 総ページ数を計算
  const totalPages = Math.ceil(shuffledVideos.length / itemsPerPage);

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // カードコンポーネントのトップへスクロール
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-16 bg-[#EEEEEE] overflow-hidden">
      <div className="w-full px-4 max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          {yearMonth && (
            <div className="text-lg font-semibold mb-2">{yearMonth}</div>
          )}
          <h2 className="text-4xl font-bold text-base-content mb-4">
            MONTHLY PICKUP PLAYLIST
          </h2>
        </div>

        {/* 動画リスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 relative" ref={cardsRef}>
          
          {getDisplayVideos().map((video, index) => {
            const isHovered = hoveredCard === video.id;
            const isTouched = touchedCard === video.id;
            // PCは常にホバー/タッチ、スマホ2列以上はタッチのみ、スマホ1列は中央判定
            const isActive = mounted && (
              isMobile
                ? (
                  isMultiColumn
                    ? isTouched // スマホ2列以上はタッチのみ
                    : centerActiveId === video.id // スマホ1列は中央判定
                )
                : (isHovered || isTouched) // PCは常にホバー/タッチ
            );
            // スマホ2列以上のときだけホバーイベントを無効化
            const isTouchOnly = isMobile && isMultiColumn;
            return (
            <motion.div
              key={video.id}
                className="card bg-[#EEEEEE] shadow-lg cursor-pointer group relative transition-all duration-300 ease-out hover:shadow-2xl w-full max-w-sm mx-auto min-h-[280px] z-10 overflow-visible"
              ref={el => { cardItemRefs.current[index] = el; }}
              onClick={() => window.open(video.url, '_blank')}
              onHoverStart={isTouchOnly ? undefined : () => setHoveredCard(video.id)}
              onHoverEnd={isTouchOnly ? undefined : () => setHoveredCard(null)}
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
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 0)} ${getFixedColor(index, 0)} rounded-full pointer-events-none`}
                    style={{ transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% + 80px)',
                      y: 'calc(-50% - 150px)',
                      scale: 1.4,
                      rotate: 360,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 8, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 三角 - 左上方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 1)} ${getFixedColor(index, 1)} pointer-events-none`}
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% - 170px)',
                      y: 'calc(-50% - 170px)',
                      scale: 1.4,
                      rotate: 360,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 10, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 四角 - 右上方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 2)} ${getFixedColor(index, 2)} pointer-events-none`}
                    style={{ transform: 'translateZ(0) rotate(45deg)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 45 }}
                    animate={isActive ? {
                      x: 'calc(-50% + 180px)',
                      y: 'calc(-50% - 100px)',
                      scale: 1.4,
                      rotate: 405,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 7, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 45,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 渦巻き線 - 右方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 3)} border-4 border-white border-dashed rounded-full pointer-events-none`}
                    style={{ transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% + 220px)',
                      y: '-50%',
                      scale: 1.4,
                      rotate: 720,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 12, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 渦巻き線2 - 左方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 4)} border-4 border-gray-400 border-dotted rounded-full pointer-events-none`}
                    style={{ transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% - 220px)',
                      y: 'calc(-50% + 100px)',
                      scale: 1.4,
                      rotate: 720,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 12, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 小さな丸 - 下方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 5)} ${getFixedColor(index, 5)} rounded-full pointer-events-none`}
                    style={{ transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: '-50%',
                      y: 'calc(-50% + 120px)',
                      scale: 1.4,
                      rotate: -360,
                      transition: { 
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 6, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* 六角形 - 左上方向に飛び出す
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 6)} ${getFixedColor(index, 6)} pointer-events-none`}
                    style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% - 10px)',
                      y: 'calc(-50% - 20px)',
                      scale: 1.4,
                      rotate: 240,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 9, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 1,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  /> */}
                  {/* 星型（20個のトゲ） - 右下方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 7)} ${getFixedColor(index, 7)} pointer-events-none`}
                    style={{ 
                      clipPath: 'polygon(100% 50%,69.66% 53.67%,96.62% 68.06%,67% 60.53%,86.95% 83.68%,62.05% 65.96%,72.29% 94.76%,55.47% 69.24%,54.61% 99.79%,48.15% 69.91%,36.32% 98.09%,41.09% 67.9%,19.87% 89.9%,35.22% 63.47%,7.49% 76.32%,31.35% 57.22%,0.85% 59.19%,30% 50%,0.85% 40.81%,31.35% 42.78%,7.49% 23.68%,35.22% 36.53%,19.87% 10.1%,41.09% 32.1%,36.32% 1.91%,48.15% 30.09%,54.61% 0.21%,55.47% 30.76%,72.29% 5.24%,62.05% 34.04%,86.95% 16.32%,67% 39.47%,96.62% 31.94%,69.66% 46.33%)',
                      transform: 'translateZ(0) scale(0.8)'
                    }}
                    initial={{ x: '-50%', y: '-50%', scale: 0.8, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% + 190px)',
                      y: 'calc(-50% + 190px)',
                      scale: 1.4,
                      rotate: 180,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 5, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
                      scale: 0.8,
                      rotate: 0,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                  />
                  {/* ダイヤモンド - 左下方向に飛び出す */}
                  <motion.div
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 0)} ${getFixedColor(index, 0)} pointer-events-none`}
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', transform: 'translateZ(0)' }}
                    initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% - 150px)',
                      y: 'calc(-50% + 120px)',
                      scale: 1.4,
                      rotate: 90,
                      transition: { 
                        x: { duration: 0.3, ease: "easeOut" },
                        y: { duration: 0.3, ease: "easeOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 4, ease: "linear", repeat: Infinity }
                      }
                    } : {
                      x: '-50%',
                      y: '-50%',
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
                  <div className="absolute inset-0 bg-black/10" />
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
                  className="absolute inset-0 top-48 bg-base-200 z-10 rounded-b-lg"
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
                    title={video.artist}
                >
                  {video.artist}
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
          {/* スマホ用ページネーション */}
          {windowSize.width < 768 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline disabled:opacity-50"
              >
                前へ
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
          
          {/* ページ情報表示 */}
          {windowSize.width < 768 && (
            <p className="text-base-content/60 text-sm mb-4">
              {currentPage} / {totalPages} ページ ({shuffledVideos.length}件中 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, shuffledVideos.length)}件)
            </p>
          )}
          
          <p className="text-base-content/60 text-sm">
            本サイトは楽曲との出会いの偏りを減らすため<br></br>更新するたび、ランダムに並び替えています。
          </p>
              <p className="text-base-content/60 text-sm">
             <Link 
               href="https://www.nicovideo.jp/user/131010307/mylist/76687470" 
             >
               https://www.nicovideo.jp/user/131010307/mylist/76687470
             </Link>
           </p>
        </div>
      </div>
    </div>
  );
}
