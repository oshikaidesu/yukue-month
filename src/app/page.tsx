import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import videos_2025_07 from "@/data/2025/videos_07.json";

export default function Home() {
  const videoList = videos_2025_07;
  const dataPath = "src/data/2025/videos_07.json";
  return (
    <div className="min-h-screen bg-[#EEEEEE]" data-theme="light">
      <Header />
      <main>
        <Hero />
        <PickupBackground />

        <VideoCards videoList={videoList} dataPath={dataPath} />
      </main>
      <Footer />
    </div>
  );
} 