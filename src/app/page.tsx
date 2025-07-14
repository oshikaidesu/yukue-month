'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoCards from '@/components/VideoCards'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100" data-theme="light">
      <Header />
      <main>
        <Hero />
        {/* <Hero2 /> */}
        <VideoCards />
      </main>
      <Footer />
    </div>
  )
} 