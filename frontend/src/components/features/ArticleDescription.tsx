/**
 * 記事の説明表示コンポーネント
 * 言語設定に応じて翻訳版/原文を切り替え
 */
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleDescriptionProps {
  description?: string;
  translatedDescription?: string;
}

export function ArticleDescription({
  description,
  translatedDescription,
}: ArticleDescriptionProps) {
  const { language } = useLanguage();

  // 表示するテキストを決定
  const displayText =
    language === 'ja' && translatedDescription
      ? translatedDescription
      : description;

  if (!displayText) {
    return null;
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {displayText}
      </p>
      {language === 'ja' && translatedDescription && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          ※ AI翻訳（DeepL）による参考訳
        </p>
      )}
    </div>
  );
}
