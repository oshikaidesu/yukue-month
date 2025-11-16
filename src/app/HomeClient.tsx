'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import LoadingPage from '@/components/LoadingPage'
import { VideoItem } from '@/types/video';

interface HomeClientProps {
  videoList?: VideoItem[];
  yearMonth?: string;
}

export default function HomeClient({ videoList, yearMonth }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [clientVideos, setClientVideos] = useState<VideoItem[] | null>(videoList ?? null);
  const [clientYearMonth, setClientYearMonth] = useState<string | null>(yearMonth ?? null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // ローディング完了をlocalStorageに記録
    localStorage.setItem('yukue-has-loaded', 'true');
    localStorage.setItem('yukue-load-time', Date.now().toString());
    localStorage.setItem('yukue-cache-version', '1.0.0');
    console.log('LoadingPage: Loading completed, cache status saved');
  };

  const handleProgressUpdate = (progress: number) => {
    setLoadingProgress(progress);
  };

  // キャッシュ状況をチェックしてローディングの必要性を判定
  useEffect(() => {
    // ランタイム取得（サーバから未提供の場合のみ）
    const fetchIfNeeded = async () => {
      if (clientVideos && clientYearMonth) return;
      try {
        const base = (process.env as any).NEXT_PUBLIC_WORKER_URL;
        if (!base) {
          console.warn('NEXT_PUBLIC_WORKER_URL is not set; cannot fetch playlist at runtime');
          return;
        }
        const url = `${base.replace(/\/+$/,'')}/cms?type=main`;
        const res = await fetch(url);
        const json = await res.json();
        if (json?.success && json?.playlist) {
          setClientVideos(json.playlist.videos || []);
          setClientYearMonth(json.playlist.yearMonth || '');
        } else {
          // フォールバック: latest
          const urlLatest = `${base.replace(/\/+$/,'')}/cms?type=latest`;
          const resLatest = await fetch(urlLatest);
          const jsonLatest = await resLatest.json();
          if (jsonLatest?.success && jsonLatest?.playlist) {
            setClientVideos(jsonLatest.playlist.videos || []);
            setClientYearMonth(jsonLatest.playlist.yearMonth || '');
          }
        }
      } catch (e) {
        console.warn('Failed to fetch playlist via Worker', e);
      }
    };

    const checkCacheStatus = async () => {
      const hasLoadedBefore = localStorage.getItem('yukue-has-loaded');
      const lastLoadTime = localStorage.getItem('yukue-load-time');
      const cacheVersion = localStorage.getItem('yukue-cache-version');
      const currentVersion = '1.0.0'; // アプリのバージョン
      
      // キャッシュの有効性をチェック
      const isCacheValid = hasLoadedBefore && 
        lastLoadTime && 
        Date.now() - parseInt(lastLoadTime) < 24 * 60 * 60 * 1000 && // 24時間以内
        cacheVersion === currentVersion; // バージョンが一致
      
      // ネットワーク接続速度をチェック（高速な場合はローディングを短縮）
      const connectionSpeed = (navigator as any).connection?.effectiveType;
      const isSlowConnection = connectionSpeed === 'slow-2g' || connectionSpeed === '2g';
      
      // 開発者ツール用のキャッシュクリア機能
      (window as any).clearYukueCache = () => {
        localStorage.removeItem('yukue-has-loaded');
        localStorage.removeItem('yukue-load-time');
        localStorage.removeItem('yukue-cache-version');
        console.log('Yukue cache cleared. Reload the page to see loading screen.');
      };
      
      if (!isCacheValid) {
        setIsLoading(true);
        setLoadingProgress(0);
        console.log('LoadingPage: Cache invalid or first visit, showing loading');
      } else if (isSlowConnection) {
        // 低速接続の場合は短いローディングを表示
        setIsLoading(true);
        setLoadingProgress(0);
        console.log('LoadingPage: Slow connection detected, showing short loading');
      } else {
        setIsLoading(false);
        console.log('LoadingPage: Fast cached visit, skipping loading');
        console.log('Tip: Use clearYukueCache() in console to reset cache');
      }
      // 非同期でデータ取得
      fetchIfNeeded();
    };
    
    checkCacheStatus();
  }, [clientVideos, clientYearMonth]);
  
  if (isLoading) {
    // ネットワーク接続速度に応じてローディング時間を調整
    const connectionSpeed = (navigator as any).connection?.effectiveType;
    const isSlowConnection = connectionSpeed === 'slow-2g' || connectionSpeed === '2g';
    const minDuration = isSlowConnection ? 1000 : 2000; // 低速接続の場合は1秒、通常は2秒
    
    return <LoadingPage onComplete={handleLoadingComplete} onProgressUpdate={handleProgressUpdate} minDuration={minDuration} />;
  }
  
  return (
    <div className="min-h-screen bg-[#EEEEEE]" data-theme="light">
      <Header />
      <main>
        <Hero videoList={clientVideos || videoList || []} />
        <PickupBackground />

        <VideoCards videoList={clientVideos || videoList || []} yearMonth={clientYearMonth || yearMonth || ''} />
      </main>
      <Footer />
    </div>
  );
}

