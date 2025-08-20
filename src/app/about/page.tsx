'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'

// バーが消えていくアニメーション用のコンポーネント
const AnimatedText = ({ 
  text, 
  delay = 0, 
  className = "",
  fromLeft = true
}: { 
  text: string, 
  delay?: number, 
  className?: string,
  fromLeft?: boolean
}) => {
  return (
    <div className={`relative ${className}`}>
      <motion.p 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay }}
      >
        {text}
      </motion.p>
      <motion.div
        className="absolute inset-0 bg-[#EEEEEE] z-20"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: delay + 0.2,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: fromLeft ? "left" : "right" }}
      />
    </div>
  )
}

export default function About() {
  // 各テキストの文字数を計算
  const text1 = "ゆくえレコーズPICKUP PLAYLISTシリーズは、レーベル主宰の「駱駝法師」と運営スタッフの「ぴち」がニコニコ動画上に投稿されたおすすめのボカロ音楽を紹介するプレイリスト企画です。"
  const text2 = "ゆくえレコーズのキュレーションはレーベルの前身となるコンピレーション【合成音声のゆくえ】から一貫して「広野に散らばった点と点を新しい視点と文脈で結び、文化圏の深みに在る先鋭的なボカロ音楽へとリスナーがアクセスするハードルを下げる」ことをモットーにしています。"
  const text3 = "PICKUP PLAYLISTでは作り手の知名度やコミュニティ、ジャンルなどを問わず幅広くセレクトして紹介することでリスナーのための導線の整理だけでなく作り手のモチベーションの向上を目的としておりボカロ文化の更なる発展と深化を目指しています。"
  
  // 各テキストの開始時間を計算
  const delay1 = 0.5 // h1の終了時間（黒いバーが消えるタイミング）
  const delay2 = 0.7
  const delay3 = 1

  return (
    <div className="min-h-screen bg-[#EEEEEE] relative overflow-hidden" data-theme="light">
      <Header />

      {/* Heroセクション */}
      <section className="w-full max-w-md mx-auto px-8 lg:px-16 xl:px-24 py-32 text-left z-20 relative">
        <div className="relative mb-16 text-center">
          <motion.h1 
            className="text-6xl font-bold border-b-2 border-black pb-2 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Concept
          </motion.h1>
          <motion.div
            className="absolute inset-0 bg-[#EEEEEE] z-20"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "left" }}
          />
        </div>
        
        <AnimatedText 
          text={text1}
          delay={delay1}
          className="mb-12 leading-relaxed text-[15px]"
          fromLeft={true}
        />
        
        <AnimatedText 
          text={text2}
          delay={delay2}
          className="mb-12 leading-relaxed text-[15px]"
          fromLeft={false}
        />
        
        <AnimatedText 
          text={text3}
          delay={delay3}
          className="leading-relaxed text-[15px]"
          fromLeft={true}
        />
      </section>
      <PickupBackground />

      <Footer />
    </div>
  )
}