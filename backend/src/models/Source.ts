import mongoose, { Schema, Model } from 'mongoose';
import { ISource } from '../types/source';

const SourceSchema = new Schema<ISource>(
  {
    // 基本情報
    name: { type: String, required: true },
    url: { type: String, required: true },
    feedUrl: { type: String, required: true, unique: true },
    description: { type: String },

    // 分類情報
    type: {
      type: String,
      required: true,
      enum: ['official', 'media', 'community'],
    },
    tier: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
    category: { type: String },

    // 収集設定
    refreshInterval: { type: Number, required: true },
    isActive: { type: Boolean, default: true },

    // 統計情報
    stats: {
      totalArticles: { type: Number, default: 0 },
      lastFetchedAt: { type: Date },
      lastSuccessAt: { type: Date },
      failureCount: { type: Number, default: 0 },
    },

    // メタデータ
    metadata: {
      language: { type: String },
      tags: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// インデックス
SourceSchema.index({ type: 1, tier: 1 });
SourceSchema.index({ isActive: 1 });
SourceSchema.index({ 'metadata.language': 1 });

export const Source: Model<ISource> = mongoose.model<ISource>('Source', SourceSchema);
