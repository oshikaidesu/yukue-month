'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'
import videos_2025_06 from "@/data/2025/videos_06.json";
import { getYearMonthFromPath } from "@/data/getYearMonthFromPath";

export default function Home() {
  const videoList = videos_2025_06;
  const dataPath = "src/data/2025/videos_06.json";
  return (
    <div className="min-h-screen bg-base-100" data-theme="light">
      <Header />
      <main>
        <Hero />
        {/* <Hero2 /> */}
        <VideoCards videoList={videoList} dataPath={dataPath} />
      </main>
      <Footer />
    </div>
  );
} 