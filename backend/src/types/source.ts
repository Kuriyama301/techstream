export interface ISource {
  // 基本情報
  name: string;
  url: string;
  feedUrl: string; // RSS/AtomフィードのURL
  description?: string;

  // 分類情報
  type: 'official' | 'media' | 'community';
  tier: 1 | 2 | 3; // 1=最重要, 2=重要, 3=補助
  category?: string; // 言語やドメイン

  // 収集設定
  refreshInterval: number; // 収集間隔（ミリ秒）
  isActive: boolean; // 有効/無効

  // 統計情報
  stats: {
    totalArticles: number; // 収集した記事数
    lastFetchedAt?: Date; // 最後に取得した日時
    lastSuccessAt?: Date; // 最後に成功した日時
    failureCount: number; // 連続失敗回数
  };

  // メタデータ
  metadata?: {
    language?: string;
    tags?: string[];
  };

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
