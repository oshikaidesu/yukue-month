'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import videos_2025_06 from "@/data/2025/videos_06.json";


// ビデオカードのミニ版
import NicovideoThumbnail from "./NicovideoThumbnail";
import Link from "next/link";
const VideoCardMini = ({ 
  video, 
  onLoad, 
  onPrivateVideo,
  overlayOpacity = 0
}: { 
  video: { id?: string, url?: string, thumbnail?: string, ogpThumbnailUrl?: string | null }, 
  onLoad?: () => void,
  onPrivateVideo?: (videoId: string) => void,
  overlayOpacity?: number
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  
  // 500エラーが継続する動画の場合は表示しない
  if (isPrivate) {
    return null;
  }
  
  return (
    <div className="aspect-[16/9] w-50 rounded-xl shadow flex items-center justify-center p-2 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => window.open(video.url, '_blank')}>
      {!isLoaded && (
        <div className="w-full h-full bg-white/0 animate-pulse rounded object-cover absolute" style={{ aspectRatio: '16/9' }} />
      )}
      <div className="relative w-full h-full">
        <NicovideoThumbnail
          videoId={video.id ?? ""}
          videoUrl={video.url}
          thumbnail={video.thumbnail}
          ogpThumbnailUrl={video.ogpThumbnailUrl ?? undefined}
          width={320}
          height={180}
          className={`w-full h-full object-cover rounded transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setIsLoaded(true);
            console.log("onLoad fired", video.id);
            if (onLoad) onLoad();
          }}
          onPrivateVideo={(videoId) => {
            setIsPrivate(true);
            onPrivateVideo?.(videoId);
          }}
          loading="lazy"
        />
        {/* オーバーレイ */}
        {overlayOpacity > 0 && (
          <div 
            className="absolute inset-0 bg-black rounded transition-opacity duration-300 pointer-events-none"
            style={{ 
              opacity: overlayOpacity,
              mixBlendMode: 'multiply'
            }}
          />
        )}
      </div>
    </div>
  );
};

// 乱雑配置用のビデオカード背景
function VideoCardScatter() {
  const [privateVideoIds, setPrivateVideoIds] = useState<Set<string>>(new Set());
  const scatteredVideos = videos_2025_06.slice(0, 20); // ← 20個に減らす
  const [positions, setPositions] = useState<{
    top: number;
    left: number;
    rotate: number;
    scale: number;
    zIndex: number;
    overlayOpacity: number;
  }[]>([]);

  const handlePrivateVideo = (videoId: string) => {
    console.log(`Hero: 500エラーが継続する動画を除外: ${videoId}`);
    setPrivateVideoIds(prev => new Set(prev).add(videoId));
  };

  // 重なり具合を計算する関数
  const calculateOverlap = (positions: { top: number; left: number; scale: number }[]) => {
    return positions.map((pos1, index1) => {
      let overlappingCount = 0;
      positions.forEach((pos2, index2) => {
        if (index1 !== index2) {
          // カードの実際のサイズを計算（スケールを考慮）
          const baseWidth = 320;
          const baseHeight = 180;
          
          // カード1の領域
          const card1Left = pos1.left - (baseWidth * pos1.scale) / 2;
          const card1Right = pos1.left + (baseWidth * pos1.scale) / 2;
          const card1Top = pos1.top - (baseHeight * pos1.scale) / 2;
          const card1Bottom = pos1.top + (baseHeight * pos1.scale) / 2;
          
          // カード2の領域
          const card2Left = pos2.left - (baseWidth * pos2.scale) / 2;
          const card2Right = pos2.left + (baseWidth * pos2.scale) / 2;
          const card2Top = pos2.top - (baseHeight * pos2.scale) / 2;
          const card2Bottom = pos2.top + (baseHeight * pos2.scale) / 2;
          
          // 重なり判定（矩形の交差判定）
          const xOverlap = !(card1Right < card2Left || card1Left > card2Right);
          const yOverlap = !(card1Bottom < card2Top || card1Top > card2Bottom);

          if (xOverlap && yOverlap) {
            overlappingCount++;
          }
        }
      });
      return overlappingCount;
    });
  };

  useEffect(() => {
    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    // 初期位置を生成
    const initialPositions = scatteredVideos.map(() => ({
      top: random(-10, 110),
      left: random(-10, 110),
      rotate: random(-30, 30),
      scale: random(1.5, 3.0),
      zIndex: 0,
      overlayOpacity: 0
    }));

    // 重なり具合を計算して z-index と overlayOpacity を設定
    const overlaps = calculateOverlap(initialPositions);
    console.log('Overlaps:', overlaps); // デバッグ用

    // まずz-indexを割り当て
    const positionsWithZIndex = initialPositions.map((pos) => ({
      ...pos,
      zIndex: Math.floor(random(1, 20)), // より広い範囲のz-indexを使用
      overlayOpacity: 0
    }));

    // z-indexの降順（大きい順）にソート
    const sortedPositions = [...positionsWithZIndex].sort((a, b) => b.zIndex - a.zIndex);

    // 上から順にオーバーレイを加算
    const positionsWithDepth = sortedPositions.map((pos, sortedIndex) => {
      // 一番上（sortedIndex === 0）は opacity 0
      // それ以外は下にあるカードの数に応じて opacity を加算
      const overlayBase = sortedIndex * 0.015; // 1枚下がるごとに0.015ずつ増加
      const overlayOpacity = Math.min(overlayBase, 0.25); // 最大値は0.25に制限

      console.log(`Card z-index=${pos.zIndex}, layer=${sortedIndex}, opacity=${overlayOpacity}`);

      return {
        ...pos,
        overlayOpacity
      };
    });

    setPositions(positionsWithDepth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← 依存配列を空に

  if (positions.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      {scatteredVideos.map((video, i) => {
        // 500エラーが継続する動画はスキップ
        if (privateVideoIds.has(video.id)) {
          return null;
        }
        
        const { top, left, rotate, scale, zIndex, overlayOpacity } = positions[i];
        const initialTop = top < 50 ? -20 : 120;
        const initialLeft = left < 50 ? -20 : 120;
        return (
          <motion.div
            key={video.id + i}
            className="absolute"
            initial={{
              top: `${initialTop}%`,
              left: `${initialLeft}%`,
              transform: `rotate(${rotate}deg) scale(${scale})`,
            }}
            animate={{
              top: `${top}%`,
              left: `${left}%`,
              transform: `rotate(${rotate}deg) scale(${scale})`,
            }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 18,
              mass: 0.7,
              delay: i * 0.01,
            }}
            style={{
              zIndex: positions[i].zIndex,
              pointerEvents: 'none',
            }}
          >
            <VideoCardMini 
              video={video} 
              onPrivateVideo={handlePrivateVideo}
              overlayOpacity={positions[i].overlayOpacity}
            />
          </motion.div>
        );
      })}
    </div>
  );
}


export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
    {/* マージンとサイズを制御する外側のコンテナ */}
    <div className="mx-auto mt-25 mb-8 w-[min(1400px,calc(100vw-2rem))] ">
      {/* ヒーローセクションの主要なスタイリング */}
      <div className="min-h-[80vh] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden rounded-[50px] border-1 border-[#EEEEEE]">
        {/* === グリッド背景（インラインSVG） === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full rounded-3xl" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="40" height="40" fill="none" stroke="#333" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.2" rx="24" ry="24" />
        </svg>
      </div>
      {/* === 背景のビデオカード乱雑配置 === */}
      <VideoCardScatter />
        {/* === タイトル群（オーバーレイ） === */}
        <div className="absolute top-0 right-0 text-right z-20">
          <div className="flex items-start">
            {/* 英語テキスト（左側） */}
            <div className="flex flex-col items-end">
              <h2 
                className="text-[15px] sm:text-[20px] md:text-[30px] lg:text-[40px] xl:text-[50px] text-dark font-bold bg-[#EEEEEE] tracking-tight px-4 py-0 inverted-corner-top-right z-10"
              >
                MONTHLY PICKUP PLAYLIST
              </h2>
              
              <div className="text-[10px] sm:text-[12px] md:text-[15px] lg:text-[18px] xl:text-[20px] text-primary font-bold bg-[#EEEEEE] px-4 py-0 inverted-corner-top-right">yukue Records</div>
            </div>
            
            {/* 日本語テキスト（右側） */}
            <div className="flex flex-col items-center bg-[#EEEEEE] px-3 py-6 rounded-r inverted-corner-top-right-bold z-10">
              <h1 
                className="text-[30px] sm:text-[45px] md:text-[50px] lg:text-[55px] xl:text-[60px] text-dark font-bold text-base-content "
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
              >
                ゆくえレコーズ
              </h1>
            </div>
          </div>
        </div>

        {/* === 説明文（オーバーレイ） === */}
        <div className="absolute bottom-0 left-0 text-left">
          <div className="max-w-ms p-4 text-sm sm:text-sm md:text-base lg:text-lg font-mono bg-[#EEEEEE] inverted-corner-left-bottom">
            <p className="text-dark relative z-10">
              ゆくえレコーズ主宰の駱駝法師 <br />
              レーベルの運営メンバーのぴちが <br />
              リスナーにおすすめしたい <br />
              ボカロ曲を毎月更新するマイリスト
            </p> 
          </div>
        </div>
      </div>
    </div>

    {/* ボタン群（ヒーロー要素の下） */}
    <div className="w-[min(1400px,calc(100vw-2rem))] mx-auto mt-4 flex gap-4 justify-center">
      <motion.button 
        className="btn btn-primary group relative overflow-hidden flex items-center"
        whileHover={{
          scale: 1.03,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => window.open("https://www.nicovideo.jp/user/131010307/mylist/76687470", "_blank", "noopener noreferrer")}
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
        </svg>
        <span className="relative z-10 ml-2">ニコニコマイリスト</span>
      </motion.button>
      
      <Link href="/archive" className="h-full block ">
        <motion.button 
          className="btn btn-outline text-dark bg-white/90"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            borderColor: "hsl(var(--p))",
            color: "hsl(var(--p))",
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
        >
          アーカイブ
        </motion.button>
      </Link>
    </div>
    </>
  )
}