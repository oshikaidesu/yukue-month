export type VideoItem = {
  id: string;
  title: string;
  url: string;
  artist: string;
  thumbnail?: string;
  ogpThumbnailUrl?: string | null;
};