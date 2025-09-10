'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import LoadingPage from '@/components/LoadingPage'
import videos_2025_08 from "@/data/2025/videos_08.json";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const videoList = videos_2025_08;
  const yearMonth = "2025.08";

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // 初回マウント時にローディングを開始
  useEffect(() => {
    setIsLoading(true);
  }, []);
  
  if (isLoading) {
    return <LoadingPage onComplete={handleLoadingComplete} duration={4000} />;
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