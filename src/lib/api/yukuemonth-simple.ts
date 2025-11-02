/**
 * microCMS APIを手動でfetchする例（SDKを使わない方法）
 * 
 * このファイルは理解用のサンプルです。
 * 実際には src/lib/api/yukuemonth.ts を使うことを推奨します。
 */

/**
 * 手動でfetchを使ってmicroCMSからデータを取得
 */
export async function getPlaylistsSimple() {
  const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
  const API_KEY = process.env.MICROCMS_API_KEY;

  if (!SERVICE_DOMAIN || !API_KEY) {
    throw new Error('環境変数が設定されていません');
  }

  // 1. URLを組み立て
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/yukuemonth`;

  // 2. fetchでHTTPリクエストを送信
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-MICROCMS-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  // 3. エラーチェック
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // 4. JSONを取得して返す
  const data = await response.json();
  return data;
}

/**
 * フィルタリング付きで取得
 */
export async function getPlaylistByYear(year: number) {
  const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
  const API_KEY = process.env.MICROCMS_API_KEY;

  if (!SERVICE_DOMAIN || !API_KEY) {
    throw new Error('環境変数が設定されていません');
  }

  // URLにクエリパラメータを追加
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/yukuemonth?filters=year[equals]${year}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-MICROCMS-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * 使用例:
 * 
 * import { getPlaylistsSimple } from '@/lib/api/yukuemonth-simple';
 * 
 * const data = await getPlaylistsSimple();
 * console.log(data.contents); // プレイリストの配列
 * console.log(data.totalCount); // 総件数
 */

