/**
 * 記事詳細ページ
 * SEO対策とOGP設定を含む
 */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchArticleById, fetchArticles } from '@/lib/api/articles';
import { Article } from '@/types/article';
import { ShareButtons } from '@/components/features/ShareButtons';
import { ArticleDescription } from '@/components/features/ArticleDescription';

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
 * 日付をフォーマット
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * メタデータの生成（SEO対策）
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const article = await fetchArticleById(id);

    return {
      title: `${article.title} | TechStream`,
      description: article.description || `${article.sourceName}の記事`,
      openGraph: {
        title: article.title,
        description: article.description || '',
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.sourceName],
        images: article.imageUrl ? [article.imageUrl] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.description || '',
        images: article.imageUrl ? [article.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: '記事が見つかりません | TechStream',
    };
  }
}

/**
 * 記事詳細ページコンポーネント
 */
export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  let article: Article;
  let relatedArticles: Article[] = [];

  try {
    const { id } = await params;
    article = await fetchArticleById(id);

    // 関連記事を取得（同じカテゴリー）
    if (article.classification.category) {
      const result = await fetchArticles({
        category: article.classification.category,
        limit: 4,
      });
      // 現在の記事を除外
      relatedArticles = result.items.filter((a) => a._id !== article._id).slice(0, 3);
    }
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            ← トップに戻る
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          {/* パンくずリスト */}
          <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:underline">
              トップ
            </Link>
            {article.classification.category && (
              <>
                <span className="mx-2">›</span>
                <span>{getCategoryLabel(article.classification.category)}</span>
              </>
            )}
          </nav>

          {/* カテゴリーバッジ */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.classification.category && (
              <span
                className={`text-sm font-semibold px-3 py-1 rounded ${getCategoryColor(
                  article.classification.category
                )}`}
              >
                {getCategoryLabel(article.classification.category)}
              </span>
            )}
            {article.classification.language && (
              <span className="text-sm font-semibold px-3 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {article.classification.language}
              </span>
            )}
          </div>

          {/* タイトル */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          {/* メタ情報 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {article.sourceName}
              </span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                Tier {article.sourceTier}
              </span>
            </div>
            <span>•</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.metadata.readingTime && (
              <>
                <span>•</span>
                <span>読了時間: 約{article.metadata.readingTime}分</span>
              </>
            )}
          </div>

          {/* 画像 */}
          {article.imageUrl && (
            <div className="mb-6">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* 記事の説明（言語切り替え対応） */}
          <ArticleDescription
            description={article.description}
            translatedDescription={article.translatedDescription}
          />

          {/* 元記事を読むボタン */}
          <div className="mb-8">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center transition-colors"
            >
              📖 元記事を読む（{new URL(article.sourceUrl).hostname}）
            </a>
          </div>

          {/* SNSシェアボタン */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <ShareButtons
              url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/articles/${article._id}`}
              title={article.title}
              description={article.description}
            />
          </div>

          {/* タグ */}
          {article.classification.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                タグ
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.classification.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              関連記事
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle._id}
                  href={`/articles/${relatedArticle._id}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {relatedArticle.sourceName} • {formatDate(relatedArticle.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
