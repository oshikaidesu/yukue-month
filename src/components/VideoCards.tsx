'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videos, VideoItem } from "@/data/videos";
import NicovideoThumbnail from "./NicovideoThumbnail";

export default function VideoCards() {
  const [shuffledVideos, setShuffledVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    // 全動画を取得してランダムに並び替え
    const shuffled = [...videos].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledVideos(shuffled);
  }, []);

  return (
    <div className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            VOCALOID 楽曲
          </h2>
          <p className="text-base-content/70 max-w-2xl mx-auto mb-8">
            人気のVOCALOID楽曲をご紹介。
            新しい音楽との出会いをお楽しみください。
          </p>
        </div>

        {/* 動画リスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shuffledVideos.map((video, index) => (
            <motion.div
              key={video.id}
              className="card bg-base-100 shadow-lg cursor-pointer overflow-hidden group relative transition-all duration-300 ease-out hover:shadow-2xl"
              onClick={() => window.open(video.url, '_blank')}
              whileHover={{ 
                scale: 1.05,
                rotateY: 2,
                rotateX: 1,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 背景装飾図形 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* 丸 */}
                <div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full transform transition-all duration-500 ease-out translate-x-5 translate-y-5 scale-0 rotate-0 group-hover:translate-x-[-10px] group-hover:translate-y-[-10px] group-hover:scale-110 group-hover:rotate-180"
                />
                {/* 三角 */}
                <div
                  className="absolute -bottom-6 -left-6 w-6 h-6 bg-secondary/20 transform transition-all duration-500 ease-out delay-100 translate-x-[-20px] translate-y-[-20px] scale-0 rotate-0 group-hover:translate-x-[10px] group-hover:translate-y-[10px] group-hover:scale-110 group-hover:rotate-90"
                  style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                />
                {/* 四角 */}
                <div
                  className="absolute top-1/2 -right-8 w-5 h-5 bg-accent/20 rotate-45 transform transition-all duration-500 ease-out delay-200 translate-x-[30px] translate-y-0 scale-0 group-hover:translate-x-[-15px] group-hover:translate-y-0 group-hover:scale-110 group-hover:rotate-[225deg]"
                />
                {/* 渦巻き線 */}
                <div
                  className="absolute -bottom-8 right-1/4 w-12 h-12 border-2 border-warning/30 rounded-full transform transition-all duration-500 ease-out delay-300 translate-x-0 translate-y-[30px] scale-0 rotate-0 group-hover:translate-x-0 group-hover:translate-y-[-20px] group-hover:scale-110 group-hover:rotate-[360deg]"
                  style={{ borderStyle: 'dashed' }}
                />
                {/* 追加の小さな図形 */}
                <div
                  className="absolute top-1/4 -left-4 w-3 h-3 bg-info/20 rounded-full transform transition-all duration-500 ease-out delay-400 translate-x-[-15px] translate-y-0 scale-0 group-hover:translate-x-[8px] group-hover:translate-y-0 group-hover:scale-110"
                />
                <div
                  className="absolute bottom-1/3 -right-2 w-4 h-4 bg-success/20 transform transition-all duration-500 ease-out delay-500 translate-x-[15px] translate-y-0 scale-0 rotate-0 group-hover:translate-x-[-8px] group-hover:translate-y-0 group-hover:scale-110 group-hover:rotate-180"
                  style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
                />
              </div>
              {/* サムネイル背景（ホバー時） */}
              <motion.div
                className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
              >
                <NicovideoThumbnail
                  videoId={video.id}
                  width={400}
                  height={225}
                  useServerApi={true}
                  className="w-full h-full object-cover"
                />
                {/* 暗いオーバーレイ */}
                <div className="absolute inset-0 bg-black/60" />
              </motion.div>

              {/* 通常のサムネイル（非ホバー時） */}
              <motion.figure
                className="relative z-0 opacity-100 group-hover:opacity-0 transition-all duration-500 ease-out"
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
              <motion.div 
                className="card-body p-4 relative z-30"
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
                  className="text-sm mt-1 transition-all duration-500 ease-out group-hover:text-white/90 group-hover:drop-shadow-lg"
                  layout
                  whileHover={{ 
                    y: -1,
                    transition: { duration: 0.3, ease: "easeOut", delay: 0.1 }
                  }}
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
          ))}
        </div>
        
        {/* フッター */}
        <div className="text-center mt-12">
          <p className="text-base-content/60 text-sm">
            ホバーでプレビュー、クリックで再生
          </p>
        </div>
      </div>
    </div>
  );
}
