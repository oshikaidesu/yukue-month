'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'

export default function About() {
  return (
    <div className="min-h-screen bg-[#EEEEEE] relative overflow-hidden" data-theme="light">
      <Header />

      {/* Heroセクション */}
      <section className="w-full max-w-xl mx-auto px-8 lg:px-48 xl:px-64 py-32 text-center z-20 relative">
        <h1 className="text-4xl font-bold mb-6">Concept</h1>
        <p className="mb-4">
          ゆくえレコーズPICKUP PLAYLISTシリーズは、レーベル主宰の「駱駝法師」と運営スタッフの「ぴち」がニコニコ動画上に投稿されたおすすめのボカロ音楽を紹介するプレイリスト企画です。
        </p>
        <p>
          ゆくえレコーズのキュレーションは、レーベルの前身となるコンピレーション【合成音声のゆくえ】から一貫して「広野に散らばった点と点を新しい視点と文脈で結び、文化圏の深みに在る先鋭的なボカロ音楽へとリスナーがアクセスするハードルを下げる」ことをモットーにしています。<br />
          PICKUP PLAYLISTでは作り手の知名度やコミュニティ、ジャンルなどを問わず幅広くセレクトして紹介することで、リスナーのための導線の整理だけでなく作り手のモチベーションの向上を目的としており、ボカロ文化の更なる発展と深化を目指しています。
        </p>
      </section>
      <PickupBackground />

      <Footer />
    </div>
  )
} 