import { useState, useEffect, useMemo } from "react";
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
  width?: number;
  height?: number;
  className?: string;
  useApi?: boolean;
  useDirectUrl?: boolean;
  useServerApi?: boolean; // サーバーサイドAPIを使用するかどうか
  onLoad?: () => void;
  loading?: "lazy" | "eager"; // ← 追加
};

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  platform?: string;
}

type NicoApiResponse = {
  data?: {
    thumbnail?: {
      url?: string;
    };
  };
};

export default function NicovideoThumbnail(props: Props) {
  const { videoId, width = 312, height = 176, className = "", useApi = false, useDirectUrl = false, useServerApi = false } = props;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fallbackToDirect, setFallbackToDirect] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // ニコニコ動画のサムネイルURLパターン
  const directThumbnailUrl = useMemo(() => `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/320x180`, [videoId]);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    setIsLoading(true);
    setThumbnailUrl(null);
    setPreviewData(null);
    setFallbackToDirect(false);

    if (!useApi && !useDirectUrl && !useServerApi) {
      setIsLoading(false);
      return;
    }

    if (useServerApi && !fallbackToDirect) {
      // サーバーサイドAPIを使用
      const fetchPreviewData = async () => {
        try {
          const videoUrl = `https://www.nicovideo.jp/watch/${videoId}`;
          const response = await fetch(`/api/preview?url=${encodeURIComponent(videoUrl)}`);
          if (response.ok) {
            const data = await response.json();
            if (!cancelled) {
              setPreviewData(data as PreviewData);
              const preview = data as PreviewData;
              if (preview.image) {
                setThumbnailUrl(preview.image);
              } else {
                // サムネイルURLが取れなかった場合はフォールバック
                setFallbackToDirect(true);
              }
            }
          } else {
            throw new Error('Failed to fetch preview data');
          }
        } catch {
          if (!cancelled) {
            setFallbackToDirect(true);
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };
      fetchPreviewData();
      return () => { cancelled = true; };
    }

    if (useDirectUrl || fallbackToDirect) {
      // 直接URLで表示
      setThumbnailUrl(directThumbnailUrl);
      setIsLoading(false);
      return;
    }

    if (useApi) {
      const fetchThumbnail = async () => {
        try {
          const response = await fetch(`https://api.nicovideo.jp/v1/video/${videoId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)'
            }
          });
          if (response.ok) {
            const data: NicoApiResponse = await response.json();
            if (!cancelled) setThumbnailUrl(data.data?.thumbnail?.url || null);
          } else {
            throw new Error('Failed to fetch thumbnail');
          }
        } catch {
          if (!cancelled) setFallbackToDirect(true);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };
      fetchThumbnail();
      return () => { cancelled = true; };
    }
  }, [videoId, useApi, useDirectUrl, useServerApi, directThumbnailUrl, fallbackToDirect]);

  // 画像読み込みエラー時の処理
  const handleImageError = () => {
    if (!fallbackToDirect) {
      setFallbackToDirect(true);
    } else {
      setError(true);
    }
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

  // サーバーAPIでサムネイルを取得できた場合
  if (useServerApi && previewData?.image && !fallbackToDirect && !error) {
    return (
      <NicovideoImage
        src={previewData.image}
        alt={previewData.title || `${videoId} のサムネイル`}
        width={width}
        height={height}
        className={className}
        onError={() => {
          handleImageError();
          props.onLoad?.();
        }}
        onLoad={props.onLoad}
        loading={props.loading}
      />
    );
  }

  // 直接URLまたはAPIでサムネイルを取得できた場合
  if ((useDirectUrl || fallbackToDirect || useApi) && thumbnailUrl && !error) {
    return (
      <NicovideoImage
        src={thumbnailUrl}
        alt={`${videoId} のサムネイル`}
        width={width}
        height={height}
        className={className}
        onError={() => {
          handleImageError();
          props.onLoad?.();
        }}
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
} 