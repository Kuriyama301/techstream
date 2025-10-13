# TechStream 開発メモ

## 2025-10-13

### プロジェクト開始
- TechStream（エンジニア向けニュースアプリ）の開発を開始
- 個人開発として進める
- Claude Codeと連携して効率的に開発

### 技術スタック決定
- **フロントエンド**: Next.js 14 + React + TypeScript + Tailwind CSS
- **バックエンド**: Node.js + Express + TypeScript
- **データベース（開発）**:
  - MongoDB（記事データ）
  - PostgreSQL（ユーザーデータ）
  - Redis（キャッシュ）
- **データベース（本番）**: AWS各種サービス（後で移行）
- **インフラ（本番）**: AWS

### プロジェクト管理手法決定
- TODOリスト: TODO.md
- 開発メモ: NOTES.md（このファイル）
- 設計書: text.txt（docs/に移動予定）
- バージョン管理: Git + GitHub
- 外部ツール: 使わない（Notion等は不要）

### 参考資料
- text.txt: 詳細な設計書（2724行）
  - アプリコンセプト
  - UI/UX設計（SmartNewsライク）
  - コンテンツ収集・分類システム
  - データベース設計
  - API設計
  - 実装計画

### 完了したこと
- ✅ プロジェクト管理ファイル作成（TODO.md, NOTES.md, claude.md）
- ✅ 設計書整理（text.txt → docs/design-spec.md）
- ✅ Git初期化と初回コミット
- ✅ GitHubリポジトリ作成と接続

### 次回やること
- Next.jsプロジェクト作成（フロントエンド）
- Express APIサーバー作成（バックエンド）
- ディレクトリ構造の構築

---

## 開発ログ

### 2025-10-13（続き）

#### Git設定完了
- リモートリポジトリ: https://github.com/Kuriyama301/techstream
- 初回コミット: `chore: プロジェクト初期セットアップ`
- コミット規約: Conventional Commits（日本語推奨）

#### 開発ルール確定
- **TDD**: テスト駆動開発で実装
- **コーディング**: ベストプラクティス準拠、可読性重視
- **コメント**: 適度に記述（複雑なロジック、意図の説明）
- **エラーハンドリング**: ユーザー影響部分は丁寧に
- **ドキュメント**: 実装後すぐ更新（AIは忘れっぽいため）

#### 学んだこと
- Claude Codeとの連携では、Markdownベースの管理が最適
- 外部ツール（Notion等）は不要
- Git運用はシンプルに（main ← develop ← feature/*）
- コミットメッセージは日本語で、適切な粒度を意識
- コミットメッセージは短文でシンプルに（bodyは不要）

#### セッション開始の最適化
- quickstart.md作成（100行・セッション開始専用）
- claude.mdは詳細リファレンスとして保持（700行）
- 次回から「開発を再開」で即座に状態把握可能
- トークン効率が大幅に改善

#### 次回のセッション開始プロンプト
```
開発を再開
```

#### ⚠️ Git設定の問題と修正
**問題**: 仕事用のGit設定（oh-tsuchiya）で個人プロジェクトにコミット・プッシュしてしまった

**修正内容**:
1. Git設定を個人用に変更（Kuriyama301）
2. `git filter-branch`で全コミット履歴の作成者を修正
3. `git push --force`でGitHubに反映
4. バックアップファイルをクリーンアップ

**今後の予防策**:
```bash
# 作業開始前に必ず実行
git config user.name
git config user.email

# 個人プロジェクトの場合は gitmain で切り替え
gitmain  # → Kuriyama301, kuriyama.kosuke@gmail.com
```

**教訓**: プロジェクト開始時は必ずGit設定を確認する

---

### 2025-10-13（Docker環境構築）

#### Docker開発環境構築完了
- **ブランチ**: feature/nextjs-setup で作業
- **構成**: docker-compose.ymlで全サービスを一元管理

#### 実装内容

**フロントエンド（Next.js）**:
- Next.js 15.5.4 プロジェクト作成
- TypeScript + Tailwind CSS + ESLint + Prettier
- Dockerfile（multi-stage build: development/production）
- ディレクトリ構造: src/app, src/components, src/hooks, src/lib等
- 動作確認: localhost:3000 ✅

**バックエンド（Express）**:
- Express + TypeScript プロジェクト作成
- nodemon（開発時ホットリロード）
- Dockerfile（multi-stage build: development/production）
- 基本的なエンドポイント実装（/, /health）
- 動作確認: localhost:4000 ✅

**データベース・キャッシュ**:
- MongoDB 7（localhost:27017）
- PostgreSQL 16（localhost:5432）
- Redis 7（localhost:6379）

**Docker設定**:
- docker-compose.yml: 5サービス構成
- ネットワーク: techstream-network（bridge）
- ボリューム: mongodb_data, postgres_data, redis_data

#### 学んだこと
- Docker Composeの`version`フィールドは obsolete（削除済み）
- `npm ci`にはpackage-lock.jsonが必要
- TypeScript strict設定で未使用変数エラー（`_req`で回避）
- nodemonでts-nodeを使用すると開発時の自動リロードが便利

#### Git運用
- feature/nextjs-setup ブランチで作業
- mainブランチにマージ完了
- コミットメッセージ: `feat: Docker開発環境を構築`

#### 次回やること
- Phase 2: データベーススキーマ設計
- MongoDB（記事、カテゴリ）のモデル定義
- PostgreSQL（ユーザー）のテーブル設計

---

### 2025-10-13（Phase 2: MongoDBモデル実装）

#### Phase 2完了 - MongoDBモデル実装
- **ブランチ**: feature/database-models で作業
- **開発手法**: TDD（テスト駆動開発）

#### 実装内容

**Jest設定**:
- jest.config.js作成（ts-jest設定）
- テスト環境でMongoDB接続設定
- clearDatabase機能（テスト前のデータクリア）

**Articleモデル**:
- 記事の全情報を管理（タイトル、リンク、コンテンツ等）
- 出典情報（sourceName、sourceType、sourceTier）
- 分類情報（language、domain、technicalLevel、tags）
- スコアリング（relevance、freshness、popularity、finalScore）
- メタデータ（wordCount、hasCode、codeLanguages等）
- 統計情報（views、clicks、bookmarks）
- 複合インデックス設定（検索最適化）
- テスト: 9件すべて合格 ✅

**Sourceモデル**:
- RSSフィードソース情報を管理
- 基本情報（name、url、feedUrl）
- 分類情報（type: official/media/community、tier: 1-3）
- 収集設定（refreshInterval、isActive）
- 統計情報（totalArticles、lastFetchedAt、failureCount）
- テスト: 10件すべて合格 ✅

**Categoryモデル**:
- カテゴリ情報を管理（言語・ドメイン別）
- 基本情報（name、slug、type: language/domain）
- 表示設定（displayOrder、icon、color）
- 統計情報（articleCount、lastUpdatedAt）
- テスト: 11件すべて合格 ✅

**型定義**:
- IArticle（backend/src/types/article.ts）
- ISource（backend/src/types/source.ts）
- ICategory（backend/src/types/category.ts）

#### テスト結果
```
Test Suites: 3 passed
Tests:       30 passed
Total:       Article(9) + Source(10) + Category(11) = 30 ✅
```

#### 学んだこと
- TDDで進めることで、モデル設計の問題を早期発見
- Mongooseのスキーマ定義とTypeScript型定義を分離
- テスト環境ではMONGODB_URIをlocalhost指定
- clearDatabase関数でテスト間の独立性を確保
- インデックス設定で検索パフォーマンスを最適化
- 複合インデックス（言語+スコア、ドメイン+スコア）が重要

#### Git運用
- feature/database-models ブランチで作業
- mainブランチにマージ完了
- コミットメッセージ: `feat: MongoDBモデル実装（Article、Source、Category）`

#### 次回やること
- Phase 3: RSS収集機能の実装
- RSS Parserの実装
- 基本的なソース登録（Python、JavaScript、Go等）

---

### 2025-10-13（Phase 3-1: RSS収集機能実装）

#### Phase 3-1完了 - RSS収集機能実装
- **ブランチ**: feature/rss-collector で作業
- **開発手法**: TDD（テスト駆動開発）

#### 実装内容

**rss-parserライブラリ導入**:
- npm install rss-parser
- RSSとAtom両方のフィードに対応
- 自動で日付パース、TypeScript対応

**RSSCollectorクラス**:
- `fetchFromSource(sourceId)`: 指定ソースからRSS取得
- `detectLanguage()`: URLから言語を自動検出
- `calculateFreshness()`: 記事の新鮮さスコア計算
- 重複記事チェック（link基準）
- エラーハンドリング（failureCount記録）
- テスト: 15件実装（ユニット + 統合テスト）

**初期ソースデータ登録**:
- seedSources.ts: 初期ソース登録スクリプト
- 9件のRSSフィード登録
  - Python: Python Insider, Real Python
  - JavaScript: JavaScript Weekly, Node.js Blog
  - Go: The Go Blog
  - Rust: Rust Blog
  - TypeScript: TypeScript Blog
  - 全般: Hacker News, DEV Community

**動作確認テスト**:
- testRSSCollector.ts: RSS収集テストスクリプト
- 実際に44件の記事を収集成功
  - Real Python: 40件
  - JavaScript Weekly: 4件
- 最新記事の表示確認 ✅

#### スクリプトコマンド
```bash
# 初期ソース登録
MONGODB_URI=mongodb://localhost:27017/techstream npm run seed:sources

# RSS収集テスト
MONGODB_URI=mongodb://localhost:27017/techstream npm run test:rss
```

#### 学んだこと
- rss-parserは型定義内蔵で使いやすい
- RSSフィードによって構造が異なる（item.content vs item.contentSnippet）
- URLパターンマッチングで言語検出は実用的
- 新鮮さスコアは時間経過で減衰させる（6h→10点、24h→8点）
- 実際のネットワークアクセスを伴うテストはタイムアウト設定が重要

#### Git運用
- feature/rss-collector ブランチで作業
- mainブランチにマージ完了
- コミットメッセージ: `feat: RSS収集機能を実装`

#### 次回やること
- Phase 3-2: ContentScheduler実装（定期自動収集）
- Phase 4: REST API実装（記事取得エンドポイント）

<!-- 今後の開発メモはここに追記 -->
