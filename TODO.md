# TechStream 開発TODO

## 🔥 今日やること
- [x] Phase 6: 記事詳細ページ実装（SEO対策）✅

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

## 📋 Phase 4: API開発（Week 5）✅ **完了**

### RESTful API
- [x] 記事一覧取得API（GET /api/articles）
- [x] 記事詳細取得API（GET /api/articles/:id）
- [x] フィルタリング機能（言語・ドメイン別）
- [x] ページネーション機能
- [x] ソート機能
- [ ] 基本的な認証API（後回し）

## 📋 Phase 5: フロントエンド基本実装（Week 6-7）✅ **完了**

### 要件変更
- [x] 言語別 → カテゴリー別に設計変更（Web開発、システム/インフラ、データ/AI）
- [x] Tailwind CSS のみでシンプルに実装（shadcn/ui不使用）

### UIコンポーネント
- [x] 記事カードコンポーネント（カテゴリーバッジ、レスポンシブ対応）
- [x] タブナビゲーションコンポーネント（4タブ: トップ、Web、システム、データ）
- [x] レイアウトコンポーネント（ヘッダー）

### ページ実装
- [x] トップページ（タブ切り替え、記事一覧表示）
- [x] APIクライアント実装
- [x] 型定義作成

### バックエンド対応
- [x] Articleモデルにcategoryフィールド追加
- [x] RSSCollectorにカテゴリー検出ロジック追加
- [x] APIをcategoryパラメータ対応
- [x] データ移行スクリプト作成（44件中38件にカテゴリー設定）

## 📋 Phase 6: 記事詳細ページ（SEO対策）✅ **完了**

### SEO対策
- [x] /articles/[id] ページ作成
- [x] 動的メタタグ設定（title, description）
- [x] OGPタグ設定（SNSシェア対応）
- [ ] 構造化データ（JSON-LD）実装（後回し）
- [x] パンくずリスト

### ページ内容
- [x] 記事基本情報表示（タイトル、ソース、日付等）
- [x] RSSのdescription表示
- [x] 「元記事を読む」ボタン
- [x] SNSシェアボタン（Twitter, Facebook, LinkedIn）
- [x] 関連記事表示（同カテゴリー3件）
- [x] ArticleCardのリンクを詳細ページに変更

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
- [x] M1: ローカルでRSS記事が表示できる ✅
- [x] M2: カテゴリー別タブで記事が切り替えられる ✅
- [x] M3: 記事詳細ページとSEO対策完了 ✅
- [ ] M4: 基本MVPの完成（目標: 8週間後）
- [ ] M5: デプロイ完了（目標: 10週間後）

## ✅ 完了
<!-- 完了したタスクをここに移動 -->
