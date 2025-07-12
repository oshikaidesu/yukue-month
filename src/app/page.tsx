import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Hero2 from '@/components/Hero2'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      <main>
        <Hero />
        <Hero2 />
        <VideoCards />
      </main>
      <Footer />
    </div>
  )
} 