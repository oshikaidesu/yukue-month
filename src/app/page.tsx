'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import LoadingPage from '@/components/LoadingPage'
import videos_2025_09 from "@/data/2025/videos_09.json";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const videoList = videos_2025_09;
  const yearMonth = "2025.09";

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
    };
    
    checkCacheStatus();
  }, []);
  
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
        <Hero videoList={videoList} />
        <PickupBackground />

        <VideoCards videoList={videoList} yearMonth={yearMonth} />
      </main>
      <Footer />
    </div>
  );
} 