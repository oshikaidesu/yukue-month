import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '動画紹介サイト - Yukue',
  description: 'おすすめ動画をカード形式で紹介するサイト',
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
