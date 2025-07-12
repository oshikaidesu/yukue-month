export default function Hero2() {
  return (
    <div className="hero bg-base-200 py-16">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        <div className="mockup-window border bg-base-300 w-full max-w-lg">
          <div className="flex justify-center px-4 py-16 bg-base-200">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                  </svg>
                </div>
                <div className="stat-title">動画数</div>
                <div className="stat-value text-primary">2.6K</div>
                <div className="stat-desc">21% more than last month</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="stat-title">お気に入り</div>
                <div className="stat-value text-secondary">1.2K</div>
                <div className="stat-desc">↗︎ 400 (22%)</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <div className="avatar online">
                    <div className="w-16 rounded-full">
                      <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                  </div>
                </div>
                <div className="stat-value">86%</div>
                <div className="stat-title">満足度</div>
                <div className="stat-desc text-secondary">31 tasks remaining</div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-base-content">
            豊富な動画ライブラリ
          </h1>
          <p className="py-6 text-base-content/80">
            様々なジャンルの動画を厳選してご紹介。エンターテイメントから教育まで、
            あなたの興味に合わせた動画をお届けします。
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>高品質な動画コンテンツ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>カテゴリ別の整理された動画</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>お気に入り機能で簡単管理</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>定期的な新着動画の追加</span>
            </div>
          </div>
          <button className="btn btn-primary mt-6">詳細を見る</button>
        </div>
      </div>
    </div>
  )
} 