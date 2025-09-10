import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import videos_2025_08 from "@/data/2025/videos_08.json";

export default function Home() {
  const videoList = videos_2025_08;
  const yearMonth = "2025.08";
  
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