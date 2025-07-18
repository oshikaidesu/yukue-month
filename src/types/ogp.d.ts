export interface OgpData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
  type?: string;
}

export interface OgpApiResponse {
  success: boolean;
  data?: OgpData;
  error?: string;
  details?: string;
} 