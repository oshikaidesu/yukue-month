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
        <div className="navbar bg-base-100 shadow-lg w-full">
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
      <div className="drawer-side">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              動画一覧
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              プログラミング
            </a>
          </li>
          <li>
            <a href="#design" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
              </svg>
              デザイン
            </a>
          </li>
          <li>
            <a href="#security" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              セキュリティ
            </a>
          </li>
          
          {/* セパレーター */}
          <div className="divider"></div>
          
          {/* ユーザーメニュー */}
          <li className="menu-title">
            <span>アカウント</span>
          </li>
          <li>
            <a href="#profile" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              プロフィール
            </a>
          </li>
          <li>
            <a href="#settings" className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              設定
            </a>
          </li>
          <li>
            <a href="#logout" className="flex items-center gap-3 text-error">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              ログアウト
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
} 