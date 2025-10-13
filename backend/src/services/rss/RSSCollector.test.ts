import { RSSCollector } from './RSSCollector';
import { Article, Source } from '../../models';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../../config/database';

describe('RSSCollector', () => {
  let collector: RSSCollector;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://mongodb:27017/techstream_test';
    await connectDatabase();
  }, 30000);

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    collector = new RSSCollector();
  });

  describe('Constructor', () => {
    it('should create RSSCollector instance', () => {
      expect(collector).toBeDefined();
      expect(collector).toBeInstanceOf(RSSCollector);
    });
  });

  describe('detectLanguage', () => {
    it('should detect python from URL', () => {
      const language = (collector as any).detectLanguage('https://blog.python.org/test');
      expect(language).toBe('python');
    });

    it('should detect javascript from URL', () => {
      const language1 = (collector as any).detectLanguage('https://javascript.info/test');
      const language2 = (collector as any).detectLanguage('https://example.com/js/article');
      expect(language1).toBe('javascript');
      expect(language2).toBe('javascript');
    });

    it('should detect go from URL', () => {
      const language1 = (collector as any).detectLanguage('https://golang.org/blog');
      const language2 = (collector as any).detectLanguage('https://blog.go.dev/test');
      expect(language1).toBe('go');
      expect(language2).toBe('go');
    });

    it('should return undefined for unknown language', () => {
      const language = (collector as any).detectLanguage('https://example.com/unknown');
      expect(language).toBeUndefined();
    });
  });

  describe('calculateFreshness', () => {
    it('should return 10 for articles less than 6 hours old', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
      const freshness = (collector as any).calculateFreshness(recentDate.toISOString());
      expect(freshness).toBe(10);
    });

    it('should return 8 for articles less than 24 hours old', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago
      const freshness = (collector as any).calculateFreshness(recentDate.toISOString());
      expect(freshness).toBe(8);
    });

    it('should return 6 for articles less than 48 hours old', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 36 * 60 * 60 * 1000); // 36 hours ago
      const freshness = (collector as any).calculateFreshness(recentDate.toISOString());
      expect(freshness).toBe(6);
    });

    it('should return decreasing score for older articles', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      const freshness = (collector as any).calculateFreshness(oldDate.toISOString());
      expect(freshness).toBeGreaterThanOrEqual(1);
      expect(freshness).toBeLessThan(6);
    });

    it('should return 0 for missing date', () => {
      const freshness = (collector as any).calculateFreshness(undefined);
      expect(freshness).toBe(0);
    });
  });

  describe('fetchFromSource', () => {
    let testSource: any;

    beforeEach(async () => {
      // テスト用のSourceを作成
      testSource = await Source.create({
        name: 'Test RSS Feed',
        url: 'https://example.com',
        feedUrl: 'https://hnrss.org/newest?points=100', // 実際に存在するRSSフィード
        type: 'media',
        tier: 2,
        refreshInterval: 3600000,
        isActive: true,
        stats: {
          totalArticles: 0,
          failureCount: 0,
        },
      });
    });

    it(
      'should fetch and save articles from RSS feed',
      async () => {
        await collector.fetchFromSource(testSource._id.toString());

        // 記事が保存されているか確認
        const articles = await Article.find({ sourceName: 'Test RSS Feed' });
        expect(articles.length).toBeGreaterThan(0);

        // 記事の内容を確認
        const article = articles[0];
        expect(article.title).toBeDefined();
        expect(article.link).toBeDefined();
        expect(article.publishedAt).toBeDefined();
        expect(article.fetchedAt).toBeDefined();
      },
      15000
    ); // 15秒のタイムアウト

    it(
      'should update source statistics after successful fetch',
      async () => {
        await collector.fetchFromSource(testSource._id.toString());

        const updatedSource = await Source.findById(testSource._id);
        expect(updatedSource?.stats.lastFetchedAt).toBeDefined();
        expect(updatedSource?.stats.lastSuccessAt).toBeDefined();
        expect(updatedSource?.stats.failureCount).toBe(0);
      },
      15000
    );

    it(
      'should not create duplicate articles',
      async () => {
        // 1回目の取得
        await collector.fetchFromSource(testSource._id.toString());
        const firstCount = await Article.countDocuments({ sourceName: 'Test RSS Feed' });

        // 2回目の取得（重複）
        await collector.fetchFromSource(testSource._id.toString());
        const secondCount = await Article.countDocuments({ sourceName: 'Test RSS Feed' });

        // 記事数が変わっていないことを確認
        expect(secondCount).toBe(firstCount);
      },
      20000
    );

    it('should not fetch from inactive source', async () => {
      testSource.isActive = false;
      await testSource.save();

      await collector.fetchFromSource(testSource._id.toString());

      const articles = await Article.find({ sourceName: 'Test RSS Feed' });
      expect(articles.length).toBe(0);
    });

    it('should handle fetch errors gracefully', async () => {
      // 無効なフィードURLを設定
      testSource.feedUrl = 'https://invalid-url-that-does-not-exist.com/feed';
      await testSource.save();

      await collector.fetchFromSource(testSource._id.toString());

      // エラーが記録されているか確認
      const updatedSource = await Source.findById(testSource._id);
      expect(updatedSource?.stats.failureCount).toBe(1);
      expect(updatedSource?.stats.lastFetchedAt).toBeDefined();
    });
  });
});
