'use client';

import { useState } from 'react';
import NicovideoThumbnail from '@/components/NicovideoThumbnail';

export default function TestApiPage() {
  const [url, setUrl] = useState('');
  const [ogpData, setOgpData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useTestApi, setUseTestApi] = useState(false);
  const [apiType, setApiType] = useState<'general' | 'nicovideo'>('general');

  const testOgpApi = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setOgpData(null);

    try {
      let apiEndpoint = '/api/ogp';
      if (useTestApi) {
        apiEndpoint = '/api/ogp/test';
      } else if (apiType === 'nicovideo') {
        apiEndpoint = '/api/ogp/nicovideo';
      }
      
      const response = await fetch(`${apiEndpoint}?url=${encodeURIComponent(url)}`);
      const data = await response.json() as { success: boolean; data?: Record<string, unknown>; error?: string };

      if (data.success && data.data) {
        setOgpData(data.data);
      } else {
        setError(data.error || 'Failed to fetch OGP data');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">OGP API テスト</h1>
      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useTestApi}
              onChange={(e) => setUseTestApi(e.target.checked)}
              className="checkbox"
            />
            <span>テスト用APIを使用（モックデータ）</span>
          </label>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <span>APIタイプ:</span>
            <select
              value={apiType}
              onChange={(e) => setApiType(e.target.value as 'general' | 'nicovideo')}
              className="select select-bordered"
              disabled={useTestApi}
            >
              <option value="general">一般OGP API</option>
              <option value="nicovideo">ニコニコ動画専用API</option>
            </select>
          </label>
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URLを入力してください"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={testOgpApi}
            disabled={loading || !url}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {loading ? '取得中...' : 'OGP取得'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {ogpData && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-bold mb-2">OGP データ:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(ogpData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">サムネイル表示テスト</h2>
        {url && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">通常のサムネイル:</h3>
              <NicovideoThumbnail
                videoId="test"
                videoUrl={url}
                width={320}
                height={180}
                useOgpApi={false}
              />
            </div>
            <div>
              <h3 className="font-bold mb-2">OGP API使用:</h3>
              <NicovideoThumbnail
                videoId="test"
                videoUrl={url}
                width={320}
                height={180}
                useOgpApi={true}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">テスト用URL例</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
            className="p-2 text-left border border-gray-300 rounded hover:bg-gray-50"
          >
            YouTube動画
          </button>
          <button
            onClick={() => setUrl('https://www.nicovideo.jp/watch/sm43797240')}
            className="p-2 text-left border border-gray-300 rounded hover:bg-gray-50"
          >
            ニコニコ動画（実際の動画）
          </button>
          <button
            onClick={() => setUrl('https://www.nicovideo.jp/watch/sm12345678')}
            className="p-2 text-left border border-gray-300 rounded hover:bg-gray-50"
          >
            ニコニコ動画（テスト用）
          </button>
          <button
            onClick={() => setUrl('https://twitter.com/example')}
            className="p-2 text-left border border-gray-300 rounded hover:bg-gray-50"
          >
            Twitter/X
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">API エンドポイント情報</h2>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">本番API:</h3>
          <code className="text-sm">GET /api/ogp?url={url}</code>
          <p className="text-sm text-gray-600 mt-1">実際のOGP情報を取得（open-graph-scraper使用）</p>
          
          <h3 className="font-bold mb-2 mt-4">ニコニコ動画専用API:</h3>
          <code className="text-sm">GET /api/ogp/nicovideo?url={url}</code>
          <p className="text-sm text-gray-600 mt-1">ニコニコ動画のメタデータを直接取得</p>
          
          <h3 className="font-bold mb-2 mt-4">テストAPI:</h3>
          <code className="text-sm">GET /api/ogp/test?url={url}</code>
          <p className="text-sm text-gray-600 mt-1">モックデータを返す（テスト用）</p>
        </div>
      </div>
    </div>
  );
} 