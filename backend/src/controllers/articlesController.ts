import { Request, Response } from 'express';
import { Article } from '../models';
import mongoose from 'mongoose';

/**
 * 記事一覧を取得
 * GET /api/articles?language=python&page=1&limit=20&sort=-finalScore
 */
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      language,
      domain,
      page = '1',
      limit = '20',
      sort = '-scores.finalScore',
    } = req.query;

    // フィルター条件の構築
    const filter: any = {};

    if (language) {
      filter['classification.language'] = language;
    }

    if (domain) {
      filter['classification.domain'] = domain;
    }

    // ページネーション
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // ソート条件の処理
    let sortOption: any = {};
    if (typeof sort === 'string') {
      if (sort.startsWith('-')) {
        sortOption[sort.substring(1)] = -1;
      } else {
        sortOption[sort] = 1;
      }
    }

    // 記事取得とカウント
    const [articles, total] = await Promise.all([
      Article.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Article.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles',
    });
  }
};

/**
 * 記事詳細を取得
 * GET /api/articles/:id
 */
export const getArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // ObjectIDの妥当性チェック
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid article ID format',
      });
      return;
    }

    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({
        success: false,
        error: 'Article not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        article,
      },
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article',
    });
  }
};
