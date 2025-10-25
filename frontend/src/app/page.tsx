/**
 * トップページ
 * 記事一覧をカテゴリー別に表示
 */
'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { fetchArticles } from '@/lib/api/articles';
import { ArticleCard } from '@/components/features/ArticleCard';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { Header } from '@/components/layout/Header';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'system' | 'data'>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // タブ切り替え時に記事を取得
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = activeTab === 'all' ? {} : { category: activeTab };
        const result = await fetchArticles(params);
        setArticles(result.items);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError('記事の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー（言語切り替え機能付き） */}
      <Header />

      {/* タブナビゲーション */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ローディング状態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* エラー状態 */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* 記事がない場合 */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              記事がまだありません。
            </p>
          </div>
        )}

        {/* 記事一覧 */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
