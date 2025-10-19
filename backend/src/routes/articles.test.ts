import request from 'supertest';
import express, { Express } from 'express';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../config/database';
import { Article } from '../models';
import { articlesRouter } from './articles';

describe('Articles API', () => {
  let app: Express;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://mongodb:27017/techstream_test';
    await connectDatabase();

    // Expressアプリケーションのセットアップ
    app = express();
    app.use(express.json());
    app.use('/api/articles', articlesRouter);
  }, 30000);

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/articles', () => {
    beforeEach(async () => {
      // テスト用の記事を作成
      await Article.create([
        {
          title: 'Python Article 1',
          link: 'https://example.com/python-1',
          sourceName: 'Test Source',
          sourceUrl: 'https://example.com',
          sourceType: 'official',
          sourceTier: 1,
          classification: { language: 'python' },
          scores: { finalScore: 10, freshness: 10, relevance: 0, popularity: 0 },
          publishedAt: new Date('2025-10-19'),
          fetchedAt: new Date('2025-10-19'),
        },
        {
          title: 'JavaScript Article 1',
          link: 'https://example.com/js-1',
          sourceName: 'Test Source',
          sourceUrl: 'https://example.com',
          sourceType: 'media',
          sourceTier: 2,
          classification: { language: 'javascript' },
          scores: { finalScore: 8, freshness: 8, relevance: 0, popularity: 0 },
          publishedAt: new Date('2025-10-18'),
          fetchedAt: new Date('2025-10-18'),
        },
        {
          title: 'Python Article 2',
          link: 'https://example.com/python-2',
          sourceName: 'Test Source',
          sourceUrl: 'https://example.com',
          sourceType: 'official',
          sourceTier: 1,
          classification: { language: 'python' },
          scores: { finalScore: 6, freshness: 6, relevance: 0, popularity: 0 },
          publishedAt: new Date('2025-10-17'),
          fetchedAt: new Date('2025-10-17'),
        },
      ]);
    });

    it('should return all articles', async () => {
      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles).toHaveLength(3);
      expect(response.body.data.pagination.total).toBe(3);
    });

    it('should filter articles by language', async () => {
      const response = await request(app).get('/api/articles?language=python');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles).toHaveLength(2);
      expect(response.body.data.articles[0].classification.language).toBe('python');
    });

    it('should sort articles by finalScore descending', async () => {
      const response = await request(app).get('/api/articles?sort=-finalScore');

      expect(response.status).toBe(200);
      expect(response.body.data.articles[0].scores.finalScore).toBe(10);
      expect(response.body.data.articles[1].scores.finalScore).toBe(8);
      expect(response.body.data.articles[2].scores.finalScore).toBe(6);
    });

    it('should support pagination', async () => {
      const response = await request(app).get('/api/articles?page=1&limit=2');

      expect(response.status).toBe(200);
      expect(response.body.data.articles).toHaveLength(2);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.total).toBe(3);
    });

    it('should return empty array when no articles found', async () => {
      await clearDatabase();

      const response = await request(app).get('/api/articles');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles).toHaveLength(0);
      expect(response.body.data.pagination.total).toBe(0);
    });
  });

  describe('GET /api/articles/:id', () => {
    let articleId: string;

    beforeEach(async () => {
      const article = await Article.create({
        title: 'Test Article',
        link: 'https://example.com/test',
        sourceName: 'Test Source',
        sourceUrl: 'https://example.com',
        sourceType: 'official',
        sourceTier: 1,
        classification: { language: 'python' },
        scores: { finalScore: 10, freshness: 10, relevance: 0, popularity: 0 },
        publishedAt: new Date('2025-10-19'),
        fetchedAt: new Date('2025-10-19'),
      });
      articleId = article._id.toString();
    });

    it('should return article by id', async () => {
      const response = await request(app).get(`/api/articles/${articleId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.article.title).toBe('Test Article');
      expect(response.body.data.article._id).toBe(articleId);
    });

    it('should return 404 when article not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format

      const response = await request(app).get(`/api/articles/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 when id is invalid', async () => {
      const response = await request(app).get('/api/articles/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
