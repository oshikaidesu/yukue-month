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
  const [loadingStage, setLoadingStage] = useState('初期化中...');
  const [loadedImages, setLoadedImages] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
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

  // 画像読み込み進捗を監視
  useEffect(() => {
    const handleImageProgress = (event: CustomEvent) => {
      const { loaded, total, stage, progress } = event.detail;
      console.log('LoadingPage: Image progress update:', { loaded, total, stage, progress });
      
      setLoadedImages(loaded);
      setTotalImages(total);
      setLoadingStage(stage);
      
      // 進捗計算: 画像読み込みが80%、その他の処理が20%
      const imageProgress = progress ? progress * 0.8 : (total > 0 ? (loaded / total) * 80 : 0);
      const baseProgress = 20; // 基本処理分
      const newProgress = Math.min(baseProgress + imageProgress, 100);
      
      setProgress(newProgress);
      onProgressUpdateRef.current?.(newProgress);
    };

    const handleAllImagesLoaded = () => {
      console.log('LoadingPage: All images loaded, completing loading');
      setLoadingStage('完了！');
      setProgress(100);
      onProgressUpdateRef.current?.(100);
      
      setTimeout(() => {
        setIsComplete(true);
        onCompleteRef.current?.();
      }, 200);
    };

    window.addEventListener('imageProgress', handleImageProgress as EventListener);
    window.addEventListener('allImagesLoaded', handleAllImagesLoaded);
    
    return () => {
      window.removeEventListener('imageProgress', handleImageProgress as EventListener);
      window.removeEventListener('allImagesLoaded', handleAllImagesLoaded);
    };
  }, []); // 依存関係を空に

  // 初期化プログレス（推定時間ベースの部分を最小限に）
  useEffect(() => {
    const startTime = Date.now();
    let isRunning = true;
    
    const updateInitialProgress = () => {
      if (!isRunning) return;
      
      const elapsed = Date.now() - startTime;
      const initialProgress = Math.min((elapsed / 500) * 20, 20); // 最初の20%のみ推定時間ベース
      
      if (initialProgress < 20) {
        setProgress(initialProgress);
        onProgressUpdateRef.current?.(initialProgress);
        animationRef.current = requestAnimationFrame(updateInitialProgress);
      } else {
        // 初期化完了
        setLoadingStage('画像を読み込み中...');
        console.log('LoadingPage: Initial progress completed, waiting for image progress...');
      }
    };
    
    // 即座に開始
    updateInitialProgress();
    
    return () => {
      isRunning = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // 依存関係を空に

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
          <div className="mb-2">{loadingStage}</div>
          {totalImages > 0 && (
            <div className="text-xs text-gray-400">
              {Math.round((loadedImages / totalImages) * 100)}% 完了
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
