import mongoose, { Schema, Model } from 'mongoose';
import { ICategory } from '../types/category';

const CategorySchema = new Schema<ICategory>(
  {
    // 基本情報
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['language', 'domain'],
    },
    description: { type: String },

    // 表示設定
    displayOrder: { type: Number, required: true },
    icon: { type: String },
    color: { type: String },

    // メタデータ
    metadata: {
      tags: [{ type: String }],
      relatedCategories: [{ type: String }],
    },

    // 統計情報
    stats: {
      articleCount: { type: Number, default: 0 },
      lastUpdatedAt: { type: Date },
    },

    // 有効/無効
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// インデックス
CategorySchema.index({ slug: 1 });
CategorySchema.index({ type: 1, displayOrder: 1 });
CategorySchema.index({ isActive: 1, displayOrder: 1 });

export const Category: Model<ICategory> = mongoose.model<ICategory>(
  'Category',
  CategorySchema
);
