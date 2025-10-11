module.exports = {
  ci: {
    collect: {
      // 静的サイトのビルド後のディレクトリを指定
      staticDistDir: './out',
      // テストするURLを指定（ホームページのみ）
      url: [
        'http://localhost:3000',
      ],
      // テスト回数（分散を減らすため）
      numberOfRuns: 1,
      // 詳細なレポートを生成
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
      },
    },
    assert: {
      // パフォーマンス予算の設定（警告レベルに変更）
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        // 具体的なメトリクスの設定（警告レベル）
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.15 }],
        'total-blocking-time': ['warn', { maxNumericValue: 400 }],
        'speed-index': ['warn', { maxNumericValue: 3500 }],
      },
    },
    upload: {
      // ローカル実行時は結果をアップロードしない
      target: 'filesystem',
      outputDir: './lighthouse-reports',
    },
  },
};
