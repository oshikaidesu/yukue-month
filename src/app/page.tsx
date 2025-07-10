import Image from 'next/image';
import Link from 'next/link';
import VideoPortfolio from '@/components/VideoPortfolio';
import { videos } from '@/data/videos';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <div className="navbar bg-base-100/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a href="#home">ホーム</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#portfolio">ポートフォリオ</a></li>
              <li><a href="#contact">お問い合わせ</a></li>
            </ul>
          </div>
          <Image
            src="/Logo_Horizontal.svg"
            alt="Yukue Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="#home" className="text-base-content hover:text-primary">ホーム</a></li>
            <li><a href="#about" className="text-base-content hover:text-primary">About</a></li>
            <li><a href="#portfolio" className="text-base-content hover:text-primary">ポートフォリオ</a></li>
            <li><a href="#contact" className="text-base-content hover:text-primary">お問い合わせ</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link href="/admin" className="btn btn-primary btn-sm">
            管理画面
          </Link>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section id="home" className="hero min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="hero-content text-center text-neutral z-10">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold gradient-text mb-8">
              Yukue
            </h1>
            <p className="py-6 text-lg text-base-content/80 leading-relaxed">
              クリエイティブな動画制作で、あなたのビジョンを現実に。
              プロフェッショナルな映像制作サービスを提供します。
            </p>
            <button className="btn-modern">
              ポートフォリオを見る
            </button>
          </div>
        </div>
        
        {/* 装飾的な背景要素 */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-30 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </section>

      {/* About セクション */}
      <section id="about" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">About</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              私たちは、クリエイティブな映像制作を通じて、お客様のビジョンを実現するお手伝いをしています。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="modern-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">動画制作</h3>
              <p className="text-base-content/70">
                高品質な動画制作サービスを提供し、お客様のニーズに合わせたオリジナルコンテンツを作成します。
              </p>
            </div>
            
            <div className="modern-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">クリエイティブ</h3>
              <p className="text-base-content/70">
                独創的なアイデアと技術を組み合わせ、印象的な映像作品を制作します。
              </p>
            </div>
            
            <div className="modern-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">高速配信</h3>
              <p className="text-base-content/70">
                迅速な制作と配信で、お客様のタイムラインに合わせたサービスを提供します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ポートフォリオセクション */}
      <section id="portfolio" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">ポートフォリオ</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              これまでに制作した作品の一部をご紹介します。
            </p>
          </div>
          <VideoPortfolio videos={videos} />
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section id="contact" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">お問い合わせ</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              プロジェクトについてご相談がございましたら、お気軽にお問い合わせください。
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="modern-card p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">お名前</label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-base-100 border-base-300 text-base-content" 
                    placeholder="お名前を入力してください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">メールアドレス</label>
                  <input 
                    type="email" 
                    className="input input-bordered w-full bg-base-100 border-base-300 text-base-content" 
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">メッセージ</label>
                  <textarea 
                    className="textarea textarea-bordered w-full h-32 bg-base-100 border-base-300 text-base-content" 
                    placeholder="プロジェクトの詳細をお聞かせください"
                  ></textarea>
                </div>
                <button type="submit" className="btn-modern w-full">
                  送信する
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-base-300 text-base-content py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Image
                src="/Logo_Horizontal.svg"
                alt="Yukue Logo"
                width={120}
                height={40}
                className="h-8 w-auto mb-4"
              />
              <p className="text-base-content/70">
                クリエイティブな映像制作で、あなたのビジョンを現実に。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">サービス</h3>
              <ul className="space-y-2 text-base-content/70">
                <li>動画制作</li>
                <li>映像編集</li>
                <li>モーショングラフィックス</li>
                <li>プロモーション動画</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
              <ul className="space-y-2 text-base-content/70">
                <li>Email: info@yukue.com</li>
                <li>Tel: 03-1234-5678</li>
                <li>営業時間: 9:00-18:00</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-base-content/20 mt-8 pt-8 text-center text-base-content/70">
            <p>&copy; 2024 Yukue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
