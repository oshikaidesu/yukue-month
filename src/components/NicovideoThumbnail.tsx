import React, { useState, useEffect, useMemo } from "react";
import Image from 'next/image';

// サムネイル画像表示専用
function NicovideoImage({ src, alt, width, height, className, onError, onLoad, loading }: {
  src: string,
  alt: string,
  width: number,
  height: number,
  className?: string,
  onError?: () => void,
  onLoad?: () => void,
  loading?: "lazy" | "eager"
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg object-cover ${className ?? ''}`}
      onError={onError}
      onLoad={onLoad}
      loading={loading}
    />
  );
}

// iframeフォールバック用
function NicovideoIframeFallback({ videoId, width, height, className }: {
  videoId: string,
  width: number,
  height: number,
  className?: string
}) {
  return (
    <iframe 
      width={width} 
      height={height} 
      src={`https://ext.nicovideo.jp/thumb/${videoId}`} 
      scrolling="no" 
      style={{ border: 'none' }} 
      frameBorder="0"
      className={`rounded-lg ${className ?? ''}`}
      title={`${videoId} のサムネイル`}
    >
      <a href={`https://www.nicovideo.jp/watch/${videoId}`}>
        ニコニコ動画: {videoId}
      </a>
    </iframe>
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
  ogpThumbnailUrl?: string; // OGPサムネイルURL
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
  const { videoId, videoUrl, width = 312, height = 176, className = "", onError, thumbnail, ogpThumbnailUrl } = props;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // プラットフォームを判定
  const platform = useMemo(() => detectPlatform(videoId, videoUrl), [videoId, videoUrl]);

  // サムネイル取得のメイン処理
  const fetchThumbnail = () => {
    console.log(`[NicovideoThumbnail] Starting thumbnail fetch for ${videoId}, platform: ${platform}`);
    
    setError(false);
    setIsLoading(true);
    setThumbnailUrl(null);

    // OGPサムネイルURLが利用可能な場合は最優先使用
    if (ogpThumbnailUrl) {
      console.log(`[NicovideoThumbnail] Using OGP thumbnail for ${videoId}: ${ogpThumbnailUrl.substring(0, 50)}...`);
      setThumbnailUrl(ogpThumbnailUrl);
      setIsLoading(false);
      return;
    }

    // YouTube動画でogpThumbnailUrlがnullの場合は、ローカルサムネイルを優先使用
    if (platform === 'youtube' && thumbnail) {
      console.log(`[NicovideoThumbnail] Using local thumbnail for YouTube video ${videoId}: ${thumbnail}`);
      setThumbnailUrl(thumbnail);
      setIsLoading(false);
      return;
    }

    // その他のローカルサムネイルが利用可能な場合は次に優先使用
    if (thumbnail) {
      console.log(`[NicovideoThumbnail] Using local thumbnail for ${videoId}: ${thumbnail}`);
      setThumbnailUrl(thumbnail);
      setIsLoading(false);
      return;
    }

    // ニコニコ動画の場合
    if (platform === 'nicovideo') {
      const nicoThumbnailUrl = `https://tn.smilevideo.jp/smile?i=${videoId}`;
      console.log(`[NicovideoThumbnail] Using nico thumbnail URL: ${nicoThumbnailUrl}`);
      setThumbnailUrl(nicoThumbnailUrl);
      setIsLoading(false);
      return;
    }

    // YouTubeの場合
    if (platform === 'youtube') {
      const youtubeUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      console.log(`[NicovideoThumbnail] Using YouTube thumbnail: ${youtubeUrl}`);
      setThumbnailUrl(youtubeUrl);
      setIsLoading(false);
      return;
    }

    // その他の場合
    const defaultUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;
    console.log(`[NicovideoThumbnail] Using default thumbnail: ${defaultUrl}`);
    setThumbnailUrl(defaultUrl);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchThumbnail();
  }, [videoId, platform, thumbnail, ogpThumbnailUrl]);

  // 画像読み込みエラー時の処理
  const handleImageError = () => {
    console.log(`[NicovideoThumbnail] Image load error for ${videoId}: ${thumbnailUrl}`);
    setError(true);
    onError?.({ type: 'error', videoId });
  };

  // ローディング状態
  if (isLoading) {
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
      />
    );
  }

  // それでもダメならiframeで表示
  return (
    <NicovideoIframeFallback
      videoId={videoId}
      width={width}
      height={height}
      className={className}
    />
  );
});

export default NicovideoThumbnail; 