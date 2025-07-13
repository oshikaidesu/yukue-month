'use client'

/**
 * ヘッダーコンポーネント
 * daisyUIのdrawerコンポーネントを使用したサイドバーナビゲーション
 */
export default function Header() {
  return (
    <div className="drawer">
      {/* チェックボックスでサイドバーの開閉を制御 */}
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      
      {/* メインコンテンツエリア */}
      <div className="drawer-content flex flex-col">
        {/* ナビゲーションバー */}
        <div className="navbar fixed top-0 z-50 bg-base-100/10 shadow-lg w-full backdrop-blur-md border-b border-white/30">
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
            <a className="btn btn-ghost text-xl">
              <img src="/Logo_Horizontal.svg" alt="Yukue Logo" className="h-7" />
            </a>
          </div>
          
          {/* デスクトップ用ナビゲーションメニュー */}
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              <li><a href="#home" className="hover:text-primary">ホーム</a></li>
              <li><a href="#videos" className="hover:text-primary">動画一覧</a></li>
              <li><a href="#about" className="hover:text-primary">About</a></li>
              <li><a href="#contact" className="hover:text-primary">お問い合わせ</a></li>
            </ul>
          </div>
          
        </div>
      </div>
      
      {/* サイドバー */}
      <div className="drawer-side z-[9999]">
        {/* サイドバーを閉じるためのオーバーレイ */}
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        
        {/* サイドバーコンテンツ */}
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* サイドバーヘッダー */}
          <div className="flex items-center gap-2 mb-6 p-2">
            <img src="/Logo_Horizontal.svg" alt="Yukue Logo" className="h-8" />
          </div>
          
          {/* メインナビゲーション */}
          <li className="menu-title">
            <span>メインメニュー</span>
          </li>
          <li>
            <a href="#home" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              ホーム
            </a>
          </li>
          <li>
            <a href="#videos" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
              </svg>
              楽曲一覧
            </a>
          </li>
          <li>
            <a href="#about" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              お問い合わせ
            </a>
          </li>
          
          {/* セパレーター */}
          <div className="divider"></div>
          
          {/* カテゴリメニュー */}
          <li className="menu-title">
            <span>カテゴリ</span>
          </li>
          <li>
            <a href="#programming" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              2025年7月
            </a>
          </li>
          
          <li>
            <a href="#programming" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              2025年7月
            </a>
          </li>
          
          <li>
            <a href="#programming" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              2025年7月
            </a>
          </li>
          
          <li>
            <a href="#programming" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              2025年7月
            </a>
          </li>
          
          <li>
            <a href="#programming" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              2025年7月
            </a>
          </li>
          

          
          {/* セパレーター */}
          <div className="divider"></div>
          
          
        </ul>
      </div>
    </div>
  )
} 