import { connectDatabase, disconnectDatabase } from '../config/database';
import { Source, Article } from '../models';
import { RSSCollector } from '../services/rss/RSSCollector';

/**
 * RSS収集の動作確認スクリプト
 * 実行: MONGODB_URI=mongodb://localhost:27017/techstream npm run test:rss
 */

async function testRSSCollection() {
  try {
    console.log('📡 データベースに接続中...');
    await connectDatabase();

    const collector = new RSSCollector();

    // アクティブなソースを取得
    const sources = await Source.find({ isActive: true }).limit(3);
    console.log(`\n📰 ${sources.length}件のソースからRSSを収集します...\n`);

    for (const source of sources) {
      console.log(`🔄 収集中: ${source.name} (${source.metadata?.language || 'general'})`);
      console.log(`   URL: ${source.feedUrl}`);

      const before = await Article.countDocuments({ sourceName: source.name });

      await collector.fetchFromSource(source._id.toString());

      const after = await Article.countDocuments({ sourceName: source.name });
      const newArticles = after - before;

      console.log(`   ✅ ${newArticles}件の新規記事を取得しました`);
      console.log(`   📊 合計: ${after}件\n`);
    }

    // 統計情報を表示
    console.log('─────────────────────────────────────────');
    console.log('📊 収集結果サマリー');
    console.log('─────────────────────────────────────────');

    const totalArticles = await Article.countDocuments();
    console.log(`総記事数: ${totalArticles}件`);

    // 言語別の記事数
    const languages = await Article.aggregate([
      {
        $match: { 'classification.language': { $exists: true, $ne: null } },
      },
      {
        $group: {
          _id: '$classification.language',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    if (languages.length > 0) {
      console.log('\n言語別記事数:');
      languages.forEach((lang: any) => {
        console.log(`  ${lang._id}: ${lang.count}件`);
      });
    }

    // 最新5件の記事を表示
    console.log('\n最新の記事 (5件):');
    const recentArticles = await Article.find()
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title sourceName publishedAt classification.language');

    recentArticles.forEach((article, index) => {
      const lang = article.classification.language || 'general';
      const date = article.publishedAt.toISOString().split('T')[0];
      console.log(`  ${index + 1}. [${lang}] ${article.title}`);
      console.log(`     ${article.sourceName} | ${date}`);
    });

    console.log('\n─────────────────────────────────────────');
    console.log('✨ RSS収集テスト完了！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

// スクリプト実行
if (require.main === module) {
  testRSSCollection();
}

export { testRSSCollection };
