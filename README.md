# TechStream

エンジニア向けニュースアプリ - プログラミング言語別にキュレーションされた技術情報を提供

## 概要

TechStreamは、エンジニアが効率的に技術情報をキャッチアップできるニュースアプリです。SmartNewsのようなタブ切り替え型インターフェースで、プログラミング言語やドメイン別に記事を整理して表示します。

## 主な機能

- 📰 複数ソースから自動的に技術記事を収集
- 🏷️ プログラミング言語・ドメイン別の自動分類
- 📱 タブ切り替え型の直感的なUI
- 💻 コードスニペットのシンタックスハイライト
- 🎯 パーソナライズされたコンテンツ提供

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion

### バックエンド
- Node.js + Express
- TypeScript
- RESTful API

### データベース
**開発環境:**
- MongoDB（記事・カテゴリデータ）
- PostgreSQL（ユーザーデータ）
- Redis（キャッシュ）

**本番環境（予定）:**
- Amazon DocumentDB
- Amazon RDS for PostgreSQL
- Amazon ElastiCache for Redis
- Amazon OpenSearch Service

## プロジェクト構造

```
/news
├── docs/              # ドキュメント
│   └── design-spec.md # 詳細設計書
├── frontend/          # Next.jsアプリケーション（予定）
├── backend/           # Express APIサーバー（予定）
├── TODO.md            # 開発タスクリスト
├── NOTES.md           # 開発メモ・学習記録
└── README.md          # このファイル
```

## 開発状況

- ✅ Phase 1: Docker環境構築完了
- ✅ Phase 2: MongoDBモデル実装完了（Article、Source、Category）
- ✅ Phase 3-1: RSS収集機能実装完了
- ⏳ Phase 3-2: ContentScheduler実装（次回）
- ⏳ Phase 4: REST API実装（次回）

進捗の詳細は[TODO.md](./TODO.md)を参照してください。

## セットアップ

### 前提条件
- Docker Desktop がインストールされていること
- Git がインストールされていること

### 環境構築手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/Kuriyama301/techstream.git
cd news

# 2. Docker Composeでサービスを起動
docker compose up -d --build

# 3. サービスの起動確認
docker compose ps
# すべてのサービスが "Up" になっていることを確認

# 4. バックエンドのテスト実行
docker compose exec backend npm test

# 5. 初期データ（RSSソース）の登録
docker compose exec backend npm run seed:sources

# 6. RSS記事の収集テスト
docker compose exec backend npm run test:rss
```

### アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:4000
- **バックエンドヘルスチェック**: http://localhost:4000/health
- **MongoDB**: localhost:27017
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 開発コマンド

### Docker管理

```bash
# サービス起動
docker compose up -d

# サービス停止
docker compose down

# ログ確認
docker compose logs -f backend
docker compose logs -f frontend

# サービス再起動
docker compose restart backend
```

### テスト実行

```bash
# 全テスト実行
docker compose exec backend npm test

# 特定のテストファイル実行
docker compose exec backend npm test -- Article.test.ts

# テストのwatch mode
docker compose exec backend npm test -- --watch
```

### スクリプト実行

```bash
# RSSソースデータの初期登録
docker compose exec backend npm run seed:sources

# RSS記事の収集テスト
docker compose exec backend npm run test:rss
```

### データベース操作

```bash
# MongoDBシェル接続
docker compose exec mongodb mongosh techstream

# PostgreSQLシェル接続
docker compose exec postgres psql -U techstream -d techstream

# Redisシェル接続
docker compose exec redis redis-cli
```

### コンテナ内で作業

```bash
# backendコンテナに入る
docker compose exec backend sh

# frontendコンテナに入る
docker compose exec frontend sh
```

## ドキュメント

- [TODO.md](./TODO.md) - 開発タスクリスト
- [NOTES.md](./NOTES.md) - 開発メモ・学習記録
- [設計書](./docs/design-spec.md) - 詳細な設計仕様

## ライセンス

このプロジェクトは個人開発プロジェクトです。

## 作者

k.kuriyama
