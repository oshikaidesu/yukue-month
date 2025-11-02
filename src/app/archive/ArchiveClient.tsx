"use client";

import { useState, useEffect, useRef } from "react";
import VideoCards from "@/components/VideoCards";
import { VideoItem } from "@/types/video";
import { Playlist } from "@/types/microcms";

type YearType = string;

interface ArchiveClientProps {
  allPlaylists: Playlist[];
  availableYearMonths: Array<{ year: number; month: string; yearMonth: string }>;
}

export default function ArchiveClient({ allPlaylists, availableYearMonths }: ArchiveClientProps) {
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
  
  // availableYearMonthsから年と月のマップを作成
  const yearOptions = (() => {
    const years = Array.from(new Set(availableYearMonths.map(item => item.year))).sort((a, b) => b - a);
    return years.map(year => ({
      label: `${year}年`,
      value: String(year),
    }));
  })();

  const availableMonthsMap: { [key: string]: Array<{ month: string; yearMonth: string }> } = (() => {
    const monthsMap: { [key: string]: Array<{ month: string; yearMonth: string }> } = {};
    // availableYearMonthsは既にソートされているので、その順序で処理
    availableYearMonths.forEach((item) => {
      const yearStr = String(item.year);
      if (!monthsMap[yearStr]) {
        monthsMap[yearStr] = [];
      }
      const existing = monthsMap[yearStr].find(m => m.month === item.month && m.yearMonth === item.yearMonth);
      if (!existing) {
        monthsMap[yearStr].push({
          month: item.month,
          yearMonth: item.yearMonth,
        });
      }
    });
    // 各年の月配列をソート（新しい順）
    Object.keys(monthsMap).forEach((year) => {
      monthsMap[year].sort((a, b) => {
        const monthA = a.month === 'voca_winter' ? 0 : parseInt(a.month, 10);
        const monthB = b.month === 'voca_winter' ? 0 : parseInt(b.month, 10);
        return monthB - monthA;
      });
    });
    return monthsMap;
  })();

  const [currentYearMonth, setCurrentYearMonth] = useState<string>("");

  const handleShuffle = () => {
    setIsShuffleAnimating(true);
    setTimeout(() => setIsShuffleAnimating(false), 500);
    const years = Object.keys(availableMonthsMap) as YearType[];
    if (years.length === 0) return;
    const randomYear = years[Math.floor(Math.random() * years.length)];
    const months = availableMonthsMap[randomYear] ?? [];
    if (months.length === 0) return;
    const randomMonthData = months[Math.floor(Math.random() * months.length)];
    setSelectedYear(randomYear);
    setSelectedMonth(randomMonthData.month);
    if (typeof window !== "undefined") {
      localStorage.setItem('archive-selected-year', String(randomYear));
      localStorage.setItem('archive-selected-month', String(randomMonthData.month));
    }
  };

  // 初回マウント時にlocalStorageから値を復元（なければ既定値）
  useEffect(() => {
    if (typeof window === "undefined" || Object.keys(availableMonthsMap).length === 0) return;

    const yearKey = 'archive-selected-year';
    const monthKey = 'archive-selected-month';

    const savedYearRaw = localStorage.getItem(yearKey);
    const validYears = Object.keys(availableMonthsMap) as YearType[];
    const isValidYear = (y: unknown): y is YearType =>
      typeof y === 'string' && (validYears as string[]).includes(y);

    const defaultYear = validYears.length > 0 ? validYears[0] : null;
    const initialYear: YearType = isValidYear(savedYearRaw) ? (savedYearRaw as YearType) : (defaultYear ?? validYears[0] ?? "");
    const monthsForYear = availableMonthsMap[initialYear] ?? [];

    const savedMonthRaw = localStorage.getItem(monthKey);
    const isValidMonthForYear = (m: unknown): m is string =>
      typeof m === 'string' && monthsForYear.some(monthData => monthData.month === m);

    const initialMonth: string = isValidMonthForYear(savedMonthRaw)
      ? (savedMonthRaw as string)
      : (monthsForYear[0]?.month ?? "");

    setSelectedYear(initialYear);
    setSelectedMonth(initialMonth);
    setIsInitialized(true);
  }, [availableMonthsMap]);

  const handleYearChange = (newYear: YearType) => {
    const months = availableMonthsMap[newYear];
    const newMonth = months && months.length > 0 ? months[0].month : "";

    setSelectedYear(newYear);
    setSelectedMonth(newMonth);

    if (typeof window !== "undefined") {
      localStorage.setItem('archive-selected-year', String(newYear));
      localStorage.setItem('archive-selected-month', String(newMonth));
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);

    if (typeof window !== "undefined") {
      localStorage.setItem('archive-selected-month', String(newMonth));
    }
  };

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

  // 選択された年月のプレイリストを取得
  useEffect(() => {
    if (!isInitialized || !selectedYear || !selectedMonth || Object.keys(availableMonthsMap).length === 0) return;
    
    setLoading(true);
    
    // 選択された月に対応するyearMonth（visual）を取得
    const monthsForYear = availableMonthsMap[selectedYear] ?? [];
    const selectedMonthData = monthsForYear.find(m => m.month === selectedMonth);
    const yearMonthToSearch = selectedMonthData?.yearMonth;
    
    if (!yearMonthToSearch) {
      setVideoList([]);
      setCurrentYearMonth(`${selectedYear}.${selectedMonth === "voca_winter" ? "voca_winter" : selectedMonth.padStart(2, '0')}`);
      setLoading(false);
      return;
    }
    
    // allPlaylistsから該当するプレイリストを検索
    const playlist = allPlaylists.find(p => p.yearMonth === yearMonthToSearch);
    
    if (playlist) {
      setVideoList(playlist.videos);
      setCurrentYearMonth(playlist.yearMonth);
    } else {
      setVideoList([]);
      setCurrentYearMonth(yearMonthToSearch);
    }
    
    setLoading(false);
  }, [selectedYear, selectedMonth, isInitialized, availableMonthsMap, allPlaylists]);

  const availableMonths = selectedYear ? availableMonthsMap[selectedYear]?.map(m => m.month) ?? [] : [];

  return (
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
            {availableMonths.map((value: string) => {
              // 月の表示テキストを決定
              const displayText = (() => {
                const monthStr = String(value);
                if (monthStr === "voca_winter") {
                  return "ボカコレ冬";
                }
                const monthNum = parseInt(monthStr, 10);
                if (isNaN(monthNum)) {
                  return monthStr; // パースできない場合はそのまま表示
                }
                return `${monthNum}月`;
              })();
              
              return (
                <button
                  key={value}
                  className={`btn btn-sm min-w-[56px] font-english ${
                    selectedMonth === value ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => handleMonthChange(value)}
                >
                  {displayText}
                </button>
              );
            })}
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
          yearMonth={currentYearMonth}
        />
      )}
    </>
  );
}

