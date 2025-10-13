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

現在: プロジェクト初期セットアップ中

進捗の詳細は[TODO.md](./TODO.md)を参照してください。

## セットアップ（準備中）

```bash
# リポジトリのクローン
git clone [repository-url]
cd news

# フロントエンドのセットアップ
cd frontend
npm install
npm run dev

# バックエンドのセットアップ
cd ../backend
npm install
npm run dev
```

## ドキュメント

- [TODO.md](./TODO.md) - 開発タスクリスト
- [NOTES.md](./NOTES.md) - 開発メモ・学習記録
- [設計書](./docs/design-spec.md) - 詳細な設計仕様

## ライセンス

このプロジェクトは個人開発プロジェクトです。

## 作者

k.kuriyama
