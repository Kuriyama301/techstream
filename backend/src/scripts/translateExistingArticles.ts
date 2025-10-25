/**
 * 既存記事の一括翻訳スクリプト
 * 実行: npm run translate:articles
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../models/Article';
import { translator } from '../services/translation/DeepLTranslator';

// 環境変数を読み込み
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/techstream';

async function translateExistingArticles() {
  try {
    // MongoDB接続
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // translatedDescriptionがnullまたは未設定の記事を取得
    const articles = await Article.find({
      $or: [
        { translatedDescription: { $exists: false } },
        { translatedDescription: null },
        { translatedDescription: '' },
      ],
    });

    console.log(`📊 Found ${articles.length} articles to translate`);

    if (articles.length === 0) {
      console.log('✅ All articles already translated!');
      process.exit(0);
    }

    // 翻訳前にDeepLの使用状況を確認
    await translator.getUsage();

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // 各記事を翻訳
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      console.log(`[${i + 1}/${articles.length}] Translating: ${article.title.substring(0, 50)}...`);

      // descriptionがない場合はスキップ
      if (!article.description || article.description.trim().length < 5) {
        console.log('  ⏭️  Skipped (no description)');
        skipCount++;
        continue;
      }

      try {
        // 翻訳実行
        const translatedDescription = await translator.translateToJapanese(article.description);

        // 翻訳結果を保存
        article.translatedDescription = translatedDescription;
        await article.save();

        console.log('  ✅ Translated');
        successCount++;

        // API制限を考慮して少し待機（Free APIは1秒あたり10リクエストまで）
        await new Promise(resolve => setTimeout(resolve, 150));
      } catch (error) {
        console.error(`  ❌ Error:`, error);
        errorCount++;
      }
    }

    // 最終結果
    console.log('\n📊 Translation Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  ❌ Error: ${errorCount}`);
    console.log(`  📝 Total: ${articles.length}`);

    // 翻訳後のDeepL使用状況を確認
    console.log('');
    await translator.getUsage();

    process.exit(0);
  } catch (error) {
    console.error('❌ Translation script failed:', error);
    process.exit(1);
  }
}

// スクリプト実行
translateExistingArticles();
