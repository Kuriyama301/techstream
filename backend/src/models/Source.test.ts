import { Source } from './Source';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../config/database';

describe('Source Model', () => {
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

  describe('Source creation', () => {
    it('should create a valid source with required fields', async () => {
      const sourceData = {
        name: 'Python Official Blog',
        url: 'https://blog.python.org',
        feedUrl: 'https://blog.python.org/feeds/posts/default',
        type: 'official' as const,
        tier: 1,
        refreshInterval: 3600000, // 1 hour
        isActive: true,
        stats: {
          totalArticles: 0,
          failureCount: 0,
        },
      };

      const source = new Source(sourceData);
      const savedSource = await source.save();

      expect(savedSource._id).toBeDefined();
      expect(savedSource.name).toBe('Python Official Blog');
      expect(savedSource.feedUrl).toBe('https://blog.python.org/feeds/posts/default');
      expect(savedSource.isActive).toBe(true);
      expect(savedSource.createdAt).toBeDefined();
    });

    it('should fail when required fields are missing', async () => {
      const invalidSource = new Source({});

      await expect(invalidSource.save()).rejects.toThrow();
    });

    it('should enforce unique feedUrl constraint', async () => {
      const sourceData = {
        name: 'Test Source',
        url: 'https://test.com',
        feedUrl: 'https://test.com/feed',
        type: 'media' as const,
        tier: 2,
        refreshInterval: 3600000,
        isActive: true,
        stats: {
          totalArticles: 0,
          failureCount: 0,
        },
      };

      await new Source(sourceData).save();

      const duplicateSource = new Source(sourceData);
      await expect(duplicateSource.save()).rejects.toThrow();
    });
  });

  describe('Source validation', () => {
    it('should validate type enum', async () => {
      const invalidSource = new Source({
        name: 'Test',
        url: 'https://test.com',
        feedUrl: 'https://test.com/feed',
        type: 'invalid' as any,
        tier: 1,
        refreshInterval: 3600000,
        isActive: true,
        stats: { totalArticles: 0, failureCount: 0 },
      });

      await expect(invalidSource.save()).rejects.toThrow();
    });

    it('should validate tier range (1-3)', async () => {
      const invalidSource = new Source({
        name: 'Test',
        url: 'https://test.com',
        feedUrl: 'https://test.com/feed',
        type: 'media' as const,
        tier: 5 as any,
        refreshInterval: 3600000,
        isActive: true,
        stats: { totalArticles: 0, failureCount: 0 },
      });

      await expect(invalidSource.save()).rejects.toThrow();
    });

    it('should have default value for isActive (true)', async () => {
      const source = new Source({
        name: 'Test',
        url: 'https://test.com',
        feedUrl: 'https://test.com/feed',
        type: 'community' as const,
        tier: 3,
        refreshInterval: 3600000,
        stats: { totalArticles: 0, failureCount: 0 },
      });

      const savedSource = await source.save();
      expect(savedSource.isActive).toBe(true);
    });
  });

  describe('Source queries', () => {
    beforeEach(async () => {
      await Source.create([
        {
          name: 'Python Blog',
          url: 'https://python.org',
          feedUrl: 'https://python.org/feed',
          type: 'official',
          tier: 1,
          refreshInterval: 3600000,
          isActive: true,
          stats: { totalArticles: 100, failureCount: 0 },
          metadata: { language: 'python' },
        },
        {
          name: 'JavaScript Weekly',
          url: 'https://jsweekly.com',
          feedUrl: 'https://jsweekly.com/feed',
          type: 'media',
          tier: 2,
          refreshInterval: 7200000,
          isActive: true,
          stats: { totalArticles: 50, failureCount: 0 },
          metadata: { language: 'javascript' },
        },
        {
          name: 'Inactive Source',
          url: 'https://inactive.com',
          feedUrl: 'https://inactive.com/feed',
          type: 'community',
          tier: 3,
          refreshInterval: 3600000,
          isActive: false,
          stats: { totalArticles: 0, failureCount: 5 },
        },
      ]);
    });

    it('should find only active sources', async () => {
      const sources = await Source.find({ isActive: true });
      expect(sources).toHaveLength(2);
    });

    it('should find sources by type', async () => {
      const sources = await Source.find({ type: 'official' });
      expect(sources).toHaveLength(1);
      expect(sources[0].name).toBe('Python Blog');
    });

    it('should sort sources by tier', async () => {
      const sources = await Source.find().sort({ tier: 1 });
      expect(sources[0].tier).toBe(1);
      expect(sources[1].tier).toBe(2);
      expect(sources[2].tier).toBe(3);
    });
  });

  describe('Source statistics update', () => {
    it('should update lastFetchedAt', async () => {
      const source = await Source.create({
        name: 'Test',
        url: 'https://test.com',
        feedUrl: 'https://test.com/feed',
        type: 'media' as const,
        tier: 2,
        refreshInterval: 3600000,
        isActive: true,
        stats: { totalArticles: 0, failureCount: 0 },
      });

      const now = new Date();
      source.stats.lastFetchedAt = now;
      source.stats.lastSuccessAt = now;
      source.stats.totalArticles = 10;

      await source.save();

      const updated = await Source.findById(source._id);
      expect(updated?.stats.totalArticles).toBe(10);
      expect(updated?.stats.lastFetchedAt).toBeDefined();
      expect(updated?.stats.lastSuccessAt).toBeDefined();
    });
  });
});
