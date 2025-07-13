'use client'

/**
 * ヘッダーコンポーネント
 * すりガラス効果付きの追従ヘッダー
 */
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="navbar bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* モバイル用サイドバートグルボタン */}
        <div className="flex-none lg:hidden">
          <button className="btn btn-square btn-ghost">
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
          </button>
        </div>
        
        {/* ブランドロゴ */}
        <div className="flex-1 px-2 mx-2">
          <a className="btn btn-ghost text-xl">
            <img src="/Logo_Horizontal.svg" alt="Yukue Logo" className="h-7" />
          </a>
        </div>
        
        {/* デスクトップ用ナビゲーションメニュー */}
        <div className="hidden flex-none lg:block">
          <ul className="menu menu-horizontal bg-transparent">
            <li><a href="#home" className="hover:text-primary transition-colors duration-200">ホーム</a></li>
            <li><a href="#videos" className="hover:text-primary transition-colors duration-200">動画一覧</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors duration-200">About</a></li>
            <li><a href="#contact" className="hover:text-primary transition-colors duration-200">お問い合わせ</a></li>
          </ul>
        </div>
      </div>
    </header>
  )
} 