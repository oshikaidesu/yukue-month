'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NicovideoThumbnail from "./NicovideoThumbnail";
import CardDecorations from "./CardDecorations";

import { VideoItem } from '@/types/video';
// props型を追加
interface VideoCardsProps {
  videoList: VideoItem[]; // videoListを必須に変更
  yearMonth?: string; // yearMonthを追加
}

export default function VideoCards({ videoList, yearMonth }: VideoCardsProps) {
  const [shuffledVideos, setShuffledVideos] = useState<VideoItem[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [touchedCard, setTouchedCard] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1024, height: 768 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const titleRef = useRef<HTMLHeadingElement>(null);
  // SSR対策: マウント前は描画しない
  const [mounted, setMounted] = useState(false);
  // 2列以上かどうかを判定するstateを追加
  const [isMultiColumn, setIsMultiColumn] = useState(false);
  
  useEffect(() => { 
    setMounted(true);
    // ウィンドウサイズの取得と2列以上かどうかの判定を統合
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
      setIsMultiColumn(width >= 768); // md: 768px以上で2列
    };
    
    // 初期設定
    handleResize();
    
    // リサイズイベントリスナー
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // スマホ用: 中央付近にあるカードIDを管理
  const [centerActiveId, setCenterActiveId] = useState<string | null>(null);
  // カードごとのref配列
  const cardItemRefs = useRef<(HTMLDivElement | null)[]>([]);


  // 色とサイズの配列を定数として定義
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
  const sizes = ['w-16 h-16', 'w-20 h-20', 'w-24 h-24', 'w-28 h-28', 'w-32 h-32', 'w-36 h-36'];

  // 色・サイズを取得する関数（直接計算）
  const getFixedColor = (videoIdx: number, shapeIdx: number) => {
    const colorIdx = (videoIdx * 31 + shapeIdx * 17) % colors.length;
    return colors[colorIdx];
  };
  const getFixedSize = (videoIdx: number, shapeIdx: number) => {
    const sizeIdx = (videoIdx * 13 + shapeIdx * 7) % sizes.length;
    return sizes[sizeIdx];
  };

  // 年月の表示（propsから直接使用）
  // 画面幅でモバイル判定（md: 768px未満）
  const isMobile = windowSize.width < 768;

  useEffect(() => {
    // 全動画を取得してランダムに並び替え
    const shuffled = [...(videoList ?? [])].sort(() => Math.random() - 0.5);
    setShuffledVideos(shuffled);
  }, [videoList]);

  // 表示する動画を決定（PC・タブレットでは全件、スマホではページネーション）
  const displayVideos = isMultiColumn 
    ? shuffledVideos 
    : shuffledVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 総ページ数を計算
  const validVideosCount = shuffledVideos.length;
  const totalPages = Math.ceil(validVideosCount / itemsPerPage);

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // MONTHLY PICKUP PLAYLISTタイトルが中央に来るようにスクロール
    if (titleRef.current) {
      titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  };

  // スクロール・リサイズ時に中央付近判定（スマホのみ）- パフォーマンス最適化版
  useEffect(() => {
    if (!mounted || !isMobile || isMultiColumn) return; // 1列レイアウトのスマホのみ
    
    let ticking = false;
    
    const handleCheckCenter = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const windowCenter = window.innerHeight / 2;
          let foundId: string | null = null;
          
          // 最適化: 全カードをチェックせず、画面に見える範囲のみチェック
          displayVideos.forEach((video, idx) => {
            const ref = cardItemRefs.current[idx];
            if (!ref) return;
            
            const rect = ref.getBoundingClientRect();
            // 画面外のカードはスキップ
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            
            const cardCenter = rect.top + rect.height / 2;
            // 判定範囲を200px→100pxに縮小
            if (Math.abs(cardCenter - windowCenter) < 100) {
              foundId = video.id;
            }
          });
          
          setCenterActiveId(foundId);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleCheckCenter, { passive: true });
    // 初回も実行
    handleCheckCenter();
    return () => {
      window.removeEventListener('scroll', handleCheckCenter);
    };
  }, [mounted, isMobile, isMultiColumn, displayVideos]);

  // サムネイル読み込み状態を管理
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState<boolean[]>([]);
  const handleThumbnailLoad = (idx: number) => {
    setThumbnailsLoaded(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
  };

  if (!mounted) {
    return null; // もしくは <div>Loading...</div> など
  }

  if (!videoList || videoList.length === 0) {
    return <div className="text-center py-12">動画データがありません</div>;
  }

  return (
    <div className="pt-16 bg-none overflow-hidden relative z-10 w-full px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          {yearMonth && (
            <div className="text-lg font-semibold mb-2 font-english">{yearMonth}</div>
          )}
          <h2 className="text-4xl font-bold text-base-content mb-4 relative z-50 font-english tracking-wider" ref={titleRef}>
          Monthly Pickup Playlist
          </h2>
        </div>

        {/* 動画リスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
          
          {displayVideos.map((video, index) => {
            const isHovered = hoveredCard === video.id;
            const isTouched = touchedCard === video.id;
            // サムネイル読み込み済みかどうか
            const isThumbnailLoaded = thumbnailsLoaded[index];
            // md以上はホバー/タッチ、md未満は1列で中央判定
            const isActive = mounted && isThumbnailLoaded && (
              isMultiColumn
                ? (isHovered || isTouched) // md以上: 2列以上はホバー/タッチ
                : centerActiveId === video.id // md未満: 1列は中央判定
            );
            // md未満（1列レイアウト）のときはホバーイベントを無効化
            const isTouchOnly = !isMultiColumn;
            return (
            <motion.div
              key={video.id}
                className={`card cursor-pointer w-full max-w-[300px] mx-auto z-10 overflow-visible ${!isThumbnailLoaded ? 'opacity-50 pointer-events-none' : ''}`}
              ref={el => { cardItemRefs.current[index] = el; }}
              onClick={() => window.open(video.url, '_blank')}
              onHoverStart={isTouchOnly ? undefined : () => setHoveredCard(video.id)}
              onHoverEnd={isTouchOnly ? undefined : () => setHoveredCard(null)}
              onTouchStart={() => setTouchedCard(video.id)}
              onTouchEnd={() => setTouchedCard(null)}
              animate={{
                  scale: isActive ? 1.1 : 1,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
              style={{ 
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              >
                {/* 装飾図形コンポーネント */}
                <CardDecorations
                  isActive={isActive}
                  index={index}
                  isMobile={isMobile}
                  getFixedSize={getFixedSize}
                  getFixedColor={getFixedColor}
                />
                
                {/* カード枠組み */}
                <div className="bg-[#F8F8F8] shadow-lg transition-all duration-300 ease-out hover:shadow-2xl relative overflow-hidden rounded-lg">
                  {/* サムネイル（共通） */}
                  <motion.figure 
                    className="relative z-20 overflow-hidden h-40"
                    style={{
                      willChange: 'transform',
                      perspective: '1000px'
                    }}
                    animate={{
                      scale: isActive ? 1.55 : 1,
                      y: isActive ? '27%' : '0%',
                      transition: { duration: 0.15, ease: "easeOut" } // 0.2s→0.15sに高速化
                    }}
                    initial={{
                      transformOrigin: 'center center'
                    }}
                  >
                <NicovideoThumbnail
                  videoId={video.id ?? ""}
                  videoUrl={video.url}
                  thumbnail={video.thumbnail}
                  ogpThumbnailUrl={video.ogpThumbnailUrl}
                  yearMonth={yearMonth}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover object-center"
                  onLoad={() => handleThumbnailLoad(index)}
                  loading={index < 6 ? "eager" : "lazy"} // 最初の6枚は優先読み込み
                  quality={index < 6 ? 85 : 75} // 優先画像は高画質
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // レスポンシブな画像サイズ
                  priority={index < 3} // 最初の3枚は最高優先度
                />
                  </motion.figure>
              
                  {/* ホバー時の全面画像表示を削除し、トランスフォームアニメーションに置き換え */}
                  <motion.div 
                    className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-lg"
                initial={{ 
                  opacity: 0,
                  scale: 1,
                  transformOrigin: 'center center'
                }}
                animate={{ 
                  opacity: isActive ? 0.8 : 0,
                  scale: 1,
                  transition: { 
                    duration: 0.3, 
                    ease: "easeOut" 
                  }
                }}
                style={{
                  willChange: 'transform, opacity',
                  // backdropFilter: 'brightness(0.8)', // パフォーマンステスト用に無効化
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* 暗いオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 via-gray-800/10 to-transparent" />
                
                {/* 動画情報 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold line-clamp-1 mb-1 drop-shadow-lg">
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
                    // layout  // パフォーマンステスト用に無効化
                                          animate={{
                        y: isActive ? 120 : 0,
                        transition: { duration: 0.5, ease: "easeOut" }
                      }}
                    />
                    
                    {/* カード情報の文字 */}
                    <motion.div
                      className="card-body p-4 relative z-30 flex-1"
                      // layout  // パフォーマンステスト用に無効化
                      animate={{
                        y: isActive ? 140 : 0,
                        transition: { duration: 0.5, ease: "easeOut" }
                      }}
                    >
                  <motion.h3 
                    className={`card-title text-base line-clamp-1 transition-all duration-500 ease-out ${!isTouchOnly ? 'group-hover:text-white group-hover:drop-shadow-lg' : ''}`}
                    // layout  // パフォーマンステスト用に無効化
                    animate={{
                      y: isActive ? 160 : 0,
                      transition: { duration: 0.5, ease: "easeOut" }
                    }}
                    whileHover={isTouchOnly ? undefined : { 
                      y: -2,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                >
                  {video.title}
                </motion.h3>
                
                <motion.p 
                    className={`text-sm mt-1 truncate transition-all duration-500 ease-out ${!isTouchOnly ? 'group-hover:text-white/90 group-hover:drop-shadow-lg' : ''} flex items-center justify-between`}
                  // layout  // パフォーマンステスト用に無効化
                    animate={{
                      y: isActive ? 180 : 0,
                      transition: { duration: 0.5, ease: "easeOut" }
                    }}
                    whileHover={isTouchOnly ? undefined : { 
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
                      whileHover={isTouchOnly ? undefined : { 
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
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* フッター */}
        <div className="text-center mt-12">
          {/* スマホ用ページネーション（md: 768px未満） */}
          {windowSize.width < 768 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-6 relative z-50">
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
          {/* {windowSize.width < 768 && ( // md: 768px未満
            <p className="text-base-content/60 text-sm mb-4">
              {currentPage} / {totalPages} ページ ({validVideosCount}件中 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, validVideosCount)}件)
            </p>
          )} */}
          
          <p className="text-base-content/60 text-sm mb-2">
            本サイトは楽曲との出会いの偏りを減らすため<br></br>更新するたびランダムに並び替えています
          </p>
          <p className="text-base-content/60 text-[10px]">
            niconicoでのリンクが取得できなかった場合、youtubeのリンクを表示します
          </p>
        </div>
    </div>
  );
}
