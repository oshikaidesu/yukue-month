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

  // 画像読み込み進捗を監視（無効化 - 自動進捗のみ使用）
  useEffect(() => {
    // 画像進捗イベントは無視して、自動進捗のみを使用
    console.log('LoadingPage: Using auto progress only, ignoring image events');
  }, []); // 依存関係を空に

  // サイト全体の読み込み完了を監視
  useEffect(() => {
    let isRunning = true;
    let currentProgress = 0;
    const startTime = Date.now();
    
    // サイト全体の読み込み完了を検出
    const checkSiteLoaded = () => {
      // DOMContentLoaded + 画像読み込み完了 + リソース読み込み完了
      if (document.readyState === 'complete') {
        return true;
      }
      
      // 追加のチェック: 重要な要素が表示されているか
      const heroElement = document.querySelector('.hero-container');
      const mainContent = document.querySelector('main');
      
      return heroElement && mainContent && document.readyState === 'interactive';
    };
    
    const smoothProgress = () => {
      if (!isRunning) return;
      
      const elapsed = Date.now() - startTime;
      
      // サイト読み込み完了をチェック
      if (checkSiteLoaded() && elapsed > 1000) { // 最低1秒は表示
        // サイト読み込み完了時は即座に100%に
        currentProgress = 100;
        setProgress(100);
        onProgressUpdateRef.current?.(100);
        setLoadingStage('完了！');
        
        setTimeout(() => {
          setIsComplete(true);
          onCompleteRef.current?.();
        }, 200);
        return;
      }
      
      // サイトがまだ読み込み中の場合は段階的に進捗
      let targetProgress;
      if (elapsed < 1000) {
        // 最初の1秒で30%まで
        targetProgress = (elapsed / 1000) * 30;
      } else if (elapsed < 3000) {
        // 1-3秒で30-80%まで
        targetProgress = 30 + ((elapsed - 1000) / 2000) * 50;
      } else {
        // 3秒以降は80-95%まで（完全読み込み待ち）
        targetProgress = 80 + Math.min(((elapsed - 3000) / 2000) * 15, 15);
      }
      
      if (currentProgress < targetProgress) {
        currentProgress = Math.min(currentProgress + 0.3, targetProgress);
        setProgress(Math.round(currentProgress));
        onProgressUpdateRef.current?.(Math.round(currentProgress));
        
        // 段階的なメッセージ更新
        if (currentProgress < 20) {
          setLoadingStage('初期化中...');
        } else if (currentProgress < 50) {
          setLoadingStage('コンテンツを読み込み中...');
        } else if (currentProgress < 80) {
          setLoadingStage('画像を読み込み中...');
        } else {
          setLoadingStage('最終調整中...');
        }
        
        animationRef.current = requestAnimationFrame(smoothProgress);
      } else {
        animationRef.current = requestAnimationFrame(smoothProgress);
      }
    };
    
    // 少し遅延して開始（DOMの準備を待つ）
    setTimeout(() => {
      smoothProgress();
    }, 100);
    
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
