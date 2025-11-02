/**
 * microCMS API スキーマ定義
 */

import { VideoItem } from './video';

/**
 * microCMS API レスポンスの基本構造
 */
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

/**
 * microCMS API レスポンス（単一コンテンツ）
 */
export interface MicroCMSContentResponse<T> {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  [key: string]: any;
}

/**
 * プレイリストエンドポイントのデータ構造
 */
export interface PlaylistContent {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  year: number;
  month: number | string; // 通常は数値、特別な場合は文字列（例: "voca_winter"）
  yearMonth: string; // 表示用の年月文字列（例: "2025.09"）
  videos: VideoItem[];
  isMain?: boolean; // メインページに表示するかどうか
}

/**
 * microCMSから取得したプレイリスト（コンテンツレスポンス形式）
 */
export type MicroCMSPlaylist = MicroCMSContentResponse<PlaylistContent>;

/**
 * microCMSから取得したプレイリストリスト（リストレスポンス形式）
 */
export type MicroCMSPlaylistList = MicroCMSListResponse<PlaylistContent>;

/**
 * プレイリスト取得用のクエリパラメータ
 */
export interface GetPlaylistQueries {
  /** 取得件数（デフォルト: 10, 最大: 100） */
  limit?: number;
  /** 取得開始位置 */
  offset?: number;
  /** フィルタ条件 */
  filters?: string;
  /** ソート順（-付きで降順） */
  orders?: string;
  /** 取得するフィールド（カンマ区切り） */
  fields?: string;
  /** 取得するフィールドから除外（カンマ区切り） */
  q?: string;
  /** 取得深度 */
  depth?: number;
}

/**
 * プレイリスト取得の結果型（アプリケーション層で使用）
 */
export interface Playlist {
  id: string;
  year: number;
  month: number | string;
  yearMonth: string;
  videos: VideoItem[];
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  isMain?: boolean; // メインページに表示するかどうか
}

