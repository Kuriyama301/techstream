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

### 次回やること
- プロジェクト初期セットアップ
- Next.jsプロジェクト作成
- ディレクトリ構造の構築

---

## 開発ログ
<!-- 今後の開発メモはここに追記 -->
