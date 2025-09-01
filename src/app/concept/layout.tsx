import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
  description: 'ゆくえレコーズ主宰の駱駝法師とレーベルの運営メンバーのぴちがリスナーにおすすめしたいボカロ曲を毎月更新するマイリスト',
  openGraph: {
    title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
    description: 'ゆくえレコーズ主宰の駱駝法師とレーベルの運営メンバーのぴちがリスナーにおすすめしたいボカロ曲を毎月更新するマイリスト',
    images: [
      {
        url: 'https://628a3e98.yukue-month-exy.pages.dev/opg_pic.jpg',
        width: 1280,
        height: 720,
        type: 'image/jpeg',
      },
    ],
    url: 'https://628a3e98.yukue-month-exy.pages.dev/concept',
    type: 'website',
    siteName: 'ゆくえレコーズ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
    description: 'ゆくえレコーズ主宰の駱駝法師とレーベルの運営メンバーのぴちがリスナーにおすすめしたいボカロ曲を毎月更新するマイリスト',
    images: ['https://628a3e98.yukue-month-exy.pages.dev/opg_pic.jpg'],
  },
}

export default function ConceptLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
