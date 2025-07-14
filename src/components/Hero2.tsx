'use client'

import Image from 'next/image';

export default function Hero2() {
  return (
    <div className="hero bg-base-200 py-16">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        <div className="mockup-window border bg-base-300 w-full max-w-lg">
          <div className="flex justify-center px-4 py-16 bg-base-200">
            <div className="stats shadow">
              {/* <div className="stat">
                <div className="stat-figure text-primary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                  </svg>
                </div>
                <div className="stat-title">楽曲数</div>
                <div className="stat-value text-primary">24</div>
                <div className="stat-desc">今月のピックアップ</div>
              </div> */}
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="stat-title">お気に入り</div>
                <div className="stat-value text-secondary">12</div>
                <div className="stat-desc">今月のハイライト</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <div className="avatar online">
                    <div className="w-16 rounded-full">
                      <Image src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="avatar" width={64} height={64} className="rounded-full" unoptimized />
                    </div>
                  </div>
                </div>
                <div className="stat-value">8</div>
                <div className="stat-title">月間</div>
                <div className="stat-desc text-secondary">アーカイブ</div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold text-base-content">
            音楽の図書館
          </h1>
          <p className="py-6 text-base-content/80">
            月ごとに厳選された楽曲を、図書館や骨董屋のような雰囲気でご紹介。
            新しい音楽との出会いと発見をお届けします。
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>月間ピックアップ楽曲</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>過去のアーカイブ閲覧</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>新しい音楽の発見</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-success badge-sm">✓</div>
              <span>ポップで実験的なデザイン</span>
            </div>
          </div>
          <button className="btn btn-primary mt-6">音楽を聴く</button>
        </div>
      </div>
    </div>
  )
} 