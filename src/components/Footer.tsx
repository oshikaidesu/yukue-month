"use client";

import Image from 'next/image';
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="footer footer-horizontal footer-center bg-[#EEEEEE] text-base-content rounded p-10">
        <div className="flex items-center gap-2">
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