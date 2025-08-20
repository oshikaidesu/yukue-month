declare module "*.json" {
  const value: {
    id: string;
    title: string;
    url: string;
    artist: string;
    thumbnail?: string;
    ogpThumbnailUrl?: string | null;
  }[];
  export default value;
}