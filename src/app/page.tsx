import Image from "next/image";
import VideoPortfolio from '../components/VideoPortfolio';
import { videos } from '../data/videos';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="glass sticky top-0 z-50">
        <div className="navbar max-w-7xl mx-auto px-4">
          <div className="navbar-start">
            <Image
              src="/logo.svg"
              alt="Yukue Logo"
              width={120}
              height={23}
              className="h-8 w-auto filter brightness-0 invert"
            />
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><a href="#home" className="link link-hover text-white hover:text-primary">ホーム</a></li>
              <li><a href="#about" className="link link-hover text-white hover:text-primary">私について</a></li>
              <li><a href="#videos" className="link link-hover text-white hover:text-primary">動画ポートフォリオ</a></li>
              <li><a href="#contact" className="link link-hover text-white hover:text-primary">お問い合わせ</a></li>
            </ul>
          </div>
          <div className="navbar-end">
            <a href="/admin" className="btn btn-primary glass border-0">管理画面</a>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <section id="home" className="hero min-h-[80vh] flex items-center justify-center">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-8">
                動画ポートフォリオ
              </h1>
              <p className="py-8 text-xl text-white leading-relaxed">
                私の作品やチュートリアル動画を集めたポートフォリオです。
                プログラミング、デザイン、その他の興味深いコンテンツをお楽しみください。
              </p>
              <div className="flex gap-4 justify-center">
                <a href="#videos" className="btn btn-primary btn-lg glass border-0 hover-lift">
                  動画を見る
                </a>
                <a href="#about" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                  私について
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              このポートフォリオの特徴
            </h2>
            <p className="text-xl text-white opacity-90">
              最新のWeb技術で作られた美しい動画ポートフォリオ
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card glass border-0 hover-lift">
              <div className="card-body text-center">
                <div className="text-6xl mb-6">
                  🎥
                </div>
                <h4 className="card-title justify-center text-xl">動画埋め込み</h4>
                <p className="text-white opacity-90">YouTube、Vimeoなど様々なプラットフォームの動画を簡単に埋め込み</p>
              </div>
            </div>
            <div className="card glass border-0 hover-lift">
              <div className="card-body text-center">
                <div className="text-6xl mb-6">
                  📱
                </div>
                <h4 className="card-title justify-center text-xl">レスポンシブ</h4>
                <p className="text-white opacity-90">あらゆるデバイスで美しく表示される動画グリッド</p>
              </div>
            </div>
            <div className="card glass border-0 hover-lift">
              <div className="card-body text-center">
                <div className="text-6xl mb-6">
                  🔍
                </div>
                <h4 className="card-title justify-center text-xl">カテゴリ分け</h4>
                <p className="text-white opacity-90">カテゴリ別に動画を整理し、簡単に探せる機能</p>
              </div>
            </div>
          </div>
        </section>

        {/* 動画ポートフォリオセクション */}
        <section id="videos" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              動画ポートフォリオ
            </h2>
            <p className="text-xl text-white opacity-90">
              カテゴリ別に整理された動画コレクション
            </p>
          </div>
          <div className="glass rounded-3xl p-8">
            <VideoPortfolio videos={videos} />
          </div>
        </section>

        {/* 私についてセクション */}
        <section id="about" className="py-24">
          <div className="card glass border-0 hover-lift">
            <div className="card-body text-center">
              <h2 className="card-title text-4xl md:text-5xl justify-center mb-8 gradient-text">
                私について
              </h2>
              <p className="text-xl leading-relaxed text-white opacity-90 max-w-3xl mx-auto">
                私は動画コンテンツの作成とWeb開発に情熱を持っています。
                Next.jsとReactを使って、美しく使いやすい動画ポートフォリオを作成しました。
                プログラミング、デザイン、その他の興味深いトピックについて動画で共有しています。
              </p>
            </div>
          </div>
        </section>

        {/* お問い合わせセクション */}
        <section id="contact" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              お問い合わせ
            </h2>
            <p className="text-xl text-white opacity-90">
              ご質問やご相談がございましたら、お気軽にお問い合わせください
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="card glass border-0 hover-lift">
              <div className="card-body">
                <form className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-lg">お名前</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/50"
                      placeholder="山田太郎"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-lg">メールアドレス</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered bg-white/20 border-white/30 text-white placeholder-white/50"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-lg">メッセージ</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-32 bg-white/20 border-white/30 text-white placeholder-white/50"
                      placeholder="メッセージを入力してください..."
                    ></textarea>
                  </div>
                  <div className="form-control mt-8">
                    <button className="btn btn-primary btn-lg glass border-0 hover-lift">
                      送信
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="footer footer-center p-16 glass">
        <div>
          <p className="text-white opacity-90">&copy; 2024 Yukue Video Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
