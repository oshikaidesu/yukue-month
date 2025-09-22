'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LoadingPageProps {
  onComplete?: () => void;
  onProgressUpdate?: (progress: number) => void;
  minDuration?: number; // 最小表示時間（ミリ秒）
}

export default function LoadingPage({ onComplete, onProgressUpdate, minDuration = 2000 }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number>();
  const onCompleteRef = useRef(onComplete);
  const onProgressUpdateRef = useRef(onProgressUpdate);

  // コールバック関数をrefに保存
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onProgressUpdateRef.current = onProgressUpdate;
  });

  // デバッグ用: 初期状態をログ出力
  useEffect(() => {
    console.log('LoadingPage: Component mounted, minDuration:', minDuration);
  }, [minDuration]);

  // 全画像読み込み完了を監視
  useEffect(() => {
    const handleAllImagesLoaded = () => {
      console.log('LoadingPage: All images loaded, completing loading');
      setProgress(100);
      onProgressUpdateRef.current?.(100);
      
      setTimeout(() => {
        setIsComplete(true);
        onCompleteRef.current?.();
      }, 200);
    };

    window.addEventListener('allImagesLoaded', handleAllImagesLoaded);
    
    return () => {
      window.removeEventListener('allImagesLoaded', handleAllImagesLoaded);
    };
  }, []); // 依存関係を空に

  // プログレスアニメーション
  useEffect(() => {
    const startTime = Date.now();
    let isRunning = true;
    let lastLoggedProgress = 0;
    
    const updateProgress = () => {
      if (!isRunning) return; // 停止フラグの場合は停止
      
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 80, 80); // 最大80%まで
      
      setProgress(newProgress);
      onProgressUpdateRef.current?.(newProgress);
      
      // デバッグ用: プログレス更新をログ出力
      if (Math.floor(newProgress) % 10 === 0 && Math.floor(newProgress) !== lastLoggedProgress) {
        console.log('LoadingPage: Progress updated to', Math.floor(newProgress) + '%');
        lastLoggedProgress = Math.floor(newProgress);
      }
      
      if (newProgress < 80 && isRunning) {
        animationRef.current = requestAnimationFrame(updateProgress);
      } else if (newProgress >= 80 && isRunning) {
        // 80%に達したら、画像読み込み完了を待つ
        console.log('LoadingPage: Progress reached 80%, waiting for images...');
      }
    };
    
    // 即座に開始
    updateProgress();
    
    return () => {
      isRunning = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [minDuration]); // 依存関係を最小限に

  // isCompleteがtrueになったらアニメーションを停止
  useEffect(() => {
    if (isComplete && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isComplete]);

  // フォールバック: 5秒後に強制完了
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isComplete) {
        console.log('LoadingPage: Fallback timer triggered');
        setProgress(100);
        onProgressUpdateRef.current?.(100);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, []); // 依存関係を空に

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
