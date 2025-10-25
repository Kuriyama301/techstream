import Parser from 'rss-parser';
import { Article, Source } from '../../models';
import { translator } from '../translation/DeepLTranslator';

export class RSSCollector {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  /**
   * 指定されたSourceからRSSフィードを取得して記事を保存
   */
  async fetchFromSource(sourceId: string): Promise<void> {
    // 1. Sourceモデルからフィード情報を取得
    const source = await Source.findById(sourceId);
    if (!source || !source.isActive) {
      return;
    }

    try {
      // 2. RSSフィードを取得・パース
      const feed = await this.parser.parseURL(source.feedUrl);

      // 3. 各記事をArticleモデルに保存
      for (const item of feed.items) {
        if (!item.link) continue;

        // 重複チェック（linkで判定）
        const exists = await Article.findOne({ link: item.link });
        if (exists) continue;

        // descriptionを取得
        const description = item.contentSnippet || item.content || '';

        // 英語→日本語に翻訳
        const translatedDescription = await translator.translateToJapanese(description);

        // 新規記事を保存
        await Article.create({
          title: item.title || 'Untitled',
          link: item.link,
          description,
          translatedDescription,
          content: item.content || '',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          fetchedAt: new Date(),

          sourceName: source.name,
          sourceUrl: source.url,
          sourceType: source.type,
          sourceTier: source.tier,

          classification: {
            category: this.detectCategory(item.link),
            language: this.detectLanguage(item.link),
            tags: [],
          },

          scores: {
            relevance: 0,
            freshness: this.calculateFreshness(item.pubDate),
            popularity: 0,
            finalScore: this.calculateFreshness(item.pubDate),
          },

          metadata: {
            hasCode: false,
            codeLanguages: [],
          },

          stats: {
            views: 0,
            clicks: 0,
            bookmarks: 0,
          },
        });
      }

      // 4. Sourceの統計を更新（成功）
      source.stats.lastFetchedAt = new Date();
      source.stats.lastSuccessAt = new Date();
      source.stats.failureCount = 0;
      source.stats.totalArticles = await Article.countDocuments({ sourceName: source.name });
      await source.save();
    } catch (error) {
      console.error(`Failed to fetch RSS from ${source.feedUrl}:`, error);

      // エラー回数を記録
      source.stats.lastFetchedAt = new Date();
      source.stats.failureCount += 1;
      await source.save();
    }
  }

  /**
   * URLからカテゴリーを検出
   * Web開発 / システム/インフラ / データ/AI の3分類
   */
  private detectCategory(url: string): 'web' | 'system' | 'data' | undefined {
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

    // Web開発関連のキーワード（デフォルト）
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

    // デフォルトはundefined（後でカテゴライズ可能）
    return undefined;
  }

  /**
   * URLから言語を検出（簡易版）
   * 具体的な言語名を記録するために使用
   */
  private detectLanguage(url: string): string | undefined {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('python')) return 'python';
    if (lowerUrl.includes('javascript') || lowerUrl.includes('/js/')) return 'javascript';
    if (lowerUrl.includes('golang') || lowerUrl.includes('/go/') || lowerUrl.includes('go.dev'))
      return 'go';
    if (lowerUrl.includes('rust')) return 'rust';
    if (lowerUrl.includes('typescript')) return 'typescript';
    if (lowerUrl.includes('java') && !lowerUrl.includes('javascript')) return 'java';
    if (lowerUrl.includes('csharp') || lowerUrl.includes('dotnet')) return 'csharp';
    if (lowerUrl.includes('ruby')) return 'ruby';
    if (lowerUrl.includes('php')) return 'php';
    if (lowerUrl.includes('swift')) return 'swift';
    if (lowerUrl.includes('kotlin')) return 'kotlin';

    return undefined;
  }

  /**
   * 記事の新鮮さスコアを計算
   * 新しい記事ほど高いスコア
   */
  private calculateFreshness(pubDate?: string): number {
    if (!pubDate) return 0;

    const now = Date.now();
    const published = new Date(pubDate).getTime();
    const ageInHours = (now - published) / (1000 * 60 * 60);

    // 6時間以内: スコア10
    if (ageInHours < 6) return 10;

    // 24時間以内: スコア8
    if (ageInHours < 24) return 8;

    // 48時間以内: スコア6
    if (ageInHours < 48) return 6;

    // それ以降: 日数に応じて減衰（最低1）
    return Math.max(1, 10 - Math.floor(ageInHours / 24));
  }
}
