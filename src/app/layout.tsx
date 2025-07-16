import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ゆくえレコーズ MONTHLY PICKUP PLAYLIST',
  description: 'リスナーにおすすめしたい良質なボカロ曲を毎月更新するサイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" data-theme="light">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
