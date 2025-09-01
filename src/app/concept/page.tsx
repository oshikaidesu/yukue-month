'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'

export default function Concept() {
  return (
    <div className="min-h-screen bg-[#EEEEEE] relative overflow-hidden" data-theme="light">
        {/* 1. ヘッダー */}
        <Header />

      {/* 2. タイトルセクション */}
      <section className="w-full max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-32 z-20 relative">
        <div className="relative text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold font-english tracking-wider border-b-2 border-black pb-2 relative z-10 inline-block ">
            Concept
          </h1>
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
      </section>

      {/* 3. 段落1：PCモックアップ + テキスト1 */}
      <section className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 max-w-none bg-gray-200 py-12 overflow-hidden">
        {/* 背景装飾 - 幾何学パターン */}
        <Image
          src="/bg/bg_patten.svg"
          alt="Background Pattern"
          width={1920}
          height={600}
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-110 pointer-events-none"
          priority
        />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 grid grid-cols-2 gap-10 items-center relative z-10">
          {/* 3-1. 左側：PCモックアップ画像 */}
          <motion.div 
            className="w-full h-auto rounded-ms relative"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* PC裏の装飾 */}
            <Image
              src="/bg/browser.webp"
              alt="browser Mockup"
              width={800}
              height={533}
              className="relative z-10 w-full h-auto"
            />
          </motion.div>
          {/* 3-2. 右側：テキスト1 */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 
              className="text-lg sm:text-xl md:text-2xl font-bold pb-3 md:pb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <motion.span 
                className="text-[30px] sm:text-[40px] md:text-[50px]"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
              >ゆ</motion.span>くえレコーズ<br />
              <span className="hidden md:inline">
                PICKUP PLAYLIST シリーズ<span className="text-[13px] sm:text-[10px] md:text-[20px]">は</span>
              </span>
              <span className="md:hidden">
                PICKUP PLAYLIST<br />
                シリーズ<span className="text-[13px] sm:text-[10px] md:text-[20px]">は</span>
              </span>
            </motion.h2>
            <motion.p 
              className="leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              レーベル主宰の「駱駝法師」と運営スタッフの「ぴち」が<br className="hidden lg:block" />
              ニコニコ動画上に投稿された<span className="bg-[#13DA99] text-white px-1">おすすめのボカロ音楽</span>を<br className="hidden lg:block" />
              紹介するプレイリスト企画です。
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 3.1. ブランド説明 - グリッドレイアウト */}
      <section className="w-full max-w-7xl mx-auto mx-160 py-20 relative ring-2 ring-gray-300">
        {/* SVG装飾 - 四隅 */}
        <span className="absolute top-0 left-0 w-10 h-10">
          <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_127_1)">
              <mask id="mask0_1_127_1" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                <path d="M200 0H0V200H200V0Z" fill="white"/>
              </mask>
              <g mask="url(#mask0_1_127_1)">
                <path fillRule="evenodd" clipRule="evenodd" d="M100 0H0V100H100V200H200V100H100V0Z" fill="url(#paint0_linear_1_127_1)"/>
              </g>
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_127_1" x1="177" y1="-1.00277e-05" x2="39.5" y2="152.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#191970"/>
                <stop offset="1" stopColor="#ffe4c4"/>
              </linearGradient>
              <clipPath id="clip0_1_127_1">
                <rect width="200" height="200" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </span>
        <span className="absolute top-0 right-0 w-10 h-10">
          <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_127_2)">
              <mask id="mask0_1_127_2" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                <path d="M200 0H0V200H200V0Z" fill="white"/>
              </mask>
              <g mask="url(#mask0_1_127_2)">
                <path fillRule="evenodd" clipRule="evenodd" d="M100 0H0V100H100V200H200V100H100V0Z" fill="url(#paint0_linear_1_127_2)"/>
              </g>
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_127_2" x1="177" y1="-1.00277e-05" x2="39.5" y2="152.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#191970"/>
                <stop offset="1" stopColor="#ffe4c4"/>
              </linearGradient>
              <clipPath id="clip0_1_127_2">
                <rect width="200" height="200" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </span>
        <span className="absolute bottom-0 left-0 w-10 h-10">
          <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_127_3)">
              <mask id="mask0_1_127_3" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                <path d="M200 0H0V200H200V0Z" fill="white"/>
              </mask>
              <g mask="url(#mask0_1_127_3)">
                <path fillRule="evenodd" clipRule="evenodd" d="M100 0H0V100H100V200H200V100H100V0Z" fill="url(#paint0_linear_1_127_3)"/>
              </g>
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_127_3" x1="177" y1="-1.00277e-05" x2="39.5" y2="152.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#191970"/>
                <stop offset="1" stopColor="#ffe4c4"/>
              </linearGradient>
              <clipPath id="clip0_1_127_3">
                <rect width="200" height="200" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </span>
        <span className="absolute bottom-0 right-0 w-10 h-10">
          <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_127_4)">
              <mask id="mask0_1_127_4" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                <path d="M200 0H0V200H200V0Z" fill="white"/>
              </mask>
              <g mask="url(#mask0_1_127_4)">
                <path fillRule="evenodd" clipRule="evenodd" d="M100 0H0V100H100V200H200V100H100V0Z" fill="url(#paint0_linear_1_127_4)"/>
              </g>
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_127_4" x1="177" y1="-1.00277e-05" x2="39.5" y2="152.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#191970"/>
                <stop offset="1" stopColor="#ffe4c4"/>
              </linearGradient>
              <clipPath id="clip0_1_127_4">
                <rect width="200" height="200" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* 左側：テキスト */}
          <motion.div 
            className="text-center md:text-right leading-relaxed text-sm sm:text-sm md:text-base lg:text-lg"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              ゆくえレコーズのキュレーションは<br />
              レーベルの前身となるコンピレーション<br />
            </motion.div>
            <motion.span 
              className="text-[20px] sm:text-[20px] md:text-[30px]"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              【<span className="font-zen-old-mincho">合成音声</span><span className="align-middle text-[10px] sm:text-[10px] md:text-[20px]">の</span><span className="align-middle text-[15px] sm:text-[15px] md:text-[25px]">ゆくえ</span>】
            </motion.span><br />
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              から一貫して
            </motion.div>
          </motion.div>
          
          {/* 右側：画像 */}
          <motion.div 
            className="flex justify-center md:justify-start"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <a 
                href="https://www.youtube.com/watch?v=f-ultemZGEw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/bg/VocaYukuCDTorikomiJacket.jpg"
                  alt="VocaYukuCDTorikomiJacket"
                  width={200}
                  height={200}
                  className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-lg shadow-lg"
                />
              </a>
              <p className="text-[10px] text-gray-600 mt-2 text-center">
              Compilation Album「合成音声のゆくえ」
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>


            {/* 4. 段落2：画像周りのテキスト配置 */}
      <section className="w-full max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-0 z-20 relative">
        <div className="relative min-h-[600px] flex items-center justify-center">
          {/* 中央配置画像 */}
          <div className="flex justify-center items-center z-0 relative">
            {/* 画像の裏側の円形装飾 */}
            <motion.svg 
              width="500"
              height="500"
              viewBox="0 0 500 500" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ rotate: 360 }}
              transition={{ 
                opacity: { duration: 0.8, ease: "easeOut" },
                scale: { duration: 0.8, ease: "easeOut" },
                rotate: { duration: 20, ease: "linear", repeat: Infinity }
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <circle cx="250" cy="250" r="200" fill="none" stroke="#none" strokeWidth="none"/>
              <defs>
                <path id="genreCircle" d="M250,50 a200,200 0 1,1 0,400 a200,200 0 1,1 0,-400" />
              </defs>
              <motion.text 
                fontSize="37" 
                fill="#13DA99" 
                fontWeight="thin"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <textPath href="#genreCircle" startOffset="0">
                  Rock・Pop・Electronic・Jazz・Ambient・Classical・Alternative・Indie
                </textPath>
              </motion.text>
            </motion.svg>
            
            <div>
              <Image
                src="/bg/pc_mock.webp"
                alt="PC Mockup"
                width={400}
                height={267}
                className="w-64 sm:w-80 md:w-96 lg:w-[400px] h-auto rounded-lg relative z-10"
              />
            </div>
          </div>
          
                    {/* 左上のテキスト */}
          <motion.div 
            className="absolute top-16 left-16 text-left text-lg sm:text-xl md:text-xl lg:text-2xl max-w-xs font-bold"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span 
              className='bg-white inline-block px-1'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >広野に散らばった</motion.span><br />
            <motion.span 
              className="bg-white inline-block px-1 text-[32px] sm:text-[36px] md:text-[44px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >点と点を</motion.span><br />
            <motion.span 
              className='bg-white inline-block px-1'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >新しい視点と文脈で結び</motion.span>
          </motion.div>
          
          {/* 右下のテキスト */}
          <motion.div 
            className="absolute bottom-16 right-16 text-right text-lg sm:text-xl md:text-xl lg:text-2xl max-w-xs font-bold"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span 
              className='bg-white inline-block px-1'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >文化圏の深みに在る</motion.span><br />
            <motion.span 
              className="bg-white inline-block px-1 text-[32px] sm:text-[36px] md:text-[44px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >先鋭的なボカロ</motion.span><br />
            <motion.span 
              className='bg-white inline-block px-1'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >音楽へと</motion.span><br />
          </motion.div>
          
          {/* 右上のSVG装飾 */}
          <div className="absolute top-0 right-10 translate-x-1/4">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1_171_2)">
                  <mask id="mask0_1_171_2" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                    <path d="M200 0H0V200H200V0Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_1_171_2)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H50V50H0V0ZM100 50H50V100H0V150H50V200H100V150H150V200H200V150H150V100H200V50H150V0H100V50ZM100 100H150V50H100V100ZM100 100V150H50V100H100Z" fill="#13DA99"/>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_1_171_2">
                    <rect width="200" height="200" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          
        </div>

      </section>
                  {/* 下中央のテキスト */}
                  <motion.div 
                    className="flex justify-center items-center pb-20 relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="text-center text-black font-bold leading-tight">
                      <div className="mb-2">
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >容</motion.span>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >易</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >に</motion.span>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >ア</motion.span>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >ク</motion.span>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >セ</motion.span>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >ス</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >で</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >き</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.9, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >る</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.0, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >よ</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.1, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >う</motion.span>
                      </div>
                      <div>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >取</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.3, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >り</motion.span>
                        <motion.span 
                          className="text-3xl md:text-4xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 1 }}
                          viewport={{ once: true }}
                        >組</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1.4, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >ん</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.5, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >で</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.6, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >い</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.7, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >ま</motion.span>
                        <motion.span 
                          className="text-lg md:text-xl"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 1.8, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >す</motion.span>
                      </div>
                    </div>
                    
                    {/* 左下のSVG装飾 */}
                    <div className="absolute bottom-0 left-1/6 -translate-x-1/4">
                      <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1_171)">
                            <mask id="mask0_1_171" style={{maskType:'luminance'}} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                              <path d="M200 0H0V200H200V0Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_1_171)">
                              <path fillRule="evenodd" clipRule="evenodd" d="M0 0H50V50H0V0ZM100 50H50V100H0V150H50V200H100V150H150V200H200V150H150V100H200V50H150V0H100V50ZM100 100H150V50H100V100ZM100 100V150H50V100H100Z" fill="#13DA99"/>
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_1_171">
                              <rect width="200" height="200" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </motion.div>

      {/* 5. 段落3：テキスト中心レイアウト */}
      <section className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 max-w-none bg-gray-200 py-18 overflow-hidden z-10">
        {/* 背景装飾 - 幾何学パターン */}
        <Image
          src="/bg/bg_patten.svg"
          alt="Background Pattern"
          width={1920}
          height={600}
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-110 pointer-events-none"
          priority
        />
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 relative">
          <div className="text-center">
            {/* タイトル部分 */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-block">
                <motion.span 
                  className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#13DA99] to-[#191970] bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  PICKUP PLAYLIST
                </motion.span>
                <motion.span 
                  className="text-xl md:text-2xl lg:text-3xl text-gray-700 ml-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                >では</motion.span>
              </div>
            </motion.div>

            {/* メインテキスト */}
            <motion.div 
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.p 
                className="leading-relaxed text-base md:text-lg lg:text-xl text-gray-800 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  作り手の<span className="font-semibold text-[#13DA99]">知名度</span>や<span className="font-semibold text-[#13DA99]">コミュニティ</span>、<span className="font-semibold text-[#13DA99]">ジャンル</span>などを問わず<br />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  幅広くセレクトすることで<span className="font-semibold text-[#191970]">リスナーのための導線の整理</span>だけでなく、<br />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <span className="font-semibold text-[#191970]">作り手のモチベーションの向上</span>を目的としており、<br />
                </motion.span>
                <motion.span 
                  className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#13DA99] to-[#191970] bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  ボカロ文化の更なる発展と深化
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                >を目指しています。</motion.span>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* 6. 背景エフェクト */}
      <PickupBackground />

      {/* 7. フッター */}
      <Footer />
    </div>
  )
}