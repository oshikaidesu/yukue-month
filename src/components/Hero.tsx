'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { videos } from "@/data/videos";
// Marqueeのimport（実装は仮定）
// import { Marquee } from "@/components/magicui/marquee";

// ビデオカードのミニ版
import type { VideoItem } from "@/data/videos";
import NicovideoThumbnail from "./NicovideoThumbnail";
const VideoCardMini = ({ video, onLoad }: { video: VideoItem, onLoad?: () => void }) => (
  <div className="aspect-[16/9] w-50 rounded-xl shadow flex items-center justify-center p-2 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => window.open(video.url, '_blank')}>
    <NicovideoThumbnail
      videoId={video.id}
      width={320}
      height={180}
      useServerApi={true}
      className="w-full h-full object-cover rounded"
      onLoad={onLoad}
    />
  </div>
);

// 乱雑配置用のビデオカード背景
function VideoCardScatter() {
  const scatteredVideos = videos.slice(0, 60);
  const [positions, setPositions] = useState<{top:number, left:number, rotate:number, scale:number}[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const isReady = loadedCount >= scatteredVideos.length;

  useEffect(() => {
    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    setPositions(
      scatteredVideos.map(() => ({
        top: random(-10, 110),
        left: random(-10, 110),
        rotate: random(-30, 30),
        scale: random(0.7, 2.0),
      }))
    );
  }, [scatteredVideos.length]);

  if (positions.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      {scatteredVideos.map((video, i) => {
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
            animate={isReady ? {
              top: `${top}%`,
              left: `${left}%`,
              transform: `rotate(${rotate}deg) scale(${scale})`,
            } : undefined}
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
            <VideoCardMini video={video} onLoad={() => setLoadedCount(c => c + 1)} />
          </motion.div>
        );
      })}
    </div>
  );
}


export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
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
      {/* === 背景のビデオカード乱雑配置 === */}
      <VideoCardScatter />
      {/* 黒の半透明オーバーレイ */}
      <div className="absolute inset-0 bg-gray-900/45 z-10 pointer-events-none" />




      <motion.div
        className="absolute bottom-20 right-1/3 w-3 h-3 bg-secondary/20 rounded-sm"
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
        className="absolute top-1/2 left-10 w-5 h-5 bg-accent/20 rounded-sm"
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
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
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
        className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-secondary/20 to-transparent"
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

      <motion.div 
        className="hero-content text-left relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md">
          <motion.h1 
            className="text-5xl text-white font-bold text-base-content cursor-pointer"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 20px rgba(0,0,0,0.3)"
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            ゆくえレコーズ
          </motion.h1>

          {/* ここにMarquee3Dを追加 */}
          {/* Marquee3Dは背景に配置 */}

          <motion.h1 
            className="text-xl text-white font-bold text-base-content cursor-pointer"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              textShadow: "0 0 20px rgba(0,0,0,0.3)"
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            MONTHLY PICKUP PLAYLIST
          </motion.h1>
          
          <motion.div 
            className="text-sm text-primary"
            initial={{ y: 30, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              x: isHovered ? 10 : 0
            }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            yukue Records
          </motion.div>
          
          <motion.p 
            className="py-6 text-white/80"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ 
              color: "white",
              transition: { duration: 0.3 }
            }}
          >
            ゆくえレコーズ主宰の駱駝法師、およびレーベルの運営メンバーのぴちが是非リスナーにおすすめしたい良質なボカロ曲を毎月更新するマイリストです！
          </motion.p>
          
          <motion.div 
            className="flex gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <motion.button 
              className="btn btn-primary group relative overflow-hidden"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
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
              <span className="relative z-10">今月のピックアップ</span>
            </motion.button>
            
            <motion.button 
              className="btn btn-outline text-white"
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
          
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 