"use client";

import { useState, useEffect } from "react";
import VideoCards from "@/components/VideoCards";
// import { getYearMonthFromPath } from "@/data/getYearMonthFromPath";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { VideoItem } from "@/types/video";

const yearOptions = [
  { label: "2024年", value: "2024" },
  { label: "2025年", value: "2025" },
  // 追加の年があればここに追加
];

// 存在する月のリスト（ファイル名から抽出）
const availableMonthsMap: { [key: string]: string[] } = {
  "2024": ["04", "05", "08", "09", "10", "11", "12"], // 必要に応じて2024年の月を追加
  "2025": ["01", "02", "03", "voca_winter", "04", "05", "06"]
};

type YearType = keyof typeof availableMonthsMap;
export default function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState<YearType>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonthsMap["2025"][0] ?? "");
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 年が変わったら、その年の最初の月に自動で切り替え
  useEffect(() => {
    const months = availableMonthsMap[selectedYear];
    setSelectedMonth(months && months.length > 0 ? months[0] : "");
  }, [selectedYear]);

  // クライアントマウント後にランダムで年度・月をセット
  useEffect(() => {
    if (typeof window !== "undefined") {
      const years = Object.keys(availableMonthsMap) as YearType[];
      const randomYear = years[Math.floor(Math.random() * years.length)];
      const months = availableMonthsMap[randomYear];
      const randomMonth = months[Math.floor(Math.random() * months.length)];
      setSelectedYear(randomYear);
      setSelectedMonth(randomMonth);
    }
  }, []);

  useEffect(() => {
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
  }, [selectedYear, selectedMonth]);

  const availableMonths = availableMonthsMap[selectedYear] ?? [];
  const dataPath = `src/data/${selectedYear}/videos_${selectedMonth}.json`;

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-30 pb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">アーカイブ</h1>
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="w-full flex justify-center">
            <div className="flex gap-10 py-2 px-2">
              {yearOptions.map((y: { label: string; value: YearType }) => (
                <button
                  key={y.value}
                  className={`btn btn-lg btn-neutral btn-outline rounded-full shadow-md transition-opacity duration-200 min-w-[100px] text-lg font-semibold tracking-wide ${selectedYear === y.value ? 'opacity-100 border-primary text-primary bg-[#EEEEEE]' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setSelectedYear(y.value)}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="flex overflow-x-auto gap-2 py-1 px-1 scrollbar-thin scrollbar-thumb-base-300">
              {availableMonths.map((value: string) => (
                <button
                  key={value}
                  className={`btn btn-sm min-w-[56px] ${
                    selectedMonth === value ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setSelectedMonth(value)}
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
          <VideoCards videoList={videoList} dataPath={dataPath} />
        )}
      </div>
      <Footer />
    </div>
  );
} 