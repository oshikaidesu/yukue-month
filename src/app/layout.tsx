import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900']
})

export const metadata: Metadata = {
  title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
  description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
  openGraph: {
    title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
    description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
    images: [
      {
        url: '/opg_pic.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
      },
    ],
    type: 'website',
    siteName: 'ゆくえレコーズ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
    description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
    images: ['/opg_pic.jpg'],
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
