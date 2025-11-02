import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from 'next/image';

// サムネイル画像表示専用（最適化版・レスポンシブ対応）
function NicovideoImage({ src, alt, width, height, className, onError, onLoad, loading, quality, sizes, priority, srcSet }: {
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
  priority?: boolean,
  srcSet?: string
}) {
  // レスポンシブなsizesを自動生成（指定されていない場合）
  const responsiveSizes = sizes || `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw`;
  
  // デバイス別の品質設定
  const responsiveQuality = quality || 75;
  
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
      quality={responsiveQuality}
      sizes={responsiveSizes}
      priority={priority || loading === "eager"}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      // 最適化画像の場合はsrcSetを適用
      {...(srcSet && { srcSet })}
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
  yearMonth?: string; // 年/月情報（例: "2025.09"）または年と月
  year?: number; // 年
  month?: number | string; // 月
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
    priority = false,
    yearMonth,
    year,
    month
  } = props;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // プラットフォームを判定
  const platform = useMemo(() => detectPlatform(videoId, videoUrl), [videoId, videoUrl]);

  // 年/月ディレクトリパスを生成
  const getThumbnailDir = useCallback(() => {
    let y: string | undefined;
    let m: string | undefined;
    
    if (yearMonth) {
      // yearMonth形式（例: "2025.09"）を年/月に分割
      const parts = yearMonth.split('.');
      if (parts.length >= 2) {
        y = parts[0];
        m = parts[1].padStart(2, '0');
      }
    } else if (year && month) {
      // yearとmonthが個別に指定されている場合
      y = String(year);
      m = typeof month === 'number' ? String(month).padStart(2, '0') : String(month).padStart(2, '0');
    }
    
    if (y && m) {
      return `${y}/${m}`;
    }
    return '';
  }, [yearMonth, year, month]);

  // サムネイル取得のメイン処理（最適化版）
  const fetchThumbnail = useCallback(() => {
    setError(false);
    setIsLoading(true);
    setThumbnailUrl(null);

    // 年/月ディレクトリパスを取得
    const dirPath = getThumbnailDir();
    const dirPrefix = dirPath ? `${dirPath}/` : '';
    
    // 最適化されたローカル画像を優先使用（高画質版）
    const optimizedThumbnail = `/thumbnails/${dirPrefix}${videoId}_lg.webp`;
    
    // ローカル最適化画像が存在するかチェック
    const checkLocalImage = async () => {
      try {
        const response = await fetch(optimizedThumbnail, { method: 'HEAD' });
        if (response.ok) {
          setThumbnailUrl(optimizedThumbnail);
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.log(`Local optimized image not found for ${videoId}`);
      }
      return false;
    };

    // ローカル画像をチェック
    checkLocalImage().then((found) => {
      if (found) return;

      // フォールバック: 元のCDN画像を使用
      if (ogpThumbnailUrl && ogpThumbnailUrl.trim() !== '') {
        setThumbnailUrl(ogpThumbnailUrl);
        setIsLoading(false);
        return;
      }

      if (platform === 'youtube' && thumbnail) {
        setThumbnailUrl(thumbnail);
        setIsLoading(false);
        return;
      }

      if (thumbnail) {
        setThumbnailUrl(thumbnail);
        setIsLoading(false);
        return;
      }

      // ニコニコ動画の場合
      if (platform === 'nicovideo') {
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
    });
  }, [videoId, platform, thumbnail, ogpThumbnailUrl, getThumbnailDir]);

  useEffect(() => {
    fetchThumbnail();
  }, [fetchThumbnail]);

  // 画像読み込みエラー時の処理（簡素化）
  const handleImageError = useCallback(() => {
    // エラー時は即座にプレースホルダー表示
    setError(true);
    onError?.({ type: 'error', videoId });
  }, [videoId, onError]);

  // ローディング状態（シンプルなプレースホルダー）
  if (isLoading && !priority) {
    return (
      <div 
        className={`flex items-center justify-center bg-[#EEEEEE] rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
      </div>
    );
  }

  // サムネイルを取得できた場合（最適化されたサムネイル）
  if (thumbnailUrl && !error) {
    // ローカル最適化画像の場合はsrcSetを設定
    const isOptimized = thumbnailUrl.includes('/thumbnails/') && thumbnailUrl.endsWith('.webp');
    
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
        sizes={sizes || "(max-width: 768px) 320px, 640px"}
        priority={priority}
        // 最適化画像の場合はsrcSetを追加
        {...(isOptimized && {
          srcSet: (() => {
            const dirPath = getThumbnailDir();
            const dirPrefix = dirPath ? `${dirPath}/` : '';
            return `
              /thumbnails/${dirPrefix}${videoId}_md.webp 320w,
              /thumbnails/${dirPrefix}${videoId}_lg.webp 640w
            `;
          })()
        })}
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