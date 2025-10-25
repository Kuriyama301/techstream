/**
 * ヘッダーコンポーネント
 * アプリ全体で使用する共通ヘッダー（言語切り替え機能付き）
 */
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function Header() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            TechStream
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            エンジニア向けニュースアプリ
          </p>
        </div>

        {/* 言語切り替えトグル */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          aria-label="言語切り替え"
        >
          <span className="text-lg">🌐</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {language === 'ja' ? 'JP' : 'EN'}
          </span>
        </button>
      </div>
    </header>
  );
}
