import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from 'next/image';

// サムネイル画像表示専用
function NicovideoImage({ src, alt, width, height, className, onError, onLoad, loading, quality, sizes, priority }: {
  src: string,
  alt: string,
  width: number,
  height: number,
  className?: string,
  onError?: () => void,
  onLoad?: () => void,
  loading?: "lazy" | "eager",
  quality?: number,
  sizes?: string,
  priority?: boolean
}) {
      return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg object-cover object-center ${className ?? ''}`}
      onError={onError}
      onLoad={onLoad}
      loading={loading}
      quality={quality}
      sizes={sizes}
      priority={priority || loading === "eager"}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
}



type Props = {
  videoId: string;
  videoUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  loading?: "lazy" | "eager";
  onError?: (error: { type: 'private' | 'error', videoId: string }) => void;
  onPrivateVideo?: (videoId: string) => void;
  thumbnail?: string; // ローカルサムネイルパス
  ogpThumbnailUrl?: string | null; // OGPサムネイルURL
  quality?: number; // 画質設定（1-100）
  sizes?: string; // レスポンシブサイズ設定
  priority?: boolean; // 優先読み込みフラグ
};

// プラットフォームを判定する関数
function detectPlatform(videoId: string, videoUrl?: string): 'nicovideo' | 'youtube' | 'unknown' {
  if (videoUrl) {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      return 'youtube';
    }
    if (videoUrl.includes('nicovideo.jp')) {
      return 'nicovideo';
    }
  }
  
  if (/^(sm|so|nm)\d+$/.test(videoId)) {
    return 'nicovideo';
  }
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return 'youtube';
  }
  
  return 'unknown';
}

const NicovideoThumbnail = React.memo(function NicovideoThumbnail(props: Props) {
  const { 
    videoId, 
    videoUrl, 
    width = 312, 
    height = 176, 
    className = "", 
    onError, 
    thumbnail, 
    ogpThumbnailUrl,
    quality = 75,
    sizes,
    priority = false
  } = props;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // プラットフォームを判定
  const platform = useMemo(() => detectPlatform(videoId, videoUrl), [videoId, videoUrl]);

  // サムネイル取得のメイン処理
  const fetchThumbnail = useCallback(() => {
    setError(false);
    setIsLoading(true);
    setThumbnailUrl(null);

    // OGPサムネイルURLが利用可能な場合は最優先使用（空文字列は除く）
    if (ogpThumbnailUrl && ogpThumbnailUrl.trim() !== '') {
      setThumbnailUrl(ogpThumbnailUrl);
      setIsLoading(false);
      return;
    }

    // YouTube動画でogpThumbnailUrlがnullの場合は、ローカルサムネイルを優先使用
    if (platform === 'youtube' && thumbnail) {
      setThumbnailUrl(thumbnail);
      setIsLoading(false);
      return;
    }

    // その他のローカルサムネイルが利用可能な場合は次に優先使用
    if (thumbnail) {
      setThumbnailUrl(thumbnail);
      setIsLoading(false);
      return;
    }

    // ニコニコ動画の場合 - 複数のフォールバックURLを用意
    if (platform === 'nicovideo') {
      // 1. 高速なSmileVideoのサムネイルを優先
      const nicoThumbnailUrl = `https://tn.smilevideo.jp/smile?i=${videoId}`;
      setThumbnailUrl(nicoThumbnailUrl);
      setIsLoading(false);
      return;
    }

    // YouTubeの場合
    if (platform === 'youtube') {
      const youtubeUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      setThumbnailUrl(youtubeUrl);
      setIsLoading(false);
      return;
    }

    // その他の場合
    const defaultUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;
    setThumbnailUrl(defaultUrl);
    setIsLoading(false);
  }, [videoId, platform, thumbnail, ogpThumbnailUrl]);

  useEffect(() => {
    fetchThumbnail();
  }, [fetchThumbnail]);

  // 画像読み込みエラー時の処理（フォールバック戦略）
  const handleImageError = useCallback(() => {
    // ニコニコ動画の場合、複数のフォールバックURLを試行
    if (platform === 'nicovideo' && !error) {
      const fallbackUrls = [
        `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`,
        `https://tn.smilevideo.jp/smile?i=${videoId}`,
        `https://img.cdn.nimg.jp/s/nicovideo/thumbnails/${videoId}/${videoId}.39478694.1`
      ];
      
      const currentUrl = thumbnailUrl;
      const currentIndex = fallbackUrls.findIndex(url => url === currentUrl);
      
      if (currentIndex < fallbackUrls.length - 1) {
        // 次のフォールバックURLを試行
        setThumbnailUrl(fallbackUrls[currentIndex + 1]);
        return;
      }
    }
    
    // すべてのフォールバックが失敗した場合
    setError(true);
    onError?.({ type: 'error', videoId });
  }, [platform, videoId, thumbnailUrl, error, onError]);

  // ローディング状態（優先度の高い画像は短時間で表示）
  if (isLoading && !priority) {
    return (
      <div 
        className={`flex items-center justify-center bg-[#EEEEEE] rounded-lg ${className}`}
        style={{ width, height }}
      >
         <Image
           src="/Logo_Mark.svg"
           alt="ローディング中"
           width={Math.min(width, 64)}
           height={Math.min(height, 64)}
           className="yukue-spin"
         />
      </div>
    );
  }

  // サムネイルを取得できた場合（高解像度サムネイル）
  if (thumbnailUrl && !error) {
    return (
      <NicovideoImage
        src={thumbnailUrl}
        alt={`${videoId} のサムネイル`}
        width={width}
        height={height}
        className={className}
        onError={handleImageError}
        onLoad={props.onLoad}
        loading={props.loading}
        quality={quality}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  // エラー時はプレースホルダーを表示
  return (
    <div 
      className={`flex items-center justify-center bg-[#EEEEEE] rounded-lg ${className}`}
      style={{ width, height }}
    >
      <div className="text-center text-gray-500">
        <Image
          src="/Logo_Mark.svg"
          alt="サムネイル読み込みエラー"
          width={Math.min(width, 64)}
          height={Math.min(height, 64)}
          className="mx-auto mb-2 opacity-50"
        />
        <p className="text-xs">サムネイル読み込みエラー</p>
      </div>
    </div>
  );
});

export default NicovideoThumbnail;