export interface IArticle {
  // 基本情報
  title: string;
  link: string;
  description?: string;
  content?: string;
  imageUrl?: string;

  // 出典情報
  sourceName: string;
  sourceUrl: string;
  sourceType: 'official' | 'media' | 'community';
  sourceTier: 1 | 2 | 3;

  // 時間情報
  publishedAt: Date;
  fetchedAt: Date;
  updatedAt?: Date;

  // 分類情報
  classification: {
    language?: string;
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

  // Mongoose timestamps
  createdAt?: Date;
}
