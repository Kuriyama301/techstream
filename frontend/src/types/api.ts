/**
 * API レスポンスの型定義
 */

/**
 * ページネーション情報
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * API 成功レスポンスの基本構造
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * API エラーレスポンスの構造
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
