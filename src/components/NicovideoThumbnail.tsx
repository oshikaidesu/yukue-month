import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  useOgpApi?: boolean; // OGP APIを使用するかどうか
  onLoad?: () => void;
  loading?: "lazy" | "eager";
  onError?: (error: { type: 'private' | 'error', videoId: string }) => void;
  onPrivateVideo?: (videoId: string) => void;
  thumbnail?: string; // ローカルサムネイルパス
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
  const { videoId, videoUrl, width = 312, height = 176, className = "", onError, thumbnail, useOgpApi = false } = props;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPrivateVideo, setIsPrivateVideo] = useState(false);

  // プラットフォームを判定
  const platform = useMemo(() => detectPlatform(videoId, videoUrl), [videoId, videoUrl]);

  // OGP APIからサムネイルを取得する関数
  const fetchOgpThumbnail = useCallback(async (videoId: string): Promise<string | null> => {
    try {
      console.log(`[NicovideoThumbnail] Fetching OGP thumbnail for: ${videoId}`);
      
      const nicoUrl = `https://www.nicovideo.jp/watch/${videoId}`;
      const response = await fetch(`/api/ogp/nicovideo/?url=${encodeURIComponent(nicoUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as { 
        success: boolean; 
        data?: { 
          image: string;
          title: string;
          description: string;
          videoId: string;
        } 
      };
      
      if (data.success && data.data?.image) {
        console.log(`[NicovideoThumbnail] OGP thumbnail found: ${data.data.image}`);
        return data.data.image;
      }
      
      console.log(`[NicovideoThumbnail] No OGP thumbnail found for: ${videoId}`);
      return null;
    } catch (error) {
      console.error(`[NicovideoThumbnail] OGP API error for ${videoId}:`, error);
      return null;
    }
  }, []);

  // 従来のサムネイル取得APIからサムネイルを取得する関数
  const fetchLegacyThumbnail = useCallback(async (videoId: string): Promise<string | null> => {
    try {
      console.log(`[NicovideoThumbnail] Fetching legacy thumbnail for: ${videoId}`);
      
      const response = await fetch(`/api/thumbnail/nicovideo?id=${videoId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json() as { 
        success: boolean; 
        data?: { 
          thumbnailUrl: string;
          title: string;
          videoId: string;
        } 
      };
      
      if (data.success && data.data?.thumbnailUrl) {
        console.log(`[NicovideoThumbnail] Legacy thumbnail found: ${data.data.thumbnailUrl}`);
        return data.data.thumbnailUrl;
      }
      
      console.log(`[NicovideoThumbnail] No legacy thumbnail found for: ${videoId}`);
      return null;
    } catch (error) {
      console.error(`[NicovideoThumbnail] Legacy thumbnail API error for ${videoId}:`, error);
      return null;
    }
  }, []);

  // サムネイル取得のメイン処理
  const fetchThumbnail = useCallback(async () => {
    console.log(`[NicovideoThumbnail] Starting thumbnail fetch for ${videoId}, platform: ${platform}, useOgpApi: ${useOgpApi}`);
    
    setError(false);
    setIsLoading(true);
    setThumbnailUrl(null);
    setIsPrivateVideo(false);

    // ローカルサムネイルが利用可能な場合は優先使用
    if (thumbnail) {
      console.log(`[NicovideoThumbnail] Using local thumbnail for ${videoId}: ${thumbnail}`);
      setThumbnailUrl(thumbnail);
      setIsLoading(false);
      return;
    }

    // ニコニコ動画の場合
    if (platform === 'nicovideo') {
      let finalThumbnailUrl: string | null = null;

      // OGP APIが有効な場合は、OGP APIを試行
      if (useOgpApi) {
        finalThumbnailUrl = await fetchOgpThumbnail(videoId);
      }

      // OGP APIが失敗した場合または無効な場合は、従来のAPIを試行
      if (!finalThumbnailUrl) {
        finalThumbnailUrl = await fetchLegacyThumbnail(videoId);
      }

      // すべてのAPIが失敗した場合は、基本的なサムネイルURLを使用
      if (!finalThumbnailUrl) {
        finalThumbnailUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`;
        console.log(`[NicovideoThumbnail] Using basic thumbnail URL: ${finalThumbnailUrl}`);
      }

      setThumbnailUrl(finalThumbnailUrl);
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
  }, [videoId, platform, thumbnail, useOgpApi, fetchOgpThumbnail, fetchLegacyThumbnail]);

  useEffect(() => {
    fetchThumbnail();
  }, [fetchThumbnail]);

  // 画像読み込みエラー時の処理
  const handleImageError = () => {
    console.log(`[NicovideoThumbnail] Image load error for ${videoId}: ${thumbnailUrl}`);
    setError(true);
    onError?.({ type: 'error', videoId });
  };

  // 非公開動画の場合は何も表示しない
  if (isPrivateVideo) {
    return null;
  }

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