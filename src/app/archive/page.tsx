import { getAllPlaylists, getAvailableYearMonths } from '@/lib/api/yukuemonth';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import ArchiveClient from './ArchiveClient';

export const dynamic = 'force-static';

export default async function ArchivePage() {
  // ビルド時にすべてのプレイリストと利用可能な年月を取得
  const [allPlaylists, availableYearMonths] = await Promise.all([
    getAllPlaylists(),
    getAvailableYearMonths(),
  ]);

  return (
    <div className="relative min-h-screen bg-[#EEEEEE]">
      <PickupBackground />
      <div className="relative z-10">
        <Header />
        <div className="mx-auto pt-30">
          <h1 className="text-3xl font-bold mb-2 text-center">アーカイブ</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">-archives-</p>
          <ArchiveClient 
            allPlaylists={allPlaylists}
            availableYearMonths={availableYearMonths}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
} 