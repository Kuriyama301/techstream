import { Router } from 'express';
import { getArticles, getArticleById } from '../controllers/articlesController';

export const articlesRouter = Router();

/**
 * GET /api/articles
 * 記事一覧を取得
 * クエリパラメータ:
 *   - language: 言語フィルタ（例: python, javascript）
 *   - domain: ドメインフィルタ
 *   - page: ページ番号（デフォルト: 1）
 *   - limit: 1ページあたりの件数（デフォルト: 20）
 *   - sort: ソート条件（例: -finalScore）
 */
articlesRouter.get('/', getArticles);

/**
 * GET /api/articles/:id
 * 記事詳細を取得
 */
articlesRouter.get('/:id', getArticleById);
