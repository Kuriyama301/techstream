import mongoose, { Schema, Model } from 'mongoose';
import { IArticle } from '../types/article';

const ArticleSchema = new Schema<IArticle>(
  {
    // 基本情報
    title: { type: String, required: true, index: true },
    link: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: String },
    imageUrl: { type: String },

    // 出典情報
    sourceName: { type: String, required: true, index: true },
    sourceUrl: { type: String, required: true },
    sourceType: {
      type: String,
      required: true,
      enum: ['official', 'media', 'community'],
    },
    sourceTier: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },

    // 時間情報
    publishedAt: { type: Date, required: true, index: true },
    fetchedAt: { type: Date, required: true },
    updatedAt: { type: Date },

    // 分類情報
    classification: {
      category: {
        type: String,
        enum: ['web', 'system', 'data', 'design', 'saas'],
        index: true,
      },
      language: { type: String }, // 具体的な言語名
      domain: { type: String, index: true },
      technicalLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
      },
      tags: [{ type: String }],
    },

    // スコアリング
    scores: {
      relevance: { type: Number, default: 0 },
      freshness: { type: Number, default: 0 },
      popularity: { type: Number, default: 0 },
      finalScore: { type: Number, default: 0, index: true },
    },

    // メタデータ
    metadata: {
      wordCount: { type: Number },
      readingTime: { type: Number },
      hasCode: { type: Boolean, default: false },
      codeLanguages: [{ type: String }],
    },

    // 統計情報
    stats: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// 複合インデックス
ArticleSchema.index({ 'classification.category': 1, 'scores.finalScore': -1 });
ArticleSchema.index({ 'classification.domain': 1, 'scores.finalScore': -1 });
ArticleSchema.index({ publishedAt: -1 });
ArticleSchema.index({
  'classification.category': 1,
  'classification.domain': 1,
  publishedAt: -1,
});

export const Article: Model<IArticle> = mongoose.model<IArticle>('Article', ArticleSchema);
