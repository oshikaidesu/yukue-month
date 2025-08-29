"use client";

/**
 * ヘッダーコンポーネント
 * daisyUIのdrawerコンポーネントを使用したサイドバーナビゲーション
 */
import Image from 'next/image';
import Link from "next/link";
export default function Header() {
  return (
    <div className="drawer">
      {/* チェックボックスでサイドバーの開閉を制御 */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      
      {/* メインコンテンツエリア */}
      <div className="drawer-content flex flex-col">
        {/* ナビゲーションバー */}
        <div className="navbar fixed top-0 z-50 bg-[#EEEEEE]/60 shadow-lg w-full backdrop-blur-md border-b border-white/20">
          {/* モバイル用サイドバートグルボタン */}
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          
          {/* ブランドロゴ */}
          <div className="flex-1 px-2 mx-2">
            <Link href="/" className="btn btn-ghost text-xl">
              <Image src="/Logo_Horizontal.svg" alt="Yukue Logo" width={120} height={28} className="h-7" unoptimized />
            </Link>
          </div>
          
          {/* デスクトップ用ナビゲーションメニュー */}
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
            <li>
            <Link href="/archive" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
              </svg>
              アーカイブ
            </Link>
          </li>
          <li>
            <Link href="/about" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Concept
            </Link>
          </li>
          <li>
            <Link href="https://yukuerecords.studio.site/contact" className="flex items-center gap-3">
            <Image src="/mail.svg" alt="contact" width={20} height={20} className="w-5 h-4" unoptimized />
              お問い合わせ・デモ音源
            </Link>
          </li>
            </ul>
          </div>
          
        </div>
      </div>
      
      {/* サイドバー */}
      <div className="drawer-side z-[9999]">
        {/* サイドバーを閉じるためのオーバーレイ */}
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        
        {/* サイドバーコンテンツ */}
        <ul className="menu bg-[#EEEEEE]/90 backdrop-blur-md min-h-full w-80 p-4">
          {/* サイドバーヘッダー */}
          <div className="flex items-center gap-2 mb-6 p-2">
            <Image src="/Logo_Horizontal.svg" alt="Yukue Logo" width={120} height={32} className="h-8" unoptimized />
          </div>
          
          {/* メインナビゲーション */}
          <li className="menu-title">
            <span>メインメニュー</span>
          </li>
          <li>
            <Link href="/" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              ホーム
            </Link>
          </li>
          <li>
            <Link href="/archive" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
              </svg>
              アーカイブ
            </Link>
          </li>
          <li>
            <Link href="/about" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Concept
            </Link>
          </li>
          <li>
            <Link href="https://yukuerecords.studio.site/contact" className="flex items-center gap-3">
            <Image src="/mail.svg" alt="contact" width={20} height={20} className="w-5 h-4" unoptimized />
              お問い合わせ・デモ音源
            </Link>
          </li>
          
          {/* セパレーター */}
          <div className="divider"></div>
          
          {/* カテゴリメニュー */}
          <li className="menu-title">
            <span>各種リンク</span>
          </li>
          <li>
            <Link href="https://yukuerecords.studio.site/" className="flex items-center gap-3">
              <Image src="/Logo_Mark.svg" alt="Yukue Logo Mark" width={20} height={20} className="w-5 h-4" unoptimized />
              ゆくえレコーズ 公式HP
            </Link>
          </li>

          <li>
            <Link href="https://twitter.com/YUKUE_RECORDS" className="flex items-center gap-3">
              <Image src="/x.svg" alt="X (Twitter)" width={20} height={20} className="w-5 h-4" unoptimized />
              X(Twitter)
            </Link>
          </li>
          
          <li>
            <Link href="https://www.youtube.com/@YUKUE_RECORDS" className="flex items-center gap-3">
              <Image src="/youtube.svg" alt="YouTube" width={20} height={20} className="w-5 h-4" unoptimized />
              YouTube
            </Link>
          </li>

            <li>
              <Link href="https://www.nicovideo.jp/user/131010307" className="flex items-center gap-3">
                <Image src="/niconico.svg" alt="niconico" width={20} height={20} className="w-5 h-4" unoptimized />
                niconico
              </Link>
            </li>

            <li>
              <Link href="https://yukuerecords.bandcamp.com/album/s" className="flex items-center gap-3">
                <Image src="/bandcamp.svg" alt="bandcamp" width={20} height={20} className="w-5 h-4" unoptimized />
                bandcamp
              </Link>
            </li>
            
            <li>
              <Link href="https://www.instagram.com/yukue_records/" className="flex items-center gap-3">
                <Image src="/instagram.svg" alt="Instagram" width={20} height={20} className="w-5 h-4" unoptimized />
                Instagram
              </Link>
            </li>

            <li>
              <Link href="https://big-up.style/labels/649" className="flex items-center gap-3">
                <Image src="/music-note.svg" alt="musicbrainz" width={20} height={20} className="w-5 h-4" unoptimized />
                配信先(BIG UP!)
              </Link>
            </li>

            <li>
              <Link href="https://kiite.jp/user/yukue_records" className="flex items-center gap-3">
                <Image src="/kiite_favicon.png" alt="musicbrainz" width={20} height={20} className="w-5 h-5 rounded-full" unoptimized />
                Kiite
              </Link>
            </li>
          
          
          

          
          {/* セパレーター */}
          <div className="divider"></div>
          
          
        </ul>
      </div>
    </div>
  )
} 