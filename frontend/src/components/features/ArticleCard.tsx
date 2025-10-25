/**
 * 記事カードコンポーネント
 * 記事の概要を表示するカードUI
 */
import { Article } from '@/types/article';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

/**
 * カテゴリーの表示名を取得
 */
const getCategoryLabel = (category?: string): string => {
  const labels: Record<string, string> = {
    web: 'Web開発',
    system: 'システム/インフラ',
    data: 'データ/AI',
    design: 'デザイン',
    saas: 'SaaS',
  };
  return category ? labels[category] || category : '未分類';
};

/**
 * カテゴリーの色を取得
 */
const getCategoryColor = (category?: string): string => {
  const colors: Record<string, string> = {
    web: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    system: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    data: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    design: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    saas: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };
  return category ? colors[category] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
};

/**
 * 日付を相対時間で表示（例: "2時間前"）
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return '1時間以内';
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  return `${Math.floor(diffDays / 30)}ヶ月前`;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article._id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* サムネイル画像（あれば） */}
      {article.imageUrl && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* カード本体 */}
      <div className="p-4">
        {/* カテゴリーバッジ */}
        <div className="flex gap-2 mb-2">
          {article.classification.category && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${getCategoryColor(
                article.classification.category
              )}`}
            >
              {getCategoryLabel(article.classification.category)}
            </span>
          )}
          {article.classification.language && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {article.classification.language}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>

        {/* 説明 */}
        {article.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {article.description}
          </p>
        )}

        {/* メタ情報 */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">{article.sourceName}</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>

        {/* タグ */}
        {article.classification.tags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {article.classification.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
