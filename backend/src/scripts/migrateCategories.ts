/**
 * 既存記事データにcategoryフィールドを追加する移行スクリプト
 */
import mongoose from 'mongoose';
import { Article } from '../models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/techstream';

/**
 * URLからカテゴリーを検出
 * RSSCollectorと同じロジック
 */
function detectCategory(url: string): 'web' | 'system' | 'data' | undefined {
  const lowerUrl = url.toLowerCase();

  // データ/AI関連のキーワード
  if (
    lowerUrl.includes('machine-learning') ||
    lowerUrl.includes('data-science') ||
    lowerUrl.includes('ai') ||
    lowerUrl.includes('ml') ||
    lowerUrl.includes('deep-learning') ||
    lowerUrl.includes('pandas') ||
    lowerUrl.includes('numpy') ||
    lowerUrl.includes('pytorch') ||
    lowerUrl.includes('tensorflow')
  ) {
    return 'data';
  }

  // システム/インフラ関連のキーワード
  if (
    lowerUrl.includes('rust') ||
    lowerUrl.includes('golang') ||
    lowerUrl.includes('go.dev') ||
    lowerUrl.includes('/go/') ||
    lowerUrl.includes('docker') ||
    lowerUrl.includes('kubernetes') ||
    lowerUrl.includes('devops') ||
    lowerUrl.includes('system') ||
    lowerUrl.includes('kernel') ||
    lowerUrl.includes('embedded')
  ) {
    return 'system';
  }

  // Web開発関連のキーワード
  if (
    lowerUrl.includes('javascript') ||
    lowerUrl.includes('/js/') ||
    lowerUrl.includes('typescript') ||
    lowerUrl.includes('react') ||
    lowerUrl.includes('vue') ||
    lowerUrl.includes('angular') ||
    lowerUrl.includes('next') ||
    lowerUrl.includes('node') ||
    lowerUrl.includes('web') ||
    lowerUrl.includes('frontend') ||
    lowerUrl.includes('backend')
  ) {
    return 'web';
  }

  return undefined;
}

async function migrateCategories() {
  try {
    // MongoDBに接続
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 全記事を取得
    const articles = await Article.find({});
    console.log(`Found ${articles.length} articles`);

    let updated = 0;
    let skipped = 0;

    for (const article of articles) {
      // すでにcategoryがある場合はスキップ
      if (article.classification.category) {
        skipped++;
        continue;
      }

      // URLまたはソース名からカテゴリーを検出
      let category = detectCategory(article.link);

      // URLで検出できなかった場合、ソース名やlanguageフィールドから推測
      if (!category) {
        const sourceName = article.sourceName.toLowerCase();
        const language = article.classification.language?.toLowerCase();

        // ソース名やlanguageからカテゴリーを推測
        if (
          sourceName.includes('python') ||
          language === 'python' ||
          sourceName.includes('data') ||
          sourceName.includes('ml') ||
          sourceName.includes('ai')
        ) {
          category = 'data';
        } else if (
          sourceName.includes('go') ||
          sourceName.includes('rust') ||
          language === 'go' ||
          language === 'rust' ||
          sourceName.includes('system') ||
          sourceName.includes('devops')
        ) {
          category = 'system';
        } else if (
          sourceName.includes('javascript') ||
          sourceName.includes('typescript') ||
          sourceName.includes('node') ||
          sourceName.includes('react') ||
          sourceName.includes('web') ||
          language === 'javascript' ||
          language === 'typescript'
        ) {
          category = 'web';
        }
      }

      if (category) {
        article.classification.category = category;
        await article.save();
        updated++;
        console.log(`✓ Updated: ${article.title} → ${category}`);
      } else {
        skipped++;
        console.log(`- Skipped: ${article.title} (category not detected)`);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total articles: ${articles.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);

    // 接続を閉じる
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// スクリプト実行
migrateCategories();
