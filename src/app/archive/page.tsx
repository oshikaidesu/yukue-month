"use client";

import { useState, useEffect, useRef } from "react";
import VideoCards from "@/components/VideoCards";
// import { getYearMonthFromPath } from "@/data/getYearMonthFromPath";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PickupBackground from '@/components/PickupBackground'
import { VideoItem } from "@/types/video";

const yearOptions = [
  { label: "2024年", value: "2024" },
  { label: "2025年", value: "2025" },
  // 追加の年があればここに追加
];

// 存在する月のリスト（ファイル名から抽出）
const availableMonthsMap: { [key: string]: string[] } = {
  "2024": ["04", "05", "08", "09", "10", "11", "12"], // 必要に応じて2024年の月を追加
  "2025": ["01", "02", "03", "voca_winter", "04", "05", "06", "07"]
};

type YearType = keyof typeof availableMonthsMap;
export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState<YearType | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const monthsContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const [isShuffleAnimating, setIsShuffleAnimating] = useState(false);
  const handleShuffle = () => {
    // アニメーション開始
    setIsShuffleAnimating(true);
    // 500ms後にアニメーション終了
    setTimeout(() => setIsShuffleAnimating(false), 500);
    const years = Object.keys(availableMonthsMap) as YearType[];
    if (years.length === 0) return;
    const randomYear = years[Math.floor(Math.random() * years.length)];
    const months = availableMonthsMap[randomYear] ?? [];
    if (months.length === 0) return;
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    setSelectedYear(randomYear);
    setSelectedMonth(randomMonth);
    if (typeof window !== "undefined") {
      localStorage.setItem('archive-selected-year', String(randomYear));
      localStorage.setItem('archive-selected-month', String(randomMonth));
    }
  };

  // 初回マウント時にlocalStorageから値を復元（なければ既定値）
  useEffect(() => {
    if (typeof window !== "undefined") {
      const yearKey = 'archive-selected-year';
      const monthKey = 'archive-selected-month';

      const savedYearRaw = localStorage.getItem(yearKey);
      const validYears = Object.keys(availableMonthsMap) as YearType[];
      const isValidYear = (y: unknown): y is YearType =>
        typeof y === 'string' && (validYears as string[]).includes(y);

      const initialYear: YearType = isValidYear(savedYearRaw) ? (savedYearRaw as YearType) : "2025";
      const monthsForYear = availableMonthsMap[initialYear] ?? [];

      const savedMonthRaw = localStorage.getItem(monthKey);
      const isValidMonthForYear = (m: unknown): m is string =>
        typeof m === 'string' && monthsForYear.includes(m);

      const initialMonth: string = isValidMonthForYear(savedMonthRaw)
        ? (savedMonthRaw as string)
        : (monthsForYear[0] ?? "");

      setSelectedYear(initialYear);
      setSelectedMonth(initialMonth);
      setIsInitialized(true);
    }
  }, []);

  // 年が変わったら、その年の最初の月に自動で切り替え（ユーザーが年を変更した時のみ）
  const handleYearChange = (newYear: YearType) => {
    const months = availableMonthsMap[newYear];
    const newMonth = months && months.length > 0 ? months[0] : "";

    setSelectedYear(newYear);
    setSelectedMonth(newMonth);

    // localStorage を更新
    if (typeof window !== "undefined") {
      localStorage.setItem('archive-selected-year', String(newYear));
      localStorage.setItem('archive-selected-month', String(newMonth));
    }
  };

  // 月変更時のハンドラー
  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);

    // localStorage を更新
    if (typeof window !== "undefined") {
      localStorage.setItem('archive-selected-month', String(newMonth));
    }
  };

  // 月一覧 ドラッグスクロール制御（Pointer EventsでPC/モバイル両対応）
  const onMonthsPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!monthsContainerRef.current) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    scrollStartLeftRef.current = monthsContainerRef.current.scrollLeft;
    try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch {}
  };

  const onMonthsPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !monthsContainerRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    monthsContainerRef.current.scrollLeft = scrollStartLeftRef.current - deltaX;
  };

  const onMonthsPointerUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isInitialized || !selectedYear || !selectedMonth) return;
    
    const loadVideos = async () => {
      setLoading(true);
      try {
        const videoModule = await import(`@/data/${selectedYear}/videos_${selectedMonth}.json`);
        setVideoList(videoModule.default);
      } catch {
        setVideoList([]);
      }
      setLoading(false);
    };
    loadVideos();
  }, [selectedYear, selectedMonth, isInitialized]);

  const availableMonths = selectedYear ? availableMonthsMap[selectedYear] ?? [] : [];


  return (
    <div className="relative min-h-screen bg-[#EEEEEE]">
      <PickupBackground />
      <div className="relative z-10">
        <Header />
        <div className="mx-auto pt-30">
          <h1 className="text-3xl font-bold mb-2 text-center">アーカイブ</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">-archives-</p>
          {!isInitialized ? (
            <div className="text-center">読み込み中...</div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8 gap-4">
                <div className="w-full flex justify-center">
                  <div className="flex gap-10 py-2 px-2 font-english">
                    {yearOptions.map((y: { label: string; value: YearType }) => (
                      <button
                        key={y.value}
                        className={`btn btn-md btn-neutral btn-outline rounded-full shadow-md transition-opacity duration-200 min-w-[80px] text-base font-semibold tracking-wide ${selectedYear === y.value ? 'opacity-100 border-primary text-primary bg-[#EEEEEE]' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => handleYearChange(y.value)}
                      >
                        {y.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-label="シャッフル"
                      title="シャッフル"
                      className="btn btn-md btn-neutral btn-outline rounded-lg shadow-md min-w-[80px] flex items-center justify-center gap-2"
                      onClick={handleShuffle}
                    >
                      <svg className={`w-6 h-6 transition-transform duration-500 ease-in-out ${isShuffleAnimating ? 'rotate-360' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
                      </svg>
                      <span className="text-xs font-bold">シャッフル</span>
                    </button>
                  </div>
                </div>
                <div className="w-full max-w-md mx-auto px-4">
                  <div
                    ref={monthsContainerRef}
                    className={`flex flex-nowrap overflow-x-auto gap-2 py-1 px-1 scrollbar-thin scrollbar-thumb-base-300 scroll-smooth select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onPointerDown={onMonthsPointerDown}
                    onPointerMove={onMonthsPointerMove}
                    onPointerUp={onMonthsPointerUpOrLeave}
                    onPointerLeave={onMonthsPointerUpOrLeave}
                  >
                    {availableMonths.map((value: string) => (
                      <button
                        key={value}
                        className={`btn btn-sm min-w-[56px] font-english ${
                          selectedMonth === value ? "btn-primary" : "btn-ghost"
                        }`}
                        onClick={() => handleMonthChange(value)}
                      >
                        {value === "voca_winter" ? "ボカコレ冬" : `${parseInt(value, 10)}月`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {selectedMonth === "" ? (
                <div className="text-center">月データがありません</div>
              ) : loading ? (
                <div className="text-center">読み込み中...</div>
              ) : (
                <VideoCards 
                  videoList={videoList} 
                  yearMonth={`${selectedYear}.${selectedMonth === "voca_winter" ? "voca_winter" : selectedMonth.padStart(2, '0')}`}
                />
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
} 