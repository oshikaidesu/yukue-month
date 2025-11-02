import { getMainPlaylist, getLatestPlaylist } from '@/lib/api/yukuemonth';
import HomeClient from './HomeClient';

export const dynamic = 'force-static';

export default async function Home() {
  // ビルド時にisMain=trueのプレイリストを取得
  // 見つからない場合は最新のプレイリストを取得（フォールバック）
  let playlist = await getMainPlaylist();
  
  if (!playlist) {
    // isMain=trueが見つからない場合は最新のプレイリストを使用
    playlist = await getLatestPlaylist();
  }

  if (!playlist) {
    // プレイリストが全くない場合のエラーハンドリング
    return (
      <div className="min-h-screen bg-[#EEEEEE] flex items-center justify-center" data-theme="light">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">データが見つかりません</h1>
          <p className="text-gray-600">プレイリストデータをmicroCMSで設定してください。</p>
        </div>
      </div>
    );
  }

  return (
    <HomeClient 
      videoList={playlist.videos}
      yearMonth={playlist.yearMonth}
    />
  );
} 