import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Article } from '../models/Article';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/techstream';

async function resetTranslations() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB connected');

  const result = await Article.updateMany(
    {},
    { $unset: { translatedDescription: '' } }
  );

  console.log(`✅ Reset ${result.modifiedCount} articles`);
  process.exit(0);
}

resetTranslations();
