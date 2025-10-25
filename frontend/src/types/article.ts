/**
 * 記事データの型定義
 * バックエンドの IArticle と対応
 */
export interface Article {
  _id: string; // MongoDBのID

  // 基本情報
  title: string;
  link: string;
  description?: string;
  translatedDescription?: string; // 日本語翻訳（DeepL）
  content?: string;
  imageUrl?: string;

  // 出典情報
  sourceName: string;
  sourceUrl: string;
  sourceType: 'official' | 'media' | 'community';
  sourceTier: 1 | 2 | 3;

  // 時間情報
  publishedAt: string; // ISO 8601形式の文字列
  fetchedAt: string;
  updatedAt?: string;

  // 分類情報
  classification: {
    category?: 'web' | 'system' | 'data' | 'design' | 'saas';
    language?: string; // 具体的な言語名（JavaScript, Python等）
    domain?: string;
    technicalLevel?: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
  };

  // スコアリング
  scores: {
    relevance: number;
    freshness: number;
    popularity: number;
    finalScore: number;
  };

  // メタデータ
  metadata: {
    wordCount?: number;
    readingTime?: number;
    hasCode: boolean;
    codeLanguages: string[];
  };

  // 統計情報
  stats: {
    views: number;
    clicks: number;
    bookmarks: number;
  };

  // タイムスタンプ
  createdAt?: string;
}
