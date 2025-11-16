"use client";

import Image from 'next/image';
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="footer footer-horizontal footer-center bg-[#EEEEEE] text-base-content rounded pb-10">
        <div className="flex flex-col items-center gap-0">
          <a
            href="https://www.nicovideo.jp/user/131010307/mylist/76687470"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary text-dark border-[#222222] border-1 shadow-md rounded-sm px-3 group relative overflow-hidden flex items-center justify-center m-8 w-[110px]"
          >
            <span className="flex items-center gap-3 text-[#222222]">
              <svg className="w-3 h-3 text-[#222222]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.4787 7.534v12.1279A2.0213 2.0213 0 0 0 2.5 21.6832h2.3888l1.323 2.0948a.4778.4778 0 0 0 .4043.2205.4778.4778 0 0 0 .441-.2205l1.323-2.0948h6.9828l1.323 2.0948a.4778.4778 0 0 0 .441.2205c.1838 0 .3308-.0735.4043-.2205l1.323-2.0948h2.6462a2.0213 2.0213 0 0 0 2.0213-2.0213V7.5339a2.0213 2.0213 0 0 0-2.0213-1.9845h-7.681l4.4468-4.4469L17.1637 0l-5.1452 5.1452L6.8 0 5.6973 1.1025l4.4102 4.4102H2.5367a2.0213 2.0213 0 0 0-2.058 2.058z"/>
              </svg>
              <span>ニコニコへ</span>
            </span>
          </a>
          <Link href="/" className="btn btn-sm btn-outline btn-shuffle-skew mb-10 w-[110px]">
            <span>ホームへ戻る</span>
          </Link>
          <Image src="/Logo_Horizontal.svg" alt="Yukue Logo" width={120} height={28} className="h-7" unoptimized />
        </div>
        <nav className="grid grid-flow-col gap-4">
          <Link href="/concept" className="link link-hover">Concept</Link>
          <Link href="/archive" className="link link-hover">アーカイブ</Link>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a href="https://yukuerecords.studio.site/" title="ホーム">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
              </svg>
            </a>
            <a href="https://x.com/YUKUE_RECORDS" title="X (Twitter)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
          </div>
        </nav>
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All rights reserved by ゆくえレコーズ.</p>
        </aside>
      </footer>
    </>
  )
} 