import { Article } from './Article';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../config/database';

describe('Article Model', () => {
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
  });

  describe('Article creation', () => {
    it('should create a valid article with required fields', async () => {
      const articleData = {
        title: 'Test Article',
        link: 'https://example.com/test',
        sourceName: 'Test Source',
        sourceUrl: 'https://example.com',
        sourceType: 'official' as const,
        sourceTier: 1,
        publishedAt: new Date(),
        fetchedAt: new Date(),
        classification: {
          tags: [],
        },
        scores: {
          relevance: 0,
          freshness: 0,
          popularity: 0,
          finalScore: 0,
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
      };

      const article = new Article(articleData);
      const savedArticle = await article.save();

      expect(savedArticle._id).toBeDefined();
      expect(savedArticle.title).toBe('Test Article');
      expect(savedArticle.link).toBe('https://example.com/test');
      expect(savedArticle.sourceName).toBe('Test Source');
      expect(savedArticle.createdAt).toBeDefined();
    });

    it('should fail when required fields are missing', async () => {
      const invalidArticle = new Article({});

      await expect(invalidArticle.save()).rejects.toThrow();
    });

    it('should enforce unique link constraint', async () => {
      const articleData = {
        title: 'Test Article',
        link: 'https://example.com/duplicate',
        sourceName: 'Test Source',
        sourceUrl: 'https://example.com',
        sourceType: 'official' as const,
        sourceTier: 1,
        publishedAt: new Date(),
        fetchedAt: new Date(),
        classification: { tags: [] },
        scores: { relevance: 0, freshness: 0, popularity: 0, finalScore: 0 },
        metadata: { hasCode: false, codeLanguages: [] },
        stats: { views: 0, clicks: 0, bookmarks: 0 },
      };

      await new Article(articleData).save();

      const duplicateArticle = new Article(articleData);
      await expect(duplicateArticle.save()).rejects.toThrow();
    });
  });

  describe('Article validation', () => {
    it('should validate sourceType enum', async () => {
      const invalidArticle = new Article({
        title: 'Test',
        link: 'https://example.com/test',
        sourceName: 'Test',
        sourceUrl: 'https://example.com',
        sourceType: 'invalid' as any,
        sourceTier: 1,
        publishedAt: new Date(),
        fetchedAt: new Date(),
        classification: { tags: [] },
        scores: { relevance: 0, freshness: 0, popularity: 0, finalScore: 0 },
        metadata: { hasCode: false, codeLanguages: [] },
        stats: { views: 0, clicks: 0, bookmarks: 0 },
      });

      await expect(invalidArticle.save()).rejects.toThrow();
    });

    it('should validate sourceTier range (1-3)', async () => {
      const invalidArticle = new Article({
        title: 'Test',
        link: 'https://example.com/test',
        sourceName: 'Test',
        sourceUrl: 'https://example.com',
        sourceType: 'official' as const,
        sourceTier: 5 as any,
        publishedAt: new Date(),
        fetchedAt: new Date(),
        classification: { tags: [] },
        scores: { relevance: 0, freshness: 0, popularity: 0, finalScore: 0 },
        metadata: { hasCode: false, codeLanguages: [] },
        stats: { views: 0, clicks: 0, bookmarks: 0 },
      });

      await expect(invalidArticle.save()).rejects.toThrow();
    });
  });

  describe('Article indexes', () => {
    it('should have index on title', () => {
      const indexes = Article.schema.indexes();
      const titleIndex = indexes.find((idx) => idx[0].title);
      expect(titleIndex).toBeDefined();
    });

    it('should have compound index on language and finalScore', () => {
      const indexes = Article.schema.indexes();
      const compoundIndex = indexes.find(
        (idx) => idx[0]['classification.language'] && idx[0]['scores.finalScore']
      );
      expect(compoundIndex).toBeDefined();
    });
  });

  describe('Article queries', () => {
    beforeEach(async () => {
      // テストデータを作成
      await Article.create([
        {
          title: 'Python Article',
          link: 'https://example.com/python',
          sourceName: 'Test',
          sourceUrl: 'https://example.com',
          sourceType: 'official',
          sourceTier: 1,
          publishedAt: new Date(),
          fetchedAt: new Date(),
          classification: {
            language: 'python',
            tags: ['python', 'tutorial'],
          },
          scores: { relevance: 0, freshness: 0, popularity: 0, finalScore: 10 },
          metadata: { hasCode: true, codeLanguages: ['python'] },
          stats: { views: 0, clicks: 0, bookmarks: 0 },
        },
        {
          title: 'JavaScript Article',
          link: 'https://example.com/javascript',
          sourceName: 'Test',
          sourceUrl: 'https://example.com',
          sourceType: 'media',
          sourceTier: 2,
          publishedAt: new Date(),
          fetchedAt: new Date(),
          classification: {
            language: 'javascript',
            tags: ['javascript', 'tutorial'],
          },
          scores: { relevance: 0, freshness: 0, popularity: 0, finalScore: 8 },
          metadata: { hasCode: true, codeLanguages: ['javascript'] },
          stats: { views: 0, clicks: 0, bookmarks: 0 },
        },
      ]);
    });

    it('should find articles by language', async () => {
      const articles = await Article.find({ 'classification.language': 'python' });
      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe('Python Article');
    });

    it('should sort articles by finalScore', async () => {
      const articles = await Article.find().sort({ 'scores.finalScore': -1 });
      expect(articles[0].title).toBe('Python Article'); // score 10
      expect(articles[1].title).toBe('JavaScript Article'); // score 8
    });
  });
});
