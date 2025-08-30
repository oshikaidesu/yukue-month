'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import videos_2025_07 from "@/data/2025/videos_07.json";

// 型定義
interface Video {
  id?: string;
  url?: string;
  thumbnail?: string;
  ogpThumbnailUrl?: string | null;
}

interface Position {
  top: number;
  left: number;
  rotate: number;
  scale: number;
  zIndex: number;
  overlayOpacity: number;
}

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
          width={160}
          height={90}
          className={`w-full h-full object-cover rounded transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setIsLoaded(true);
            if (onLoad) onLoad();
          }}
          onPrivateVideo={(videoId) => {
            setIsPrivate(true);
            onPrivateVideo?.(videoId);
          }}
          loading="lazy"
          quality={50}
          sizes="(max-width: 768px) 80px, 160px"
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
  // ランダムに15個の動画を選択
  const scatteredVideos = useMemo(() => {
    const shuffled = [...videos_2025_07].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }, []);
  const [positions, setPositions] = useState<Position[]>([]);

  const handlePrivateVideo = (videoId: string) => {
    setPrivateVideoIds(prev => new Set(prev).add(videoId));
  };



  useEffect(() => {
    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // グリッドベースの配置で重なりを軽減
    const gridSize = 4; // 4x4のグリッド
    const cellWidth = 100 / gridSize;
    const cellHeight = 100 / gridSize;
    
    // グリッドセルをシャッフル
    const gridCells: { row: number; col: number }[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        gridCells.push({ row, col });
      }
    }
    
    // Fisher-Yates シャッフル（軽量）
    for (let i = gridCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gridCells[i], gridCells[j]] = [gridCells[j], gridCells[i]];
    }

    // 初期位置を生成（グリッドベース）
    const initialPositions = scatteredVideos.map((_: Video, index: number) => {
      const cell = gridCells[index % gridCells.length];
      
      // セル内でランダムな位置を生成
      const cellTop = cell.row * cellHeight;
      const cellLeft = cell.col * cellWidth;
      
      return {
        top: cellTop + random(5, cellHeight - 5), // セル内で少し余白を取る
        left: cellLeft + random(5, cellWidth - 5),
        rotate: random(-30, 30),
        scale: random(1.2, 2.5),
        zIndex: 0,
        overlayOpacity: 0
      };
    });

    // z-indexを割り当て
    const positionsWithZIndex = initialPositions.map((pos: Position) => ({
      ...pos,
      zIndex: Math.floor(random(1, 20)),
      overlayOpacity: 0
    }));

    // z-indexの降順（大きい順）にソート
    const sortedPositions = [...positionsWithZIndex].sort((a, b) => b.zIndex - a.zIndex);

    // 上から順にオーバーレイを加算（軽減）
    const positionsWithDepth = sortedPositions.map((pos, sortedIndex) => {
      // グリッド配置により重なりが軽減されているので、オーバーレイを減らす
      const overlayBase = sortedIndex * 0.008; // 0.015 → 0.008に削減
      const overlayOpacity = Math.min(overlayBase, 0.15); // 0.25 → 0.15に削減

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
      {scatteredVideos.map((video: Video, i: number) => {
        // 500エラーが継続する動画はスキップ
        if (video.id && privateVideoIds.has(video.id)) {
          return null;
        }
        
        const { top, left, rotate, scale, overlayOpacity } = positions[i];
        const initialTop = top < 50 ? -20 : 120;
        const initialLeft = left < 50 ? -20 : 120;
        return (
          <motion.div
            key={(video.id || 'unknown') + i}
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
              overlayOpacity={overlayOpacity}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Hero() {
  const [mountBg, setMountBg] = useState(false);

  // 初回描画をブロックしないよう背景を遅延マウント
  useEffect(() => {
    const t = setTimeout(() => setMountBg(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
    {/* マージンとサイズを制御する外側のコンテナ */}
    <div className="mx-auto mt-25 mb-8 w-[min(1400px,calc(100vw-2rem))]">
      {/* ヒーローセクションの主要なスタイリング */}
      <div className="min-h-[80vh] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden rounded-[50px] rounded-tr-none rounded-bl-none border-1 border-[#EEEEEE]">
        {/* === グリッド背景（インラインSVG） === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="40" height="40" fill="none" stroke="#333" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.2" />
        </svg>
      </div>
      {/* === 背景のビデオカード乱雑配置（初回描画後にマウント） === */}
      {mountBg && <VideoCardScatter />}
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
            <div className="flex flex-col items-center bg-[#EEEEEE] px-7 py-10 rounded-r inverted-corner-top-right-bold z-10">
              <h1 
                className="text-[25px] sm:text-[45px] md:text-[50px] lg:text-[55px] xl:text-[60px] text-dark font-bold text-base-content text-mask-top"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
              >
                ゆくえレコーズ
              </h1>
            </div>
          </div>
        </div>

        {/* === 説明文（オーバーレイ） === */}
        <div className="absolute bottom-0 left-0 text-left ">
          <div className="max-w-ms px-8 py-5 text-sm sm:text-sm md:text-base lg:text-lg font-mono bg-[#EEEEEE] inverted-corner-left-bottom">
            <p className="text-dark relative z-10 text-mask-left">
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
    <div className="w-[min(1400px,calc(100vw-2rem))] mx-auto mt-4 flex items-center gap-4 justify-center">
      <motion.button 
        className="btn btn-primary group relative overflow-hidden flex flex-col items-center justify-center w-[180px] py-4"
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
        <div className="flex items-center justify-center relative z-10">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateY(-2px)' }}>
            <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z"/>
          </svg>
          <span className="ml-1">マイリスト</span>
        </div>
      </motion.button>
      
      <Link href="/archive">
        <motion.button 
          className="btn btn-outline text-dark bg-white/90 flex flex-col items-center justify-center w-[180px] py-4"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            borderColor: "hsl(var(--p))",
            color: "hsl(var(--p))",
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center relative z-10">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateY(-0px)' }}>
              <path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/>
            </svg>
            <span className="ml-1">アーカイブ</span>
          </div>
        </motion.button>
      </Link>
    </div>
    </>
  )
}