import Parser from 'rss-parser';
import { Article, Source } from '../../models';

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

        // 新規記事を保存
        await Article.create({
          title: item.title || 'Untitled',
          link: item.link,
          description: item.contentSnippet || item.content || '',
          content: item.content || '',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          fetchedAt: new Date(),

          sourceName: source.name,
          sourceUrl: source.url,
          sourceType: source.type,
          sourceTier: source.tier,

          classification: {
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
   * URLから言語を検出（簡易版）
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
