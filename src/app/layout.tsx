import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900']
})

// 環境に応じたベースURLの設定
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // 本番環境では現在のデプロイURLを使用
    return 'https://c2f9ee14.yukue-month-exy.pages.dev'
  }
  return 'http://localhost:3000'
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
  description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
  keywords: ['ボカロ', 'VOCALOID', '音楽', 'プレイリスト', 'ゆくえレコーズ'],
  authors: [{ name: 'ゆくえレコーズ' }],
  creator: 'ゆくえレコーズ',
  publisher: 'ゆくえレコーズ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
    description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
    siteName: 'ゆくえレコーズ',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: `${getBaseUrl()}/opg_pic.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
    description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
    images: [`${getBaseUrl()}/opg_pic.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" data-theme="light">
      <head>
        {/* 静的OGPメタタグ（SNSクローラー対応） */}
        <meta property="og:title" content="ゆくえレコーズ MONTHLY PICKUP PLAYLIST" />
        <meta property="og:description" content="リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト" />
        <meta property="og:image" content="https://c2f9ee14.yukue-month-exy.pages.dev/opg_pic.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ゆくえレコーズ" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ゆくえレコーズ MONTHLY PICKUP PLAYLIST" />
        <meta name="twitter:description" content="リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト" />
        <meta name="twitter:image" content="https://c2f9ee14.yukue-month-exy.pages.dev/opg_pic.jpg" />
        
        {/* LCP画像の可能性があるドメインへ preconnect */}
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tn.smilevideo.jp" crossOrigin="anonymous" />
        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={zenKakuGothicNew.className}>
        {children}
      </body>
    </html>
  )
}
