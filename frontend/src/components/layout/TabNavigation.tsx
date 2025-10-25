/**
 * タブナビゲーションコンポーネント
 * カテゴリー切り替え用のタブUI
 */
'use client';

interface Tab {
  id: string;
  label: string;
  slug: 'all' | 'web' | 'system' | 'data';
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabSlug: 'all' | 'web' | 'system' | 'data') => void;
}

const tabs: Tab[] = [
  { id: 'all', label: 'トップ', slug: 'all' },
  { id: 'web', label: 'Web開発', slug: 'web' },
  { id: 'system', label: 'システム/インフラ', slug: 'system' },
  { id: 'data', label: 'データ/AI', slug: 'data' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 px-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.slug)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
              ${
                activeTab === tab.slug
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
