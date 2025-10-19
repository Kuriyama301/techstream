# TechStream 開発TODO

## 🔥 今日やること
- [ ] Phase 4: REST API実装（記事取得エンドポイント）

## 📋 Phase 1: 環境構築（Week 1-2）✅ **完了**

### フロントエンド
- [x] Next.jsプロジェクトのセットアップ
  - [x] `npx create-next-app@latest`で初期化
  - [x] TypeScript設定
  - [x] Tailwind CSS設定
  - [x] ESLint/Prettier設定
  - [x] ディレクトリ構造構築（app/, components/, lib/ etc.）

### バックエンド
- [x] Node.js + Express プロジェクトのセットアップ
  - [x] プロジェクト初期化
  - [x] TypeScript設定
  - [x] 基本的なディレクトリ構造構築
  - [x] ESLint/Prettier設定

### データベース
- [x] ローカル開発環境構築
  - [x] Docker Compose設定
  - [x] MongoDB（DocumentDBの代替）セットアップ
  - [x] PostgreSQL（ユーザー管理用）セットアップ
  - [x] Redis（キャッシュ用）セットアップ

## 📋 Phase 2: コアデータモデル（Week 3）✅ **完了**

### データベーススキーマ
- [x] 記事（Article）モデル設計・実装
- [x] カテゴリ（Category）モデル設計・実装
- [x] ソース（Source）モデル設計・実装
- [ ] ユーザー（User）モデル設計・実装（後回し）

## 📋 Phase 3: RSS収集機能（Week 4）✅ **完了**

### Phase 3-1: RSS収集基盤
- [x] RSS Parserの実装
- [x] 基本的なソース登録（Python, JavaScript, Go等）
- [x] 記事の分類ロジック実装（シンプル版）
- [x] データベースへの保存処理

### Phase 3-2: 自動収集
- [x] 定期実行のスケジューラー設定（node-cron）
- [x] ContentSchedulerの実装（10件のテスト）

## 📋 Phase 4: API開発（Week 5）

### RESTful API
- [ ] 記事一覧取得API
- [ ] 記事詳細取得API
- [ ] カテゴリ別記事取得API
- [ ] 言語別記事取得API
- [ ] 基本的な認証API（後回しでもOK）

## 📋 Phase 5: フロントエンド基本実装（Week 6-7）

### UIコンポーネント
- [ ] レイアウトコンポーネント
- [ ] 記事カードコンポーネント
- [ ] タブナビゲーションコンポーネント
- [ ] コードハイライトコンポーネント

### ページ実装
- [ ] トップページ
- [ ] 言語別ページ（/languages/[slug]）
- [ ] 記事詳細ページ（/articles/[id]）

## 💡 アイデア・将来的な実装（保留）
- [ ] ユーザー認証・ログイン機能
- [ ] ブックマーク機能
- [ ] 検索機能
- [ ] ダークモード切り替え
- [ ] PWA対応
- [ ] 通知機能
- [ ] AIによる記事要約
- [ ] パーソナライゼーション

## 🎯 マイルストーン
- [ ] M1: ローカルでRSS記事が表示できる（目標: 2週間後）
- [ ] M2: 言語別タブで記事が切り替えられる（目標: 4週間後）
- [ ] M3: 基本MVPの完成（目標: 8週間後）
- [ ] M4: デプロイ完了（目標: 10週間後）

## ✅ 完了
<!-- 完了したタスクをここに移動 -->
