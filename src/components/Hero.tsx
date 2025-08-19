'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import videos_2025_06 from "@/data/2025/videos_06.json";


// ビデオカードのミニ版
import NicovideoThumbnail from "./NicovideoThumbnail";
import Link from "next/link";
const VideoCardMini = ({ video, onLoad, onPrivateVideo }: { 
  video: { id?: string, url?: string, thumbnail?: string, ogpThumbnailUrl?: string | null }, 
  onLoad?: () => void,
  onPrivateVideo?: (videoId: string) => void
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
    </div>
  );
};

// 乱雑配置用のビデオカード背景
function VideoCardScatter() {
  const [privateVideoIds, setPrivateVideoIds] = useState<Set<string>>(new Set());
  const scatteredVideos = videos_2025_06.slice(0, 20); // ← 20個に減らす
  const [positions, setPositions] = useState<{top:number, left:number, rotate:number, scale:number}[]>([]);

  const handlePrivateVideo = (videoId: string) => {
    console.log(`Hero: 500エラーが継続する動画を除外: ${videoId}`);
    setPrivateVideoIds(prev => new Set(prev).add(videoId));
  };

  useEffect(() => {
    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    setPositions(
      scatteredVideos.map(() => ({
        top: random(-10, 110),
        left: random(-10, 110),
        rotate: random(-30, 30),
        scale: random(0.6, 2.5),
      }))
    );
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
        
        const { top, left, rotate, scale } = positions[i];
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
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <VideoCardMini video={video} onPrivateVideo={handlePrivateVideo} />
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
    <div className="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden rounded-3xl mx-auto mt-25 mb-8 w-[min(1400px,calc(100vw-5rem))]">
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
              className="text-[15px] sm:text-[20px] md:text-[30px] lg:text-[40px] xl:text-[50px] text-black font-bold text-base-content cursor-pointer bg-[#EEEEEE] tracking-tight px-4 py-1 rounded-l transition-all duration-300"
            >
              MONTHLY PICKUP PLAYLIST
            </h2>
            
            <div className="text-[10px] sm:text-[12px] md:text-[15px] lg:text-[18px] xl:text-[20px] text-primary bg-[#EEEEEE] px-4 py-1 rounded-l">yukue Records</div>
          </div>
          
          {/* 日本語テキスト（右側） */}
          <h1 
            className="text-[30px] sm:text-[40px] md:text-[50px] lg:text-[70px] xl:text-[90px] text-black font-bold text-base-content cursor-pointer bg-[#EEEEEE] tracking-tight p-4 rounded-r transition-all duration-300 writing-vertical-rl"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            ゆくえレコーズ
          </h1>
        </div>
      </div>

      {/* === 説明文（オーバーレイ） === */}
      <div className="absolute bottom-0 left-0 text-left ">
        <div className="max-w-ms p-2 rounded-xl text-[15px] sm:text-[20px] md:text-[30px] lg:text-[40px] xl:text-[50px] font-bold font-mono bg-[#EEEEEE] relative">
          <p className="text-black/80 relative z-10">
            ゆくえレコーズ主宰の駱駝法師 <br />
            およびレーベルの運営メンバーのぴちが <br />
            是非リスナーにおすすめしたい <br />
            良質なボカロ曲を毎月更新するマイリストです！
          </p> 
        </div>
      </div>

      <motion.div
        className="absolute bottom-20 right-1/3 w-3 h-3 bg-secondary/20 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute top-1/2 left-10 w-5 h-5 bg-accent/20 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      {/* 背景の線形要素 */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full"
        animate={{
          scaleX: [0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-secondary/20 to-transparent rounded-full"
        animate={{
          scaleY: [0, 1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />




    </div>

    {/* ボタン群（ヒーロー要素の下） */}
    <div className="w-[min(1400px,calc(100vw-5rem))] mx-auto mt-4 flex gap-4 justify-center">
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
          className="btn btn-outline text-black bg-white/90"
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