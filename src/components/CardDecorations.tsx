'use client'

import { motion } from "framer-motion";

interface CardDecorationsProps {
  isActive: boolean;
  index: number;
  isMobile: boolean;
  getFixedSize: (videoIdx: number, shapeIdx: number) => string;
  getFixedColor: (videoIdx: number, shapeIdx: number) => string;
}

export default function CardDecorations({
  isActive,
  index,
  isMobile,
  getFixedSize,
  getFixedColor
}: CardDecorationsProps) {
  // スマホでのパフォーマンステスト用：装飾図形を無効化
  if (isMobile) {
    // return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'opacity', transform: 'translateZ(0)' }}>
      {/* 丸 - 上方向に飛び出す */}
      <motion.div
        className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 0)} ${getFixedColor(index, 0)} rounded-full pointer-events-none`}
        style={{ transform: 'translateZ(0)' }}
        initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
        animate={isActive ? {
          x: 'calc(-50% + 80px)',
          y: 'calc(-50% - 150px)',
          scale: 1.2,
          rotate: 150,
          transition: { 
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
        style={{ clipPath: 'polygon(50% 0%, 0% 86.6%, 100% 86.6%)', transform: 'translateZ(0)' }}
        initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
        animate={isActive ? {
          x: 'calc(-50% - 170px)',
          y: 'calc(-50% - 170px)',
          scale: 1.2,
          rotate: 150,
          transition: { 
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
          scale: 1.2,
          rotate: 195,
          transition: { 
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
        src="/CS_Ellipse_6.svg"
        alt="dashed circle"
        className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 3)} pointer-events-none`}
        style={{
          transform: 'translateZ(0)'
        }}
        initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
        animate={isActive ? {
          x: 'calc(-50% + 220px)',
          y: '-50%',
          scale: 1.2,
          rotate: 150,
          transition: { 
            x: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
        src="/CS_Star_13.svg"
        className={`absolute top-1/2 left-1/2 ${getFixedSize(index, 4)} pointer-events-none`}
        style={{
          transform: 'translateZ(0)'
        }}
        initial={{ x: '-50%', y: '-50%', scale: 1, rotate: 0 }}
        animate={isActive ? {
          x: 'calc(-50% - 220px)',
          y: 'calc(-50% + 100px)',
          scale: 1.2,
          rotate: 150,
          transition: { 
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
          scale: 1.2,
          rotate: -150,
          transition: { 
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
          }
        } : {
          x: '-50%',
          y: '-50%',
          scale: 1,
          rotate: 0,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      />
      
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
          scale: 1.2,
          rotate: 150,
          transition: {
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
          scale: 1.2,
          rotate: 150,
          transition: { 
            x: { duration: 0.3, ease: "easeOut" },
            y: { duration: 0.3, ease: "easeOut" },
            scale: { duration: 0.3, ease: "easeOut" },
            rotate: { duration: 1, ease: "easeOut" }
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
  );
}
