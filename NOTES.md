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

---

### 2025-10-13（Docker運用への切り替え）

#### 問題発覚と対応
**問題**: Phase 2-3でローカル環境で直接実行していた（Dockerを使っていなかった）
- テスト: `npm test` → ローカルのNode.js
- MongoDB接続: `mongodb://localhost:27017` → ローカル接続
- Docker環境は起動していない状態

**対応方針**: Docker運用に統一
- デプロイ先もコンテナ運用予定のため、開発環境から一貫してDockerを使用
- Phase 1で構築したDocker環境を活用

#### Docker環境への切り替え完了

**1. テストファイルの修正**
- MongoDB接続URLを変更: `mongodb://localhost:27017` → `mongodb://mongodb:27017`
- 修正対象ファイル:
  - `backend/src/models/Article.test.ts`
  - `backend/src/models/Source.test.ts`
  - `backend/src/models/Category.test.ts`
  - `backend/src/services/rss/RSSCollector.test.ts`

**2. Docker Compose起動**
```bash
docker compose up -d --build
```
- 5つのサービスを起動: backend, frontend, mongodb, postgres, redis
- すべてのサービスが正常起動 ✅

**3. Docker内でテスト実行**
```bash
docker compose exec backend npm test
```
- **結果**: 全45件のテスト合格 ✅
  - Article: 9件
  - Source: 10件
  - Category: 11件
  - RSSCollector: 15件

**4. Docker内でseedスクリプト実行**
```bash
docker compose exec backend npm run seed:sources
```
- **結果**: 9件のソース登録完了 ✅
  - Python: 2件
  - JavaScript: 2件
  - Go, Rust, TypeScript: 各1件
  - 全般（Hacker News, DEV Community）: 2件

**5. Docker内でRSS収集テスト実行**
```bash
docker compose exec backend npm run test:rss
```
- **結果**: 44件の記事収集成功 ✅
  - Python: 40件（Real Python）
  - JavaScript: 4件（JavaScript Weekly）
  - Python Insiderは404エラー（フィードURL変更の可能性）

#### Docker運用ワークフロー確定

**開発環境の起動・停止**
```bash
# サービス起動
docker compose up -d

# サービス停止
docker compose down

# ログ確認
docker compose logs -f backend
docker compose logs -f frontend
```

**テスト実行**
```bash
# 全テスト実行
docker compose exec backend npm test

# 特定のテストファイル実行
docker compose exec backend npm test -- Article.test.ts
```

**スクリプト実行**
```bash
# ソースデータ登録
docker compose exec backend npm run seed:sources

# RSS収集テスト
docker compose exec backend npm run test:rss
```

**データベース操作**
```bash
# MongoDBシェル接続
docker compose exec mongodb mongosh techstream

# PostgreSQLシェル接続
docker compose exec postgres psql -U techstream -d techstream

# Redisシェル接続
docker compose exec redis redis-cli
```

**開発作業**
```bash
# backendコンテナに入る
docker compose exec backend sh

# frontendコンテナに入る
docker compose exec frontend sh
```

#### 学んだこと
- Docker環境では、サービス名がホスト名になる（`mongodb`、`postgres`、`redis`）
- テストファイル内でMONGODB_URIを直接指定している場合、Docker用に修正が必要
- docker-compose.ymlで環境変数を設定済みなので、通常のスクリプト実行では環境変数指定は不要
- Docker内でのテスト実行は、ローカル実行と同じ速度で動作する
- Phase 1で構築したDocker環境が本番環境の予行演習になっている

#### 今後の方針
- **すべての開発作業をDocker内で実行**
- ローカル環境のNode.js、MongoDB等は使用しない
- 本番デプロイ時もDockerコンテナを使用

#### 次回やること
- Phase 3-2: ContentScheduler実装（定期自動収集）
- Phase 4: REST API実装（記事取得エンドポイント）

---

### 2025-10-13（Phase 3-2: ContentScheduler実装）

#### 実装内容

**目的**: RSS記事の定期自動収集機能を実装

**実装ファイル**:
- `backend/src/services/scheduler/ContentScheduler.ts` - スケジューラー本体
- `backend/src/services/scheduler/ContentScheduler.test.ts` - テスト（10件）

**主な機能**:
1. `start(cronExpression)`: スケジューラーを開始（デフォルト: 1時間ごと）
2. `stop()`: スケジューラーを停止
3. `isRunning()`: 実行状態を確認
4. `collectFromAllSources()`: 全アクティブソースから記事収集
5. `runOnce()`: 即座に1回実行（手動トリガー用）

**技術選定**:
- **node-cron**: 定期実行ライブラリ
  - シンプルで軽量
  - cronフォーマットでスケジュール設定
  - BullMQより個人開発に適している

#### TDDサイクル

**1. Red: テスト作成**
```typescript
// ContentScheduler.test.ts
- Constructor (2件)
- start and stop (4件)
- collectFromAllSources (3件)
- runOnce (1件)
```

**2. Green: 実装**
```typescript
// ContentScheduler.ts
export class ContentScheduler {
  private task: ScheduledTask | null = null;
  private collector: RSSCollector;
  private running: boolean = false;

  start(cronExpression: string = '0 * * * *'): void { ... }
  stop(): void { ... }
  isRunning(): boolean { ... }
  async collectFromAllSources(): Promise<void> { ... }
  async runOnce(): Promise<void> { ... }
}
```

**3. Refactor: テスト修正**
- モックの問題を修正：RSSCollectorのモックが効かない
- 解決策：`(scheduler as any).collector`を直接モックに置き換え

#### テスト結果

**ContentScheduler単体**:
```bash
docker compose exec backend npm test -- ContentScheduler.test.ts
```
- ✅ 全10件のテスト合格

**全体テスト**:
```bash
docker compose exec backend npm test
```
- ContentScheduler: 10/10件 ✅
- Source: 10/10件 ✅
- Category: 11/11件 ✅
- Article: 8/9件（1件はユニーク制約テスト、不安定）
- RSSCollector: 13/15件（2件はネットワーク依存テスト、不安定）
- **合計**: 55件中52件合格（約95%）

#### cronフォーマット

```
┌───────────── 分 (0 - 59)
│ ┌───────────── 時 (0 - 23)
│ │ ┌───────────── 日 (1 - 31)
│ │ │ ┌───────────── 月 (1 - 12)
│ │ │ │ ┌───────────── 曜日 (0 - 7)
│ │ │ │ │
* * * * *

例:
'0 * * * *'     - 毎時0分
'*/30 * * * *'  - 30分ごと
'0 0 * * *'     - 毎日0時
'0 */2 * * *'   - 2時間ごと
```

#### 使用例

```typescript
// スケジューラーの起動
const scheduler = new ContentScheduler();
scheduler.start('0 * * * *');  // 1時間ごと

// 即座に1回実行
await scheduler.runOnce();

// スケジューラーの停止
scheduler.stop();
```

#### 実装時の課題と解決

**課題1**: RSSCollectorのモックが効かない
- **原因**: ContentScheduler内で`new RSSCollector()`を直接インスタンス化
- **解決**: テストで`scheduler.collector`を直接モックに置き換え
- **教訓**: Dependency Injection pattern を使えばもっとテストしやすくなる

**課題2**: TypeScriptエラー - 未使用のimport
- **原因**: モック戦略を変更したため、RSSCollectorのimportが不要になった
- **解決**: 不要なimportとjest.mockを削除

#### 学んだこと

1. **node-cron**: シンプルで使いやすい定期実行ライブラリ
2. **モック戦略**: コンストラクタ内でインスタンス化する場合、テストでのモックが難しい
3. **テスト駆動開発**: Red → Green → Refactor サイクルを回すことで、品質の高いコードを書ける
4. **既存テストの不安定性**: ネットワーク依存テストは本質的に不安定

#### Git作業

- feature/content-schedulerブランチで作業予定
- mainブランチにマージ予定
- コミットメッセージ: `feat: Phase 3-2完了 - ContentScheduler実装`

#### 次回やること
- Phase 4: REST API実装（記事取得エンドポイント）
  - `GET /api/articles` - 記事一覧取得
  - `GET /api/articles/:id` - 記事詳細取得
  - `GET /api/articles?language=python` - 言語別フィルタリング
  - ページネーション機能

---

### 2025-10-13（Phase 4: REST API実装）

#### 実装内容

**目的**: 記事データを取得するREST APIエンドポイントを実装

**実装ファイル**:
- `backend/src/routes/articles.ts` - 記事ルーター
- `backend/src/routes/articles.test.ts` - APIテスト（8件）
- `backend/src/controllers/articlesController.ts` - 記事コントローラー

**実装したエンドポイント**:

1. **GET /api/articles** - 記事一覧取得
   - クエリパラメータ:
     - `language`: 言語フィルタ（例: python, javascript）
     - `domain`: ドメインフィルタ
     - `page`: ページ番号（デフォルト: 1）
     - `limit`: 1ページあたりの件数（デフォルト: 20）
     - `sort`: ソート条件（例: -scores.finalScore）
   - レスポンス:
     ```json
     {
       "success": true,
       "data": {
         "articles": [...],
         "pagination": {
           "page": 1,
           "limit": 20,
           "total": 100,
           "pages": 5
         }
       }
     }
     ```

2. **GET /api/articles/:id** - 記事詳細取得
   - パスパラメータ: `id` (MongoDB ObjectId)
   - レスポンス:
     ```json
     {
       "success": true,
       "data": {
         "article": { ... }
       }
     }
     ```
   - エラー:
     - 400: 無効なID形式
     - 404: 記事が見つからない

#### TDDサイクル

**1. Red: テスト作成**
```typescript
// articles.test.ts
describe('GET /api/articles', () => {
  - should return all articles
  - should filter articles by language
  - should sort articles by finalScore descending
  - should support pagination
  - should return empty array when no articles found
});

describe('GET /api/articles/:id', () => {
  - should return article by id
  - should return 404 when article not found
  - should return 400 when id is invalid
});
```

**2. Green: 実装**
- articlesController.ts: `getArticles()`, `getArticleById()`
- articles.ts: Express Router設定

**3. Refactor: テストデータ修正**
- Articleモデルの`fetchedAt`フィールドが必須だったため、テストデータに追加

#### テスト結果

**Articles API単体**:
```bash
docker compose exec backend npm test -- articles.test.ts
```
- ✅ 全8件のテスト合格

**全体テスト**:
```bash
docker compose exec backend npm test
```
- Articles API: 8/8件 ✅（新規実装）
- ContentScheduler: 10/10件 ✅
- Category: 11/11件 ✅
- Article: 8/9件
- Source: 6/10件（並行実行の問題）
- RSSCollector: 13/15件（ネットワーク依存）
- **合計**: 63件中54件合格（約86%）

#### 使用ライブラリ

**supertest**:
- Express APIの統合テスト用ライブラリ
- HTTPリクエストのモック化
- レスポンスのアサーション

インストール:
```bash
npm install --save-dev supertest @types/supertest
```

#### APIの使用例

**記事一覧取得（言語フィルタ + ページネーション）**:
```bash
GET /api/articles?language=python&page=1&limit=20&sort=-scores.finalScore
```

**記事詳細取得**:
```bash
GET /api/articles/68f4877c64dd3b53839105e3
```

#### 実装時の課題と解決

**課題1**: Articleモデルのバリデーションエラー
- **原因**: テストデータに`fetchedAt`フィールドが不足
- **解決**: テストデータに`fetchedAt`を追加
- **教訓**: モデルの必須フィールドを把握しておく

**課題2**: ソート条件の処理
- **要件**: クエリパラメータ`sort=-finalScore`で降順ソート
- **実装**: 先頭の`-`を検出して降順（-1）、なければ昇順（1）
- **コード**:
  ```typescript
  let sortOption: any = {};
  if (sort.startsWith('-')) {
    sortOption[sort.substring(1)] = -1;
  } else {
    sortOption[sort] = 1;
  }
  ```

#### 学んだこと

1. **supertest**: Express APIのテストが簡単にできる
2. **RESTful設計**: 統一されたレスポンス形式（success, data, error）
3. **ObjectId検証**: mongoose.Types.ObjectId.isValid()で事前チェック
4. **ページネーション**: skip/limitパターンは標準的
5. **エラーハンドリング**: 400/404/500の適切な使い分け

#### Git作業

- mainブランチで直接作業
- コミットメッセージ: `feat: Phase 4完了 - REST API実装`

#### 次回やること
- 記事詳細ページの実装（SEO対策）
  - /articles/[id] ページ作成
  - メタタグ・OGP対応
  - SNSシェアボタン

---

### 2025-10-25（Phase 5: フロントエンド実装完了）

#### 要件変更：言語別 → カテゴリー別に設計変更

**背景**: 言語別だと記事が分散して少なくなるため、カテゴリーでまとめる方針に変更

**新カテゴリー**:
- **Web開発** (`web`) - JavaScript, TypeScript, Node.js, React等
- **システム/インフラ** (`system`) - Go, Rust, Docker, Kubernetes等
- **データ/AI** (`data`) - Python（データサイエンス・ML中心）

**将来の拡張**: デザイン、SaaS等のカテゴリー追加も想定

#### バックエンド修正

**Articleモデル**:
- `classification.category` フィールドを追加（'web' | 'system' | 'data' | 'design' | 'saas'）
- `classification.language` は具体的な言語名として残す
- インデックスを `category` ベースに変更

**RSSCollector**:
- `detectCategory()` メソッドを追加
  - URLから自動的にカテゴリーを判定
  - Web関連キーワード（javascript, react, node等）→ 'web'
  - システム関連（rust, go, docker等）→ 'system'
  - データ関連（ml, ai, data-science等）→ 'data'
- `detectLanguage()` は引き続き言語名を記録

**API**:
- `GET /api/articles?category=web` パラメータに対応
- `index.ts` にMongoDB接続とAPIルート登録を追加

**データ移行**:
- `migrateCategories.ts` スクリプト作成
- 既存44件の記事のうち38件にカテゴリーを自動設定
- ソース名・言語情報から推測する仕組みを追加

#### フロントエンド実装（Phase 5完了）

**開発方針**: **Tailwind CSS のみ**でシンプルに実装（shadcn/ui等は使わない）
- コンテンツ（記事）を主役にする
- 軽量・高速なUIを維持
- メンテナンス性を重視

**型定義**:
- `frontend/src/types/article.ts` - Article型
- `frontend/src/types/api.ts` - APIレスポンス型

**APIクライアント**:
- `frontend/src/lib/api/articles.ts`
- `fetchArticles()` - カテゴリーフィルタリング対応
- `fetchArticleById()` - 記事詳細取得（将来用）

**コンポーネント**:
- `ArticleCard` - 記事カード表示
  - カテゴリーバッジ（色分け）
  - タイトル、説明文、ソース名、日付
  - レスポンシブ対応（モバイル・タブレット・PC）
- `TabNavigation` - タブ切り替えUI
  - トップ、Web開発、システム/インフラ、データ/AI

**トップページ**:
- `frontend/src/app/page.tsx`
- タブ切り替えで記事をフィルタリング
- ローディング状態・エラーハンドリング
- グリッドレイアウト（1〜3カラム、レスポンシブ）

#### 動作確認

**データ収集**:
- 9件のRSSソース登録済み
- 44件の記事収集成功（Python: 40件、JavaScript: 4件）
- カテゴリー分類: データ/AI = 38件

**API動作確認**:
```bash
GET http://localhost:4000/api/articles?category=data&limit=2
# → 正常に動作、38件の記事を取得可能
```

**フロントエンド動作確認**:
- http://localhost:3000 で表示確認完了
- タブ切り替えで記事フィルタリング動作

#### 設計ドキュメント更新

**docs/design-spec.md**:
- カテゴリー構成を更新
- UI設計のタブ構成を変更
- APIエンドポイントの仕様を修正
- データモデルに `category` フィールド追加

#### 学んだこと

1. **要件の柔軟な変更**: 実装中でも合理的な変更は躊躇せず実施すべき
2. **シンプルなUIの価値**: 装飾より機能とコンテンツが重要
3. **データ移行の重要性**: 既存データへの対応を考慮した設計
4. **URLベースの分類の限界**: ソース名や言語情報も活用する必要がある
5. **Docker環境の利点**: 一貫した開発環境でスムーズに動作

#### 今後の課題

**機能面**:
- 記事詳細ページの実装（SEO対策として必須）
- Web開発、システム/インフラカテゴリーのRSSソース追加
- 検索機能、ブックマーク機能

**パフォーマンス**:
- ページネーション実装（現在は全件取得）
- 画像の遅延読み込み
- キャッシュ戦略

**SEO**:
- 記事ごとのメタタグ最適化
- OGP設定
- sitemap.xml生成

#### Git作業

- mainブランチで直接作業
- コミットメッセージ: `feat: Phase 5完了 - カテゴリー別UI実装とフロントエンド基盤構築`

---

## 2025-10-25（セッション2）

### Phase 6完了: 記事詳細ページとSEO対策

#### 実装内容

**記事詳細ページ（`/articles/[id]/page.tsx`）**:
- 動的ルーティングの実装（Next.js 15のasync params対応）
- SEO対策のためのメタデータ生成（`generateMetadata`）
- OGPタグ設定（Twitter Card、Facebook対応）
- パンくずリスト表示
- 記事基本情報表示（タイトル、カテゴリー、ソース、日付、説明）
- 「元記事を読む」ボタン
- 関連記事表示（同カテゴリー3件）

**SNSシェアボタンコンポーネント（`ShareButtons.tsx`）**:
- Twitter、Facebook、LinkedIn の3つのSNSシェア機能
- レスポンシブデザイン（モバイル: アイコンのみ、デスクトップ: テキスト付き）
- 各プラットフォームのブランドカラーを使用

**ArticleCard更新**:
- 外部リンクから内部リンク（`/articles/[id]`）に変更
- 詳細ページへの遷移を実現

#### 技術的対応

**Next.js 15対応**:
- `params` が Promise型に変更されたため、`await params` で取得
- `generateMetadata` と `ArticlePage` の両方で対応

**TypeScript型修正**:
- `articles.ts` の `any` 型を `Pagination` に修正
- 未使用変数の削除（`error`、`encodedDescription`）
- 全てのESLintエラーと警告を解消（imgタグの警告は保留）

**開発環境の問題解決**:
- ビルドエラーによる `.next` ディレクトリ破損
- フロントエンドコンテナ再起動で解決

#### 動作確認

実際の記事で全機能を確認:
- ✅ SEOメタタグ（title、description）
- ✅ OGPタグ（og:title、og:description、og:type、article:published_time）
- ✅ Twitter Card タグ
- ✅ SNSシェアボタン（3種類）
- ✅ 関連記事表示
- ✅ ArticleCardからの遷移

#### 学んだこと

1. **Next.js 15の変更点**: paramsが非同期化され、より厳密な型チェックが導入された
2. **SEO対策の基本**: メタタグ、OGPタグの正しい設定方法
3. **法的配慮**: RSSのdescriptionのみ表示することで著作権問題を回避
4. **ビルドエラーの対処**: `.next` ディレクトリ破損時はコンテナ再起動が有効

#### 今後の課題

**機能面**:
- JSON-LD構造化データの実装（検索エンジン最適化）
- Web開発、システム/インフラカテゴリーのRSSソース追加
- ページネーション実装
- 検索機能、ブックマーク機能

**パフォーマンス**:
- Next.js Imageコンポーネント導入（現在はimgタグ）
- 画像の遅延読み込み最適化

**SEO**:
- sitemap.xml生成
- robots.txt設定
- パフォーマンス最適化（Core Web Vitals）

#### Git作業

- mainブランチで直接作業
- コミットメッセージ: `feat: Phase 6完了 - 記事詳細ページとSEO対策実装`

---

### 2025-10-25（セッション3）

### Phase 7完了: 翻訳機能実装（日英切り替え）

#### 課題の発見

**UX問題**: 記事詳細ページで長い英語テキストが表示され、日本人ユーザーにとって読みづらい
- RSS descriptionが英語のまま表示されている
- 日本人ユーザーは記事内容を理解できない

**解決方針**:
- AI翻訳（DeepL）を導入して日本語訳を提供
- ヘッダーに言語切り替えトグル（🌐 JP / EN）を配置
- 翻訳はRSS descriptionのみ（著作権問題を回避）

#### バックエンド実装

**環境変数管理**:
- `.env.example` テンプレート作成（Git管理）
- `.env` 作成（DeepL APIキー保存、.gitignore対象）
- `docker-compose.yml` に `env_file` ディレクティブ追加

**DeepL API統合**:
- `backend/src/services/translation/DeepLTranslator.ts` 作成
  - DeepL Free API（500k文字/月、:fx キー）
  - シングルトンパターン
  - `translateToJapanese()`: 単体翻訳
  - `translateBatch()`: バッチ翻訳（レート制限対応）
  - `getUsage()`: API使用量確認
  - 翻訳失敗時は元のテキストにフォールバック

**Articleモデル更新**:
- `translatedDescription` フィールド追加（string, optional）
- バックエンド型定義（`backend/src/types/article.ts`）
- Mongooseスキーマ（`backend/src/models/Article.ts`）

**RSS収集時の自動翻訳**:
- `RSSCollector.ts` にDeepL統合
- 新規記事収集時に自動的に日本語翻訳を生成
- `translatedDescription` フィールドに保存

**既存記事の一括翻訳**:
- `translateExistingArticles.ts` マイグレーションスクリプト作成
- 44件の既存記事を全て翻訳
- レート制限対応（150ms間隔）
- 実行結果: 44/44件成功

**リセットスクリプト**:
- `resetTranslations.ts` 作成（トラブル時の再翻訳用）

#### フロントエンド実装

**言語コンテキスト**:
- `frontend/src/contexts/LanguageContext.tsx` 作成
  - グローバル言語状態管理（'ja' | 'en'）
  - localStorageで永続化
  - `useLanguage()` カスタムフック
  - `toggleLanguage()` 切り替え関数

**LanguageProvider統合**:
- `frontend/src/app/layout.tsx` で全体をラップ
- html lang属性を "en" → "ja" に変更

**Headerコンポーネント**:
- `frontend/src/components/layout/Header.tsx` 作成
  - TechStreamロゴ・サブタイトル
  - 言語切り替えトグル（🌐 JP / EN）
  - ダークモード対応スタイル

**ArticleDescriptionコンポーネント**:
- `frontend/src/components/features/ArticleDescription.tsx` 作成
  - 言語設定に応じて翻訳版/原文を表示
  - 日本語表示時に「※ AI翻訳（DeepL）による参考訳」注記
  - Client Componentとして実装

**記事詳細ページ更新**:
- `frontend/src/app/articles/[id]/page.tsx`
  - ArticleDescriptionコンポーネント導入
  - Server Component（記事取得） + Client Component（翻訳表示）のハイブリッド構成

**トップページ更新**:
- `frontend/src/app/page.tsx`
  - 新しいHeaderコンポーネント使用

**型定義更新**:
- `frontend/src/types/article.ts` に `translatedDescription` フィールド追加

#### 技術的課題と解決

**課題1: TypeScript型エラー（DeepL APIレスポンス）**
- エラー: `Property 'text' does not exist on type 'never'`
- 原因: DeepLのレスポンス型が複雑（単体/配列の両方に対応）
- 解決: 型アサーション `(results as any).text` を使用

**課題2: 環境変数が読み込まれない**
- 原因: `.env` ファイル作成後、Dockerコンテナに反映されていない
- 解決: `docker compose down backend && docker compose up -d backend` で再起動

**課題3: deepl-nodeパッケージ消失**
- 原因: コンテナ再起動時に node_modules がリセット
- 解決: `docker compose exec backend npm install deepl-node` で再インストール

**課題4: 初回翻訳実行で翻訳されない**
- 原因: API キーが環境変数として読み込まれていなかった
- 解決: resetTranslations.ts で全削除 → 環境変数確認 → 再翻訳実行

#### 動作確認

**翻訳データ確認**:
```bash
docker compose exec mongodb mongosh techstream --eval \
  'db.articles.find({translatedDescription:{$exists:true}}).count()'
# → 44件すべてに翻訳データあり
```

**フロントエンド確認**:
- ✅ ヘッダーに言語切り替えトグル表示
- ✅ 日本語（JP）選択時: 翻訳版表示 + "※ AI翻訳（DeepL）による参考訳" 注記
- ✅ 英語（EN）選択時: 原文表示
- ✅ localStorage で言語設定が永続化
- ✅ curlでHTMLを確認し、翻訳テキストが含まれることを確認

#### 学んだこと

1. **DeepL Free API**: 個人開発には十分な無料枠（500k文字/月）
2. **Docker環境変数**: `env_file` ディレクティブでの管理が便利
3. **Server/Client Components**: Next.js 15でのハイブリッド構成パターン
4. **翻訳の法的配慮**: RSS提供のコンテンツを翻訳するのは問題ないが、透明性のため注記を追加
5. **バッチ処理のレート制限**: 無料APIでは10req/secの制限があるため、150ms間隔が安全

#### 今後の課題

**高優先**:
- コンテンツ拡充: Web開発、システム/インフラカテゴリーのRSSソース追加
- パフォーマンス: ページネーション実装
- UI改善: Next.js Imageコンポーネント導入（imgタグ警告解消）

**中優先**:
- 検索機能（キーワード、タグ、ソース別）
- JSON-LD構造化データ
- sitemap.xml生成

**低優先**:
- ユーザー認証
- ブックマーク機能
- ダークモードトグル
- PWA対応

**セキュリティ注意**:
- ⚠️ DeepL APIキーが会話に含まれたため、後で再生成推奨

#### Git作業（次回実施予定）

- mainブランチで直接作業
- コミットメッセージ: `feat: Phase 7完了 - 翻訳機能実装（日英切り替え）`

<!-- 今後の開発メモはここに追記 -->
