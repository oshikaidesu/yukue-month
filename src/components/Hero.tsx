export default function Hero() {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="badge badge-primary mb-4">新着動画</div>
          <h1 className="text-5xl font-bold text-base-content">
            最高の動画体験を
            <span className="text-primary">あなたに</span>
          </h1>
          <p className="py-6 text-base-content/80">
            厳選されたおすすめ動画をカード形式で紹介します。
            新しい発見と感動をお届けします。
          </p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-primary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
              </svg>
              動画を見る
            </button>
            <button className="btn btn-outline">詳細を見る</button>
          </div>
        </div>
      </div>
    </div>
  )
} 