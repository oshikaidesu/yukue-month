'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
      {/* 背景の浮遊する円 */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-24 h-24 bg-secondary/5 rounded-full"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/3 w-20 h-20 bg-accent/5 rounded-full"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* 背景の浮遊する四角形 */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-primary/10 rounded-lg rotate-45"
        animate={{
          y: [-10, 10, -10],
          rotate: [45, 225, 45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-secondary/10 rounded-lg -rotate-12"
        animate={{
          y: [10, -10, 10],
          rotate: [-12, 348, -12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute top-1/3 left-1/6 w-8 h-8 bg-accent/10 rounded-md rotate-12"
        animate={{
          y: [-8, 8, -8],
          rotate: [12, 372, 12],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* 背景の小さな四角形のパターン */}
      <motion.div
        className="absolute top-10 right-10 w-4 h-4 bg-primary/20 rounded-sm"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
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
        className="hero-content text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md">
          <motion.h1 
            className="text-5xl font-bold text-base-content cursor-pointer"
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
            className="py-6 text-base-content/80"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            whileHover={{ 
              color: "hsl(var(--p))",
              transition: { duration: 0.3 }
            }}
          >
            マンスリーピックアップで厳選された音楽をお届け。
            図書館や骨董屋のような雰囲気で、新しい音楽との出会いを。
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
              className="btn btn-outline"
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

          {/* インタラクティブな音楽ノート */}
          <motion.div 
            className="mt-8 flex gap-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
          >
            {[1, 2, 3, 4, 5].map((note, index) => (
              <motion.div
                key={note}
                className="w-2 h-8 bg-primary/30 rounded-full"
                whileHover={{ 
                  scale: 1.3,
                  backgroundColor: "hsl(var(--p))",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                animate={{
                  height: [32, 40, 32],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 