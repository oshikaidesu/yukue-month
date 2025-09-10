'use client';

import React, { useState, useEffect } from 'react';

interface LoadingPageProps {
  onComplete?: () => void;
  duration?: number; // ローディング時間（ミリ秒）
}

export default function LoadingPage({ onComplete, duration = 3000 }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // ローディング完了
        setTimeout(() => {
          onComplete?.();
        }, 200); // 少し遅延させて完了感を演出
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center z-50">
      <div className="text-center">
        {/* ロゴ */}
        <div className="mb-8">
          <img
            src="/Logo_Mark.svg"
            alt="ゆくえレコーズ"
            className="w-20 h-20 mx-auto mb-4 yukue-spin"
          />
          <h1 className="text-2xl font-bold text-dark">ゆくえレコーズ</h1>
          <p className="text-sm text-gray-600 mt-2">Monthly Pickup Playlist</p>
        </div>
        
        {/* プログレスバー */}
        <div className="w-80 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* パーセンテージ表示 */}
          <div className="mt-3">
            <span className="text-lg font-mono text-dark">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        
        {/* ローディングメッセージ */}
        <div className="mt-6 text-sm text-gray-500">
          {progress < 30 && "プレイリストを読み込み中..."}
          {progress >= 30 && progress < 60 && "サムネイルを準備中..."}
          {progress >= 60 && progress < 90 && "アニメーションを設定中..."}
          {progress >= 90 && "ほぼ完了です..."}
        </div>
      </div>
    </div>
  );
}
