'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchMylistVideos, type VideoItem } from '@/lib/mylist-fetcher';

export default function ImporterPage() {
  const [mylistUrl, setMylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoItem[] | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mylistUrl.trim()) {
      setError('マイリストURLを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setJsonText('');
    setProgress({ current: 0, total: 0 });
    setCopied(false);

    try {
      const videos = await fetchMylistVideos(mylistUrl.trim(), (current, total) => {
        setProgress({ current, total });
      });

      setResult(videos);
      const jsonString = JSON.stringify(videos, null, 2);
      setJsonText(jsonString);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(errorMessage);
      console.error('マイリスト取得エラー:', err);
      
      // CORSエラーの場合は追加のヘルプメッセージを表示
      if (errorMessage.includes('CORS')) {
        console.warn('CORSエラーの可能性があります。ブラウザの開発者ツールで詳細を確認してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!jsonText) return;
    
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピー失敗:', err);
      setError('コピーに失敗しました');
    }
  };

  const handleDownload = () => {
    if (!jsonText) return;
    
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mylist-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE]" data-theme="light">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">マイリストJSON変換</h1>
        <p className="text-sm text-gray-600 mb-8 text-center">
          ニコニコ動画のマイリストURLからJSONデータを生成します
        </p>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={mylistUrl}
              onChange={(e) => setMylistUrl(e.target.value)}
              placeholder="https://www.nicovideo.jp/mylist/12345678"
              className="flex-1 input input-bordered"
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !mylistUrl.trim()}
            >
              {loading ? '処理中...' : '取得'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error mb-6">
            <div className="whitespace-pre-wrap">
              <span>❌ {error}</span>
            </div>
            {error.includes('NEXT_PUBLIC_WORKER_URL') && (
              <div className="mt-2 text-sm">
                <p>💡 ヒント: Cloudflare Workersのエンドポイントを設定してください。</p>
                <p className="mt-1 text-xs">
                  `.env.local`に<code>NEXT_PUBLIC_WORKER_URL=https://your-worker.workers.dev</code>を追加してください。
                </p>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title">処理中...</h2>
              {progress.total > 0 && (
                <div>
                  <progress
                    className="progress progress-primary w-full"
                    value={progress.current}
                    max={progress.total}
                  />
                  <p className="text-sm mt-2">
                    {progress.current} / {progress.total} 件の動画を処理中...
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600">
                マイリストから動画情報を取得し、OGP情報を取得しています...
              </p>
            </div>
          </div>
        )}

        {result && result.length > 0 && (
          <div className="space-y-4">
            <div className="alert alert-success">
              <span>✅ {result.length}件の動画データを取得しました</span>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">生成されたJSON</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className={`btn btn-sm ${copied ? 'btn-success' : 'btn-primary'}`}
                    >
                      {copied ? '✓ コピー済み' : 'コピー'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn btn-sm btn-outline"
                    >
                      ダウンロード
                    </button>
                  </div>
                </div>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="textarea textarea-bordered font-mono text-sm"
                  rows={20}
                  readOnly={false}
                />
                <p className="text-xs text-gray-500 mt-2">
                  JSONを編集してからコピーすることもできます
                </p>
              </div>
            </div>
          </div>
        )}

        {result && result.length === 0 && (
          <div className="alert alert-warning">
            <span>⚠️ 動画データが見つかりませんでした</span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

