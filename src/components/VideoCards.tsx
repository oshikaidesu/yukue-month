'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import NicovideoThumbnail from "./NicovideoThumbnail";
import { getYearMonthFromPath } from "@/data/getYearMonthFromPath";
import { isMobile as isMobileDevice } from 'react-device-detect';


interface VideoItem {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail?: string; // ローカルサムネイルパス
  ogpThumbnailUrl?: string; // OGPサムネイルURL
  // 必要に応じて他のプロパティもここに追加
}
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
  // 500エラーが継続する動画のIDを管理（非公開または問題のある動画）
  const [privateVideoIds, setPrivateVideoIds] = useState<Set<string>>(new Set());
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
    return (videoList ?? []).map((_, videoIdx) =>
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
    // 全動画を取得してランダムに並び替え（500エラーが継続する動画を除外）
    const validVideos = (videoList ?? []).filter(video => !privateVideoIds.has(video.id));
    const shuffled = [...validVideos].sort(() => Math.random() - 0.5);
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
  }, [videoList, privateVideoIds]);

  // 500エラーが継続する動画を検出した時のハンドラー
  const handlePrivateVideo = useCallback((videoId: string) => {
    console.log(`500エラーが継続する動画を除外: ${videoId}`);
    setPrivateVideoIds(prev => new Set(prev).add(videoId));
  }, []);

  // 表示する動画を決定（PCでは全件、スマホではページネーション）
  const getDisplayVideos = useCallback(() => {
    // 500エラーが継続する動画を除外
    const validVideos = shuffledVideos.filter(video => !privateVideoIds.has(video.id));
    
    if (windowSize.width >= 768) {
      // PC・タブレットでは全件表示
      return validVideos;
    } else {
      // スマホでは10個区切りで表示
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return validVideos.slice(startIndex, endIndex);
    }
  }, [windowSize.width, shuffledVideos, currentPage, itemsPerPage, privateVideoIds]);

  // 総ページ数を計算（500エラーが継続する動画を除外した数で計算）
  const validVideosCount = shuffledVideos.filter(video => !privateVideoIds.has(video.id)).length;
  const totalPages = Math.ceil(validVideosCount / itemsPerPage);

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // カードコンポーネントのトップへスクロール
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
  }, [mounted, windowSize, currentPage, shuffledVideos, isMobile, getDisplayVideos]);

  // サムネイル読み込み状態を管理
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState<boolean[]>([]);
  const handleThumbnailLoad = useCallback((idx: number) => {
    setThumbnailsLoaded(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
  }, []);

  if (!mounted) {
    return null; // もしくは <div>Loading...</div> など
  }

  if (!videoList || videoList.length === 0) {
    return <div className="text-center py-12">動画データがありません</div>;
  }

  return (
    <div className="py-16 bg-none overflow-hidden relative z-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 relative" ref={cardsRef}>
          
          {getDisplayVideos().map((video, index) => {
            // 500エラーが継続する動画はスキップ
            if (privateVideoIds.has(video.id)) {
              return null;
            }
            
            const isHovered = hoveredCard === video.id;
            const isTouched = touchedCard === video.id;
            // サムネイル読み込み済みかどうか
            const isThumbnailLoaded = thumbnailsLoaded[index];
            // PCは常にホバー/タッチ、スマホ2列以上はタッチのみ、スマホ1列は中央判定
            const isActive = mounted && isThumbnailLoaded && (
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
                className={`card bg-[#EEEEEE] shadow-lg cursor-pointer group relative transition-all duration-300 ease-out hover:shadow-2xl w-full max-w-xs mx-auto min-h-[240px] z-10 overflow-visible ${!isThumbnailLoaded ? 'opacity-50 pointer-events-none' : ''}`}
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
                  <motion.img
                    src="/dashed-circle-svgrepo-com.svg"
                    alt="dashed circle"
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 3)} pointer-events-none`}
                    style={{
                      transform: 'translateZ(0)'
                    }}
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
                  <motion.img
                    src="/dashed-circle-gray.svg"
                    // alt="dashed circle"
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 4)} pointer-events-none`}
                    style={{
                      transform: 'translateZ(0)'
                    }}
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
                  {/* 星型（svg） - 右下方向に飛び出す */}
                  <motion.img
                    src="/point-star-1.svg"
                    alt="star"
                    className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 7)} pointer-events-none`}
                    style={{
                      transform: 'translateZ(0) scale(0.8)',
                    }}
                    initial={{ x: '-50%', y: '-50%', scale: 0.8, rotate: 0 }}
                    animate={isActive ? {
                      x: 'calc(-50% + 200px)',
                      y: 'calc(-50% + 150px)',
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
              {/* サムネイル（共通） */}
              <motion.figure className="relative z-20 overflow-hidden">
                <NicovideoThumbnail
                  videoId={video.id ?? ""}
                  videoUrl={video.url}
                  thumbnail={video.thumbnail}
                  ogpThumbnailUrl={video.ogpThumbnailUrl}
                  width={400}
                  height={225}
                  className="w-full h-40 object-cover rounded-t-lg transition-all duration-500 ease-out"
                  onLoad={() => handleThumbnailLoad(index)}
                  onPrivateVideo={handlePrivateVideo}
                  loading="lazy"
                />
              </motion.figure>
              
              {/* ホバー時の全面画像表示 */}
              <motion.div 
                className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isThumbnailLoaded && (
                  <NicovideoThumbnail
                    videoId={video.id ?? ""}
                    videoUrl={video.url}
                    thumbnail={video.thumbnail}
                    ogpThumbnailUrl={video.ogpThumbnailUrl}
                    width={400}
                    height={280}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                {/* ホバー時の暗いオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 via-gray-800/20 to-transparent" />
                
                {/* ホバー時の動画情報 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold line-clamp-2 mb-1 drop-shadow-lg">
                    {video.title}
                  </h3>
                  <p className="text-sm opacity-90 truncate flex items-center justify-between drop-shadow-lg">
                    {video.artist}
                    <svg 
                      className="w-4 h-4 ml-2 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </p>
                </div>
              </motion.div>

              {/* 動画情報（常に表示） */}
                {/* カード情報の背景 */}
              <motion.div 
                  className="absolute inset-0 top-40 bg-base-200 z-10 rounded-b-lg"
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
                    className="text-sm mt-1 truncate transition-all duration-500 ease-out group-hover:text-white/90 group-hover:drop-shadow-lg flex items-center justify-between"
                  layout
                    whileHover={{ 
                      y: -1,
                      transition: { duration: 0.3, ease: "easeOut", delay: 0.1 }
                    }}
                    title={video.artist}
                >
                  {video.artist}
                  {/* 外部リンクインジケーターを右端に配置 */}
                  <motion.svg 
                    className="w-3 h-3 ml-2 flex-shrink-0" 
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
                </motion.p>
                {/* 外部リンクインジケーターの元の位置は削除 */}
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
          {/* {windowSize.width < 768 && (
            <p className="text-base-content/60 text-sm mb-4">
              {currentPage} / {totalPages} ページ ({validVideosCount}件中 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, validVideosCount)}件)
            </p>
          )} */}
          
          <p className="text-base-content/60 text-sm">
            本サイトは楽曲との出会いの偏りを減らすため<br></br>更新するたび、ランダムに並び替えています
          </p>
        </div>
      </div>
    </div>
  );
}
