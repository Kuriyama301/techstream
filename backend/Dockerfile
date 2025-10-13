# ベースイメージ
FROM node:20-alpine AS base

# 依存関係インストール用ステージ
FROM base AS deps
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# 開発環境用ステージ
FROM base AS development
WORKDIR /app

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ポート公開
EXPOSE 4000

# 開発サーバー起動
CMD ["npm", "run", "dev"]

# ビルド用ステージ
FROM base AS builder
WORKDIR /app

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# TypeScriptをビルド
RUN npm run build

# 本番環境用ステージ
FROM base AS production
WORKDIR /app

ENV NODE_ENV production

# 非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# 本番環境の依存関係のみをインストール
COPY package*.json ./
RUN npm ci --only=production

# ビルド成果物をコピー
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist

USER expressjs

EXPOSE 4000

ENV PORT 4000
ENV HOST "0.0.0.0"

CMD ["node", "dist/index.js"]
