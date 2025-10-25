/**
 * 記事データ取得API クライアント
 */
import { Article } from '@/types/article';
import { ApiResponse, Pagination, PaginatedResponse } from '@/types/api';

// バックエンドのベースURL
// Docker環境ではサービス名、ブラウザからはlocalhost
const API_BASE_URL =
  typeof window === 'undefined'
    ? 'http://backend:4000' // サーバーサイド（Next.js内）
    : 'http://localhost:4000'; // クライアントサイド（ブラウザ）

/**
 * 記事一覧取得のパラメータ
 */
export interface FetchArticlesParams {
  category?: 'web' | 'system' | 'data' | 'design' | 'saas';
  language?: string;
  domain?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * 記事一覧を取得
 *
 * @param params - 検索パラメータ
 * @returns 記事一覧とページネーション情報
 */
export async function fetchArticles(
  params: FetchArticlesParams = {}
): Promise<PaginatedResponse<Article>> {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.append('category', params.category);
  if (params.language) queryParams.append('language', params.language);
  if (params.domain) queryParams.append('domain', params.domain);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sort) queryParams.append('sort', params.sort);

  const url = `${API_BASE_URL}/api/articles?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store', // 常に最新データを取得
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data: ApiResponse<{ articles: Article[]; pagination: Pagination }> =
      await response.json();

    return {
      items: data.data.articles,
      pagination: data.data.pagination,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

/**
 * 記事詳細を取得
 *
 * @param id - 記事ID
 * @returns 記事データ
 */
export async function fetchArticleById(id: string): Promise<Article> {
  const url = `${API_BASE_URL}/api/articles/${id}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Article not found');
      }
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const data: ApiResponse<{ article: Article }> = await response.json();
    return data.data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}
