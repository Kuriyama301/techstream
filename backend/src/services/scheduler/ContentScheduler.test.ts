import { ContentScheduler } from './ContentScheduler';
import { Source } from '../../models';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../../config/database';

describe('ContentScheduler', () => {
  let scheduler: ContentScheduler;

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
    scheduler = new ContentScheduler();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (scheduler.isRunning()) {
      scheduler.stop();
    }
  });

  describe('Constructor', () => {
    it('should create ContentScheduler instance', () => {
      expect(scheduler).toBeInstanceOf(ContentScheduler);
    });

    it('should not be running initially', () => {
      expect(scheduler.isRunning()).toBe(false);
    });
  });

  describe('start and stop', () => {
    it('should start the scheduler', () => {
      scheduler.start();
      expect(scheduler.isRunning()).toBe(true);
    });

    it('should stop the scheduler', () => {
      scheduler.start();
      scheduler.stop();
      expect(scheduler.isRunning()).toBe(false);
    });

    it('should not start twice', () => {
      scheduler.start();
      const consoleSpy = jest.spyOn(console, 'log');
      scheduler.start();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('already running')
      );
      consoleSpy.mockRestore();
    });

    it('should not stop when not running', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      scheduler.stop();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('not running')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('collectFromAllSources', () => {
    beforeEach(async () => {
      // テスト用ソースを作成
      await Source.create({
        name: 'Test Source 1',
        url: 'https://example.com',
        feedUrl: 'https://example.com/feed.xml',
        type: 'official',
        tier: 1,
        refreshInterval: 3600000,
        isActive: true,
      });

      await Source.create({
        name: 'Test Source 2',
        url: 'https://example2.com',
        feedUrl: 'https://example2.com/feed.xml',
        type: 'media',
        tier: 2,
        refreshInterval: 3600000,
        isActive: true,
      });

      await Source.create({
        name: 'Inactive Source',
        url: 'https://inactive.com',
        feedUrl: 'https://inactive.com/feed.xml',
        type: 'community',
        tier: 3,
        refreshInterval: 3600000,
        isActive: false,
      });
    });

    it('should collect from all active sources', async () => {
      const mockFetchFromSource = jest.fn().mockResolvedValue(undefined);

      // schedulerのcollectorを直接モックに置き換え
      (scheduler as any).collector = {
        fetchFromSource: mockFetchFromSource,
      };

      await scheduler.collectFromAllSources();

      // アクティブな2件のソースから収集されることを確認
      expect(mockFetchFromSource).toHaveBeenCalledTimes(2);
    });

    it('should handle errors during collection', async () => {
      const mockFetchFromSource = jest
        .fn()
        .mockRejectedValue(new Error('Network error'));

      // schedulerのcollectorを直接モックに置き換え
      (scheduler as any).collector = {
        fetchFromSource: mockFetchFromSource,
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await scheduler.collectFromAllSources();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should skip inactive sources', async () => {
      const mockFetchFromSource = jest.fn().mockResolvedValue(undefined);

      // schedulerのcollectorを直接モックに置き換え
      (scheduler as any).collector = {
        fetchFromSource: mockFetchFromSource,
      };

      await scheduler.collectFromAllSources();

      // 非アクティブなソースは除外されるため、2件のみ
      const sources = await Source.find({ isActive: true });
      expect(sources).toHaveLength(2);
      expect(mockFetchFromSource).toHaveBeenCalledTimes(2);
    });
  });

  describe('runOnce', () => {
    it('should execute collection immediately', async () => {
      await Source.create({
        name: 'Test Source',
        url: 'https://example.com',
        feedUrl: 'https://example.com/feed.xml',
        type: 'official',
        tier: 1,
        refreshInterval: 3600000,
        isActive: true,
      });

      const mockFetchFromSource = jest.fn().mockResolvedValue(undefined);

      // schedulerのcollectorを直接モックに置き換え
      (scheduler as any).collector = {
        fetchFromSource: mockFetchFromSource,
      };

      await scheduler.runOnce();

      expect(mockFetchFromSource).toHaveBeenCalledTimes(1);
    });
  });
});
