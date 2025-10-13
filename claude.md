# TechStream 開発ガイドライン

このドキュメントは、Claude Codeと連携してTechStreamを開発する際の基本ルールと方針を定義します。

## プロジェクト概要

**TechStream** - エンジニア向けニュースアプリ
- プログラミング言語別にキュレーションされた技術ニュース
- SmartNewsライクなタブ切り替え型UI
- RSS/API統合による自動コンテンツ収集

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** (スタイリング)
- **Framer Motion** (アニメーション)

### バックエンド
- **Node.js** + **Express**
- **TypeScript**
- RESTful API設計

### データベース
- **MongoDB** (記事・カテゴリ)
- **PostgreSQL** (ユーザー管理)
- **Redis** (キャッシュ)

### テスト
- **Jest** (ユニットテスト)
- **React Testing Library** (コンポーネントテスト)
- **Playwright** (E2Eテスト)

---

## 開発方針

### 1. テスト駆動開発（TDD）

**必須**: すべての新機能・コンポーネントはテストファーストで実装する

#### TDDサイクル
```
1. Red: テストを書く（失敗する）
2. Green: 最小限の実装で動かす
3. Refactor: リファクタリング
4. ドキュメント更新: NOTES.md等を即座に更新
```

#### テスト実装の優先順位
1. **最優先**: ユーザーに直接影響する機能
   - 記事表示、検索、ブックマーク等
2. **高優先**: ビジネスロジック
   - RSS収集、記事分類、スコアリング
3. **中優先**: ユーティリティ関数
4. **低優先**: UI専用コンポーネント（スナップショットテストでOK）

#### テストファイルの配置
```
src/
├── components/
│   ├── ArticleCard.tsx
│   └── ArticleCard.test.tsx       # 同じディレクトリに配置
├── lib/
│   ├── rssParser.ts
│   └── rssParser.test.ts
```

### 2. ベストプラクティスの遵守

#### TypeScript
- **strict mode有効化**: `tsconfig.json`で`"strict": true`
- **anyの禁止**: `unknown`または適切な型定義を使用
- **型推論の活用**: 明示的な型指定が必要な場合のみ記述

#### React
- **Server ComponentsとClient Componentsの明確な分離**
  - デフォルトはServer Components
  - インタラクティブな部分のみ`'use client'`
- **カスタムフックの活用**: ロジックの再利用性を高める
- **Propsの型定義**: interfaceで明確に定義

#### Next.js
- **適切なレンダリング戦略の選択**
  - SSR: ユーザー固有の情報が必要な場合
  - ISR: 共通コンテンツ（定期的更新が必要）
  - SSG: 静的コンテンツ
- **動的import**: 重いコンポーネントは遅延ロード

### 3. 可読性重視のコーディング

#### 命名規則
- **コンポーネント**: PascalCase（例: `ArticleCard`, `TabNavigation`）
- **関数**: camelCase（例: `fetchArticles`, `calculateScore`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`, `MAX_RETRIES`）
- **型・インターフェース**: PascalCase with descriptive names（例: `Article`, `FilterOptions`）

#### ファイル名
- **Reactコンポーネント**: PascalCase（例: `ArticleCard.tsx`）
- **ユーティリティ**: camelCase（例: `dateUtils.ts`, `apiClient.ts`）
- **テスト**: 元のファイル名 + `.test.ts(x)`

#### 関数の長さと責務
- **1関数 = 1責務**: 単一責任の原則を守る
- **関数の長さ**: 30行以内を目安（超える場合は分割検討）
- **早期return**: ネストを減らすため、ガード節を活用

```typescript
// ❌ Bad: ネストが深い
function processArticle(article: Article) {
  if (article) {
    if (article.title) {
      if (article.content) {
        // 処理
      }
    }
  }
}

// ✅ Good: 早期return
function processArticle(article: Article) {
  if (!article) return;
  if (!article.title) return;
  if (!article.content) return;

  // 処理
}
```

### 4. コメントの書き方

#### コメントを書く場所
- **複雑なロジック**: アルゴリズムや計算式の意図
- **非自明な判断**: なぜその実装を選んだか
- **外部依存**: APIの仕様や制約
- **TODO/FIXME**: 将来の改善点

#### コメントを書かない場所
- **自明なコード**: 変数名や関数名で意図が明確な場合
- **型定義**: TypeScriptの型で十分説明できる場合

```typescript
// ❌ Bad: 自明すぎるコメント
// ユーザーIDを取得
const userId = user.id;

// ✅ Good: 意図を説明
// APIの制限により、1リクエストあたり100件までしか取得できない
const ARTICLES_PER_REQUEST = 100;

// ✅ Good: 複雑なロジックの説明
// 新鮮さスコアは時間経過で減衰する（最初の6時間は最高値）
const calculateFreshnessScore = (publishedAt: Date): number => {
  const ageInHours = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (ageInHours < 6) return 10;
  if (ageInHours < 24) return 8;
  return Math.max(1, 10 - Math.floor(ageInHours / 24));
};
```

#### JSDocコメント
パブリックAPIや複雑な関数には、JSDocを記述：

```typescript
/**
 * RSS フィードから記事を取得して分類する
 *
 * @param feedUrl - RSSフィードのURL
 * @param sourceTier - ソースの信頼度（1-3）
 * @returns 分類済み記事の配列
 * @throws {FetchError} フィード取得に失敗した場合
 */
async function fetchAndClassifyArticles(
  feedUrl: string,
  sourceTier: number
): Promise<Article[]> {
  // 実装
}
```

### 5. エラーハンドリング

#### 基本方針
- **ユーザーに影響がある部分**: 丁寧にエラーハンドリング
- **内部処理**: 必要最小限のハンドリング

#### ユーザー影響がある箇所（重点対応）
1. **API呼び出し**: タイムアウト、ネットワークエラー
2. **フォーム送信**: バリデーション、サーバーエラー
3. **データ表示**: データ取得失敗時のフォールバック
4. **認証**: ログイン失敗、セッション期限切れ

```typescript
// ✅ Good: ユーザー向けエラーハンドリング
async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/api/articles');

    if (!response.ok) {
      // ユーザーに表示するエラーメッセージ
      throw new Error('記事の取得に失敗しました。もう一度お試しください。');
    }

    return await response.json();
  } catch (error) {
    // ログ記録
    console.error('Failed to fetch articles:', error);

    // ユーザーにフレンドリーなエラーを表示
    toast.error('記事の取得に失敗しました');

    // 空配列を返してUIを壊さない
    return [];
  }
}
```

#### 内部処理（最小限）
```typescript
// ✅ Good: シンプルなエラーハンドリング
function calculateScore(article: Article): number {
  if (!article) return 0;

  // 基本的な計算（エラーは呼び出し側で処理）
  return article.views * 0.1 + article.bookmarks * 0.5;
}
```

---

## コーディング規約

### TypeScript

#### ESLintルール
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

#### Prettierルール
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### React / Next.js

#### コンポーネント定義
```typescript
// ✅ Good: 関数コンポーネント + TypeScript
interface ArticleCardProps {
  article: Article;
  onBookmark?: (id: string) => void;
}

export function ArticleCard({ article, onBookmark }: ArticleCardProps) {
  // 実装
}
```

#### Hooks の使用
- **useState**: ローカル状態管理
- **useEffect**: 副作用処理（最小限に）
- **useMemo/useCallback**: パフォーマンス最適化（必要な場合のみ）
- **カスタムフック**: ロジックの再利用

### CSS / Tailwind

#### Tailwindの使用
- **ユーティリティクラス優先**: カスタムCSSは最小限
- **レスポンシブデザイン**: モバイルファースト（`md:`, `lg:`）
- **ダークモード**: `dark:`プレフィックス

```tsx
// ✅ Good
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  {/* content */}
</div>
```

---

## ディレクトリ構造

### フロントエンド（Next.js）
```
frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── api/                # API Routes
│   │   ├── articles/           # 記事関連ページ
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── languages/          # 言語別ページ
│   │   ├── layout.tsx
│   │   └── page.tsx            # トップページ
│   ├── components/             # 再利用コンポーネント
│   │   ├── common/             # 汎用コンポーネント
│   │   ├── features/           # 機能別コンポーネント
│   │   └── layout/             # レイアウトコンポーネント
│   ├── hooks/                  # カスタムフック
│   ├── lib/                    # ユーティリティ・API
│   │   ├── api/                # API クライアント
│   │   └── utils/              # ユーティリティ関数
│   ├── types/                  # TypeScript 型定義
│   └── store/                  # 状態管理（Zustand等）
├── public/                     # 静的ファイル
├── tests/                      # E2Eテスト
└── package.json
```

### バックエンド（Express）
```
backend/
├── src/
│   ├── config/                 # 設定ファイル
│   ├── controllers/            # リクエストハンドラー
│   ├── middlewares/            # ミドルウェア
│   ├── models/                 # データモデル
│   ├── routes/                 # ルート定義
│   ├── services/               # ビジネスロジック
│   │   ├── rss/                # RSS収集
│   │   ├── classification/     # 記事分類
│   │   └── scoring/            # スコアリング
│   ├── types/                  # TypeScript 型定義
│   ├── utils/                  # ユーティリティ
│   └── app.ts                  # エントリーポイント
├── tests/                      # テスト
└── package.json
```

---

## Git運用ルール

### ブランチ戦略

個人開発のため、シンプルな戦略を採用：

```
main          # 安定版（デプロイ可能な状態）
  ↑
develop       # 開発中（統合ブランチ）
  ↑
feature/*     # 機能開発ブランチ
```

### ブランチ命名
- `feature/article-card` - 新機能
- `fix/rss-parser-error` - バグ修正
- `refactor/api-client` - リファクタリング
- `docs/update-readme` - ドキュメント更新

### コミットメッセージ

**採用規約**: Conventional Commits（緩め）

個人開発に適したバランスの取れた形式。後で振り返りやすく、自動化ツールとの連携も可能。

#### 基本フォーマット
```
<type>: <subject>

<body>（省略可）

<footer>（省略可）
```

#### Type一覧

| Type | 用途 | 例 |
|------|------|-----|
| `feat` | 新機能追加 | `feat: 記事カードコンポーネント実装` |
| `fix` | バグ修正 | `fix: RSS取得時のタイムアウトエラー修正` |
| `refactor` | リファクタリング | `refactor: API クライアントを関数化` |
| `test` | テスト追加・修正 | `test: ArticleCard のテストを追加` |
| `docs` | ドキュメント更新 | `docs: README に環境構築手順を追加` |
| `style` | コードスタイル修正 | `style: Prettier によるフォーマット` |
| `chore` | ビルド・設定変更 | `chore: ESLint 設定を追加` |
| `perf` | パフォーマンス改善 | `perf: 画像遅延読み込みを実装` |

#### コミットの粒度

**原則**: 1コミット = 1つの論理的な変更

##### ❌ 悪い例: 大きすぎる
```bash
feat: フロントエンド実装
# → 何を実装したか不明
```

##### ❌ 悪い例: 小さすぎる
```bash
fix: typo
fix: another typo
fix: spacing
# → コミットが多すぎて追いづらい
```

##### ✅ 良い例: 適切な粒度
```bash
feat: 記事カードコンポーネントの基本実装

- タイトル、日付、ソース名を表示
- レスポンシブ対応
- Tailwind CSS でスタイリング
```

#### 日本語 vs 英語

**個人開発では日本語を推奨**

```bash
# ✅ 推奨: 日本語
feat: RSS収集サービスの実装

# ⭕ 許容: 英語（慣れているなら）
feat: implement RSS fetching service
```

**理由:**
- 後で見返した時に理解しやすい
- Claude Codeへの指示も日本語で統一
- 個人開発なので国際化不要

#### Subject（件名）のルール

- ✅ **50文字以内**
- ✅ **末尾にピリオド不要**
- ✅ **命令形**（「追加する」ではなく「追加」）
- ✅ **何をしたか明確に**

```bash
# ✅ Good
feat: 記事詳細ページを実装

# ❌ Bad: 長すぎる
feat: 記事詳細ページを実装して、コメント機能も追加して、スタイルも調整した

# ❌ Bad: 曖昧
feat: いろいろ追加

# ❌ Bad: 過去形
feat: 記事詳細ページを実装した
```

#### Body（本文）を書く基準

**シンプルな変更**: SubjectだけでOK
```bash
fix: タイポ修正
```

**複雑な変更**: Bodyで詳細を説明
```bash
fix: RSS取得時のタイムアウトエラー修正

- タイムアウト時間を5秒→10秒に延長
- 3回までリトライする仕組みを追加
- エラーログを詳細化

Fixes #15
```

#### 実際のコミット例集

##### 初期セットアップ
```bash
chore: プロジェクト初期セットアップ

- TODO.md, NOTES.md, claude.md 作成
- .gitignore 設定
- ディレクトリ構造構築
```

##### 機能実装（TDD）
```bash
feat: 記事カードコンポーネント実装

TDDで実装：
- テスト追加（ArticleCard.test.tsx）
- 基本的な表示機能
- レスポンシブ対応
```

##### テスト追加
```bash
test: RSS パーサーのテストを追加

エッジケースのテストを含む：
- 空のフィード
- 不正なXML
- タイムアウト
```

##### リファクタリング
```bash
refactor: API クライアントを整理

- 重複コードを共通関数に抽出
- エラーハンドリングを統一
- TypeScript の型を厳格化
```

##### ドキュメント更新
```bash
docs: claude.md にコミットメッセージルールを追加
```

##### 緊急修正
```bash
fix: 本番環境での記事表示エラーを修正

原因: 記事データのnullチェック漏れ
対応: オプショナルチェーンを追加
```

#### コミット前チェックリスト

```bash
# 1. 変更内容を確認
git status
git diff

# 2. テストが通ることを確認
npm test

# 3. リントエラーがないか確認
npm run lint

# 4. 適切な粒度か確認
# → 1コミット = 1つの論理的な変更

# 5. コミット
git add .
git commit -m "type: subject"
```

---

## セッション開始ガイド

新しいClaude Codeセッションを開始する際の手順とプロンプトテンプレート。

### トリガープロンプト

ユーザーから以下のいずれかの入力があった場合、セッション開始手順を実行：

- 「**開発を再開**」
- 「**セッション開始**」
- 「**続きから**」

### 標準セッション開始手順

トリガープロンプトを受け取ったら、以下を順番に実行：

#### 1. NOTES.mdを確認
```
- 最新の開発ログを読む（最後の日付エントリ）
- 前回の実装内容を把握
- 学んだこと・課題を確認
```

#### 2. TODO.mdを確認
```
- 「🔥 今日やること」セクションをチェック
- 進行中のタスクを確認
- 完了したタスクを把握
```

#### 3. 現在地を報告
```
ユーザーに以下を報告：
- プロジェクトの現在の状態（どこまで進んでいるか）
- 前回の作業内容（簡潔に）
- 次に進めるべきタスクの提案（TODO.mdから）
```

### 報告フォーマット例

```
## プロジェクト状態

**現在地**: Phase 1 - 環境構築中

**前回の作業**:
- Git設定完了（GitHubリポジトリ接続）
- 開発ルール確定（TDD、コミットメッセージ規約）

**完了済み**:
✅ プロジェクト管理体制構築
✅ Git設定

**次のタスク候補**:
1. Next.jsプロジェクトのセットアップ（推奨）
2. Express APIサーバーのセットアップ

どちらから進めますか？
```

### 状況別の追加確認

#### 新しいフェーズ開始時
ユーザーから「新しいフェーズを始める」等の指示があった場合：
```
- docs/design-spec.mdの該当箇所を確認
- 関連するアーキテクチャ設計を把握
```

#### 実装中の問題・エラー対応時
ユーザーから「エラーが出た」等の指示があった場合：
```
- エラーログを確認
- 関連するコードを確認
- NOTES.mdに過去の類似問題がないか確認
```

#### 長期間空いた後の再開時
ユーザーから「久しぶり」等の言及があった場合：
```
- README.mdでプロジェクト全体を再確認
- claude.mdで開発ルールを再確認
- NOTES.mdで最近の開発履歴を確認（複数エントリ）
```

### ファイル読み込み優先度

| 優先度 | ファイル | 目的 |
|--------|----------|------|
| **最高** | NOTES.md | 最新の開発状況、前回の作業内容 |
| **最高** | TODO.md | 現在のタスク、進捗状況 |
| **高** | claude.md | 開発ルール、このガイド |
| **中** | README.md | プロジェクト全体像（必要時） |
| **低** | docs/design-spec.md | 詳細設計（実装時に該当箇所のみ） |

### セッション開始後の流れ

```
1. 状態報告
   ↓
2. ユーザーがタスクを選択
   ↓
3. TodoWriteでタスクを追加
   ↓
4. TDDで実装開始
   ↓
5. 実装完了後、ドキュメント更新
   ↓
6. Git commit & push
```

### 注意事項

- **必ずNOTES.mdとTODO.mdを読む**: 前回のセッション内容を忘れているため
- **状態報告は簡潔に**: 長すぎると読みにくい
- **次のタスクを明確に提案**: ユーザーが迷わないように
- **開発ルールを守る**: claude.mdの内容を常に意識

---

## Claude Codeとの連携ルール

### 実装フロー

#### 1. タスク開始時
```
Claude Codeへの依頼例:
「TODO.mdからタスク#5を確認して、
TDDで実装してください。
関連する設計はdocs/design-spec.mdの行500-700です」
```

#### 2. 実装中
- **テストファースト**: 必ずテストを先に書く
- **小さなステップ**: 一度に多くを実装しない
- **TodoWriteの活用**: 進捗を可視化

#### 3. 実装完了後（重要）
```
必ず以下を実行:
1. テストが通ることを確認
2. NOTES.mdに実装内容を記録
3. TODO.mdを更新（完了マーク）
4. 必要に応じてREADME.mdやドキュメントを更新
```

### ドキュメント即時更新の徹底

**理由**: AIは前回のセッション内容を忘れるため、ドキュメントが唯一の記録

#### 更新対象
- **NOTES.md**: 毎回の実装内容、学び、課題
- **TODO.md**: タスクの完了状態
- **README.md**: プロジェクト構造の変更時
- **docs/**: API仕様や設計の変更時

#### 更新タイミング
```
実装完了 → 即座にドキュメント更新 → Git commit
```

#### 更新依頼の例
```
「実装が完了したので、以下を更新してください：
1. NOTES.mdに今日の実装内容を追記
2. TODO.mdのタスク#5を完了にする
3. 新しいAPIエンドポイントをdocs/api-specs.mdに追記」
```

### セッション終了時のチェックリスト

毎回の開発セッション終了時に確認：

- [ ] テストがすべてパスしている
- [ ] NOTES.mdに今日の作業内容を記録
- [ ] TODO.mdが最新状態
- [ ] コミットメッセージが適切
- [ ] 次回のタスクが明確（TODO.mdまたはNOTES.md）

---

## パフォーマンス考慮事項

### フロントエンド
- **画像最適化**: Next.js Image コンポーネント使用
- **コード分割**: 動的import活用
- **キャッシュ戦略**: SWRまたはReact Query
- **バンドルサイズ**: 必要なライブラリのみインポート

### バックエンド
- **データベースクエリ**: インデックス活用
- **キャッシュ**: Redis活用
- **N+1問題**: 集約クエリで解決

---

## セキュリティ考慮事項

### 基本方針
- **環境変数**: 機密情報は`.env`で管理（.gitignoreに追加済み）
- **入力検証**: ユーザー入力は必ず検証
- **SQLインジェクション対策**: ORMのプリペアドステートメント使用
- **XSS対策**: Reactのエスケープ機能に依存

---

## 参考資料

### 内部ドキュメント
- [TODO.md](./TODO.md) - タスク管理
- [NOTES.md](./NOTES.md) - 開発メモ
- [docs/design-spec.md](./docs/design-spec.md) - 詳細設計書

### 外部リンク
- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 更新履歴

- 2025-10-13: 初版作成
- 2025-10-13: コミットメッセージの詳細ルールを追加（Conventional Commits採用、粒度、日本語推奨、実例集）
- 2025-10-13: セッション開始ガイドを追加（トリガープロンプト、標準手順、ファイル優先度、報告フォーマット）
