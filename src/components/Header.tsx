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
          {/* モバイル用サイドバートグルボタン（lg: 1024px未満で表示） */}
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
          
          {/* デスクトップ用ナビゲーションメニュー（lg: 1024px以上で表示） */}
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* 公式HPを一番上に配置 */}
              <li>
                <Link href="https://yukuerecords.studio.site/" className="flex items-center gap-3">
                  <Image src="/Logo_Mark.svg" alt="Yukue Logo Mark" width={20} height={20} className="w-5 h-4" unoptimized />
                  公式HP
                </Link>
              </li>
              {/* ニコニコマイリストリンク */}
              <li>
                <Link href="https://www.nicovideo.jp/mylist/76687470" className="flex items-center gap-3">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z"/>
                  </svg>
                  マイリスト
                </Link>
              </li>
              {/* Kiiteリンク */}
              <li>
                <Link href="https://kiite.jp/user/yukue_records" className="flex items-center gap-3">
                  <Image src="/kiite_favicon.png" alt="Kiite" width={20} height={20} className="w-5 h-5 rounded-full" unoptimized />
                  Kiite
                </Link>
              </li>
              <li>
                <Link href="/archive" className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
                  </svg>
                  アーカイブ
                </Link>
              </li>
              <li>
                <Link href="/concept" className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Concept
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
              </svg>
              アーカイブ
            </Link>
          </li>
          <li>
            <Link href="/concept" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Concept
            </Link>
          </li>
          {/* お問い合わせリンクを削除 */}
          
          {/* セパレーター */}
          <div className="divider"></div>
          
          {/* 外部リンクメニュー */}
          <li className="menu-title">
            <span>外部リンク</span>
          </li>
          {/* 公式HPを一番上に配置 */}
          <li>
            <Link href="https://yukuerecords.studio.site/" className="flex items-center gap-3">
              <Image src="/Logo_Mark.svg" alt="Yukue Logo Mark" width={20} height={20} className="w-5 h-4" unoptimized />
              ゆくえレコーズ 公式HP
            </Link>
          </li>

          {/* ニコニコマイリストリンク */}
          <li>
            <Link href="https://www.nicovideo.jp/mylist/76687470" className="flex items-center gap-3">
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(2,0)">
                  <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z"/>
                </g>
              </svg>
              マイリスト
            </Link>
          </li>

          {/* Kiiteのみ残す */}
          <li>
            <Link href="https://kiite.jp/user/yukue_records" className="flex items-center gap-3">
              <Image src="/kiite_favicon.png" alt="Kiite" width={20} height={20} className="w-5 h-5 rounded-full" unoptimized />
              Kiite
            </Link>
          </li>

          {/* 削除されたリンク
          - X(Twitter)
          - YouTube  
          - niconico
          - bandcamp
          - Instagram
          - BIG UP!
          */}
        </ul>
      </div>
    </div>
  );
}