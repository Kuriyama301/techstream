import { connectDatabase, disconnectDatabase } from '../config/database';
import { Source } from '../models';

/**
 * 初期ソースデータを登録するスクリプト
 * 実行: npx ts-node src/scripts/seedSources.ts
 */

const initialSources = [
  // Python関連
  {
    name: 'Python Insider',
    url: 'https://blog.python.org',
    feedUrl: 'https://feeds.feedburner.com/PythonInsider',
    description: 'Python公式ブログ',
    type: 'official' as const,
    tier: 1,
    category: 'python',
    refreshInterval: 3600000, // 1時間
    isActive: true,
    metadata: {
      language: 'python',
      tags: ['official', 'news'],
    },
  },
  {
    name: 'Real Python',
    url: 'https://realpython.com',
    feedUrl: 'https://realpython.com/atom.xml',
    description: 'Pythonチュートリアルとニュース',
    type: 'media' as const,
    tier: 2,
    category: 'python',
    refreshInterval: 7200000, // 2時間
    isActive: true,
    metadata: {
      language: 'python',
      tags: ['tutorial', 'guide'],
    },
  },

  // JavaScript関連
  {
    name: 'JavaScript Weekly',
    url: 'https://javascriptweekly.com',
    feedUrl: 'https://javascriptweekly.com/rss',
    description: 'JavaScriptウィークリーニュース',
    type: 'media' as const,
    tier: 2,
    category: 'javascript',
    refreshInterval: 7200000,
    isActive: true,
    metadata: {
      language: 'javascript',
      tags: ['weekly', 'news'],
    },
  },
  {
    name: 'Node.js Blog',
    url: 'https://nodejs.org/en/blog',
    feedUrl: 'https://nodejs.org/en/feed/blog.xml',
    description: 'Node.js公式ブログ',
    type: 'official' as const,
    tier: 1,
    category: 'javascript',
    refreshInterval: 3600000,
    isActive: true,
    metadata: {
      language: 'javascript',
      tags: ['official', 'nodejs'],
    },
  },

  // Go関連
  {
    name: 'The Go Blog',
    url: 'https://go.dev/blog',
    feedUrl: 'https://go.dev/blog/feed.atom',
    description: 'Go公式ブログ',
    type: 'official' as const,
    tier: 1,
    category: 'go',
    refreshInterval: 3600000,
    isActive: true,
    metadata: {
      language: 'go',
      tags: ['official', 'golang'],
    },
  },

  // Rust関連
  {
    name: 'Rust Blog',
    url: 'https://blog.rust-lang.org',
    feedUrl: 'https://blog.rust-lang.org/feed.xml',
    description: 'Rust公式ブログ',
    type: 'official' as const,
    tier: 1,
    category: 'rust',
    refreshInterval: 3600000,
    isActive: true,
    metadata: {
      language: 'rust',
      tags: ['official', 'rust-lang'],
    },
  },

  // TypeScript関連
  {
    name: 'TypeScript Blog',
    url: 'https://devblogs.microsoft.com/typescript',
    feedUrl: 'https://devblogs.microsoft.com/typescript/feed/',
    description: 'TypeScript公式ブログ',
    type: 'official' as const,
    tier: 1,
    category: 'typescript',
    refreshInterval: 3600000,
    isActive: true,
    metadata: {
      language: 'typescript',
      tags: ['official', 'microsoft'],
    },
  },

  // 技術ニュース全般
  {
    name: 'Hacker News (Top)',
    url: 'https://news.ycombinator.com',
    feedUrl: 'https://hnrss.org/newest?points=100',
    description: 'Hacker News トップ記事',
    type: 'community' as const,
    tier: 2,
    category: 'general',
    refreshInterval: 1800000, // 30分
    isActive: true,
    metadata: {
      tags: ['hackernews', 'tech-news'],
    },
  },
  {
    name: 'DEV Community',
    url: 'https://dev.to',
    feedUrl: 'https://dev.to/feed',
    description: 'DEV Community 最新記事',
    type: 'community' as const,
    tier: 2,
    category: 'general',
    refreshInterval: 3600000,
    isActive: true,
    metadata: {
      tags: ['dev-to', 'community'],
    },
  },
];

async function seedSources() {
  try {
    console.log('📡 データベースに接続中...');
    await connectDatabase();

    console.log('🗑️  既存のソースデータをクリア...');
    await Source.deleteMany({});

    console.log('📥 初期ソースデータを登録中...');
    for (const sourceData of initialSources) {
      const source = await Source.create({
        ...sourceData,
        stats: {
          totalArticles: 0,
          failureCount: 0,
        },
      });
      console.log(`  ✅ ${source.name} (${source.metadata?.language || 'general'})`);
    }

    console.log(`\n✨ ${initialSources.length}件のソースを登録しました！`);
    console.log('\n📊 登録されたソース一覧:');
    console.log('─────────────────────────────────────────');

    const sources = await Source.find().sort({ tier: 1, category: 1 });
    sources.forEach((source) => {
      console.log(
        `  [Tier ${source.tier}] ${source.name.padEnd(25)} | ${source.metadata?.language || 'general'}`
      );
    });

    console.log('─────────────────────────────────────────');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

// スクリプト実行
if (require.main === module) {
  seedSources();
}

export { seedSources };
