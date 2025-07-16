'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-[#EEEEEE]" data-theme="light">
      <Header />
      {/* === ヒーローセクション === */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        {/* 背景グリッド */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg width="100%" height="100%" className="w-full h-full" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="none" stroke="#333" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity="0.08" />
          </svg>
        </div>
        {/* パララックス風の動く円や線 */}
        <motion.div
          className="absolute top-1/3 left-10 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* メインテキスト */}
        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center px-4 py-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-8 text-primary drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            ゆくえレコーズPICKUP PLAYLISTシリーズ
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-gray-800 font-semibold leading-relaxed mb-4 drop-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          >
            ゆくえレコーズPICKUP PLAYLISTシリーズは、レーベル主宰の「駱駝法師」と運営スタッフの「ぴち」がニコニコ動画上に投稿されたおすすめのボカロ音楽を紹介するプレイリスト企画です。
          </motion.p>
          <motion.p
            className="text-base md:text-lg text-gray-700 leading-relaxed mt-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          >
            ゆくえレコーズのキュレーションは、レーベルの前身となるコンピレーション【合成音声のゆくえ】から一貫して「広野に散らばった点と点を新しい視点と文脈で結び、文化圏の深みに在る先鋭的なボカロ音楽へとリスナーがアクセスするハードルを下げる」ことをモットーにしています。<br />
            PICKUP PLAYLISTでは作り手の知名度やコミュニティ、ジャンルなどを問わず幅広くセレクトして紹介することで、リスナーのための導線の整理だけでなく作り手のモチベーションの向上を目的としており、ボカロ文化の更なる発展と深化を目指しています。
          </motion.p>
        </motion.div>
      </section>
      {/* === 既存のAbout内容 === */}
      <main className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-6 text-primary">About ゆくえレコーズ</h1>
        <div className="mb-8">
          <Image src="/Logo_Horizontal.svg" alt="Yukue Logo" width={240} height={56} className="mb-4" unoptimized />
          <p className="text-lg text-gray-700 mb-2">
            ゆくえレコーズは、ボーカロイド楽曲を中心に、音楽の新しい可能性を追求するインディペンデントレーベルです。
          </p>
          <p className="text-gray-600">
            主宰：駱駝法師（らくだほうし）<br />
            運営メンバー：ぴち 他
          </p>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-secondary">理念</h2>
          <p className="text-gray-700">
            「音楽の“ゆくえ”を探し続ける」<br />
            ボカロ文化の多様性と創造性を大切にし、リスナーとクリエイターが自由に交わる場を目指しています。
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-secondary">主な活動</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>毎月おすすめボカロ曲のプレイリスト公開</li>
            <li>オリジナル楽曲・アルバムの制作・配信</li>
            <li>イベント・コラボ企画の実施</li>
            <li>クリエイター・リスナー交流の場づくり</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-secondary">メンバー</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>駱駝法師（らくだほうし）：主宰・作曲・企画</li>
            <li>ぴち：運営・広報</li>
            <li>その他、サポートメンバー</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-secondary">連絡先</h2>
          <p className="text-gray-700 mb-2">ご質問・ご依頼・コラボ等は下記よりご連絡ください。</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>公式HP：<a href="https://yukuerecords.studio.site/" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://yukuerecords.studio.site/</a></li>
            <li>お問い合わせフォーム：<a href="https://yukuerecords.studio.site/contact" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://yukuerecords.studio.site/contact</a></li>
            <li>X(Twitter)：<a href="https://twitter.com/YUKUE_RECORDS" className="text-primary underline" target="_blank" rel="noopener noreferrer">@YUKUE_RECORDS</a></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
} 