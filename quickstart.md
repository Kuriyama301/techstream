# TechStream クイックスタートガイド

Claude Codeセッション開始時に読むべき最小限のガイド。

---

## 🚀 セッション開始プロンプト

新しいセッションを開始する際、以下のいずれかを入力：

```
開発を再開
```

または

```
セッション開始
```

---

## 📋 セッション開始時の手順

Claude Codeは以下を自動で実行：

### 1. NOTES.mdを確認
- 最新の開発ログ（最後の日付エントリ）
- 前回の実装内容
- 学んだこと・課題

### 2. TODO.mdを確認
- 「🔥 今日やること」
- 進行中のタスク
- 完了したタスク

### 3. プロジェクト状態を報告
```
**現在地**: [現在のフェーズ]
**前回の作業**: [簡潔に]
**次のタスク候補**: [TODO.mdから提案]
```

---

## ⚡ 最重要ルール

### TDD（テスト駆動開発）
```
1. Red: テストを書く
2. Green: 実装
3. Refactor: 改善
4. ドキュメント更新
```

### コミットメッセージ
```
type: subject

例:
feat: 記事カードコンポーネント実装
fix: RSS取得エラー修正
docs: README更新
```

**Type**: feat, fix, refactor, test, docs, style, chore, perf

### ドキュメント即時更新
```
実装完了 → 即座にNOTES.md/TODO.md更新 → コミット
```

**理由**: AIは忘れっぽいため、ドキュメントが唯一の記録

---

## 📁 ファイル優先度

| 優先度 | ファイル | 用途 |
|--------|----------|------|
| **最高** | NOTES.md | 最新状況、前回の作業 |
| **最高** | TODO.md | タスク管理、進捗 |
| **高** | quickstart.md | このファイル（開始時） |
| **高** | claude.md | 詳細ルール（必要時） |
| **中** | README.md | プロジェクト概要 |
| **低** | docs/design-spec.md | 設計詳細（実装時のみ） |

---

## 🎯 開発フロー

```
セッション開始
   ↓
状態確認・報告
   ↓
タスク選択
   ↓
TodoWriteでタスク追加
   ↓
TDDで実装
   ↓
NOTES.md/TODO.md更新
   ↓
Git commit & push
   ↓
次回のタスク明記
```

---

## 📖 詳細情報

より詳細なルールは以下を参照：

- **[claude.md](./claude.md)** - 完全な開発ルール（700行）
  - コーディング規約
  - TypeScript/React/Next.jsベストプラクティス
  - エラーハンドリング詳細
  - Git運用の詳細
  - ディレクトリ構造

---

## ⚠️ 注意事項

- **必ずNOTES.mdとTODO.mdを読む**: 前回の内容を把握
- **状態報告は簡潔に**: 長すぎず、明確に
- **次のタスクを提案**: ユーザーが迷わないように
- **開発ルールを守る**: TDD、即時ドキュメント更新

---

## 🔧 技術スタック（参考）

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB, PostgreSQL, Redis
- **Test**: Jest, React Testing Library, Playwright

---

**最終更新**: 2025-10-13
