"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import videos_2025_06 from "@/data/2025/videos_06.json";
import { VideoItem } from "@/data/videos";
import NicovideoThumbnail from "./NicovideoThumbnail";

const VideoCardMini = ({ video, onLoad }: { video: Partial<VideoItem>, onLoad?: () => void }) => (
  <div className="aspect-[16/9] w-50 rounded-xl shadow flex items-center justify-center p-2 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => window.open(video.url, '_blank')}>
    <NicovideoThumbnail
      videoId={video.id ?? ""}
      width={320}
      height={180}
      useServerApi={true}
      className="w-full h-full object-cover rounded"
      onLoad={onLoad}
    />
  </div>
);

export default function VideoCardScatter() {
  const scatteredVideos = videos_2025_06.slice(0, 60);
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