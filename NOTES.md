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

<!-- 今後の開発メモはここに追記 -->
