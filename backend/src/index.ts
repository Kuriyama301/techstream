import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

// ミドルウェア
app.use(helmet()); // セキュリティヘッダー
app.use(cors()); // CORS設定
app.use(morgan('dev')); // ログ
app.use(express.json()); // JSONボディパース
app.use(express.urlencoded({ extended: true })); // URLエンコードボディパース

// ヘルスチェックエンドポイント
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'techstream-backend',
  });
});

// ルートエンドポイント
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'TechStream API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    },
  });
});

// 404ハンドラー
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
