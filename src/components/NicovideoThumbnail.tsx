import { useState, useEffect, useMemo } from "react";
import Image from 'next/image';

type Props = {
  videoId: string;
  width?: number;
  height?: number;
  className?: string;
  useApi?: boolean;
  useDirectUrl?: boolean;
  useServerApi?: boolean; // サーバーサイドAPIを使用するかどうか
  onLoad?: () => void;
};

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  platform?: string;
}

export default function NicovideoThumbnail(props: Props) {
  const { videoId, width = 312, height = 176, className = "", useApi = false, useDirectUrl = false, useServerApi = false } = props;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  // ニコニコ動画のサムネイルURLパターン
  const thumbnailUrls = useMemo(() => [
    `https://tn.smilevideo.jp/smile?i=${videoId}`,
    `https://tn.smilevideo.jp/smile?i=${videoId}.L`,
    `https://tn.smilevideo.jp/smile?i=${videoId}.M`,
    `https://tn.smilevideo.jp/smile?i=${videoId}.S`,
    `https://ext.nicovideo.jp/thumb/${videoId}`,
    `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/${videoId}.L`,
    `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/${videoId}.M`,
    `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/${videoId}.S`,
  ], [videoId]);

  useEffect(() => {
    if (!useApi && !useDirectUrl && !useServerApi) {
      setIsLoading(false);
      return;
    }

    if (useServerApi) {
      // サーバーサイドAPIを使用
      const fetchPreviewData = async () => {
        try {
          setIsLoading(true);
          setError(false);
          
          const videoUrl = `https://www.nicovideo.jp/watch/${videoId}`;
          const response = await fetch(`/api/preview?url=${encodeURIComponent(videoUrl)}`);
          
          if (response.ok) {
            const data = await response.json();
            setPreviewData(data);
            if (data.image) {
              setThumbnailUrl(data.image);
            }
          } else {
            throw new Error('Failed to fetch preview data');
          }
        } catch (err) {
          console.warn('Server API failed, using fallback:', err);
          setError(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPreviewData();
      return;
    }

    if (useDirectUrl) {
      setThumbnailUrl(thumbnailUrls[0]);
      setIsLoading(false);
      return;
    }

    const fetchThumbnail = async () => {
      try {
        setIsLoading(true);
        setError(false);
        
        const response = await fetch(`https://api.nicovideo.jp/v1/video/${videoId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; YukueBot/1.0)'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setThumbnailUrl(data.data.thumbnail?.url || null);
        } else {
          throw new Error('Failed to fetch thumbnail');
        }
      } catch (err) {
        console.warn('Failed to fetch thumbnail from API, using fallback:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumbnail();
  }, [videoId, useApi, useDirectUrl, useServerApi]);

  // 画像読み込みエラー時の処理
  const handleImageError = () => {
    if (useDirectUrl && currentUrlIndex < thumbnailUrls.length - 1) {
      // 次のURLを試す
      const nextIndex = currentUrlIndex + 1;
      setCurrentUrlIndex(nextIndex);
      setThumbnailUrl(thumbnailUrls[nextIndex]);
    } else {
      setError(true);
    }
  };

  // ローディング状態
  if (isLoading) {
    return (
      <div 
        className={`bg-base-300 animate-pulse rounded-lg ${className}`}
        style={{ width, height }}
      />
    );
  }

  // サーバーAPIでサムネイルを取得できた場合
  if (useServerApi && previewData?.image && !error) {
    return (
      <Image
        src={previewData.image}
        alt={previewData.title || `${videoId} のサムネイル`}
        width={width}
        height={height}
        className={`rounded-lg object-cover ${className}`}
        onError={() => {
          setError(true);
          props.onLoad?.();
        }}
        onLoad={props.onLoad}
        unoptimized
      />
    );
  }

  // 直接URLまたはAPIでサムネイルを取得できた場合
  if ((useDirectUrl || useApi) && thumbnailUrl && !error) {
    return (
      <Image
        src={thumbnailUrl}
        alt={`${videoId} のサムネイル`}
        width={width}
        height={height}
        className={`rounded-lg object-cover ${className}`}
        onError={() => {
          handleImageError();
          props.onLoad?.();
        }}
        onLoad={props.onLoad}
        unoptimized
      />
    );
  }

  // デフォルト: iframeを使用したサムネイル表示（最も確実）
  return (
    <iframe 
      width={width} 
      height={height} 
      src={`https://ext.nicovideo.jp/thumb/${videoId}`} 
      scrolling="no" 
      style={{ border: 'none' }} 
      frameBorder="0"
      className={`rounded-lg ${className}`}
      title={`${videoId} のサムネイル`}
    >
      <a href={`https://www.nicovideo.jp/watch/${videoId}`}>
        ニコニコ動画: {videoId}
      </a>
    </iframe>
  );
} 