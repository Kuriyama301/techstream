export interface ICategory {
  // 基本情報
  name: string; // 表示名（例: "Python", "JavaScript"）
  slug: string; // URL用（例: "python", "javascript"）
  type: 'language' | 'domain'; // カテゴリタイプ
  description?: string;

  // 表示設定
  displayOrder: number; // 表示順序
  icon?: string; // アイコンURL
  color?: string; // テーマカラー（HEX）

  // メタデータ
  metadata?: {
    tags?: string[];
    relatedCategories?: string[]; // 関連カテゴリのslug
  };

  // 統計情報
  stats?: {
    articleCount: number; // 記事数
    lastUpdatedAt?: Date;
  };

  // 有効/無効
  isActive: boolean;

  // Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
