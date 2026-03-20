# --- Base Stage ---
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc ./
COPY packages/types-schema/package.json ./packages/types-schema/
COPY packages/db/package.json ./packages/db/
COPY packages/core/package.json ./packages/core/
COPY apps/server/gateway/package.json ./apps/server/gateway/

# --- Builder Stage ---
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build --filter=@app/types-schema || true
RUN pnpm build --filter=@app/db || true
RUN pnpm build --filter=@app/core || true

# --- Development Stage ---
FROM builder AS development
ENV NODE_ENV=development
CMD ["pnpm", "dev", "--filter=@app/gateway"]

# --- Production Builder Stage ---
FROM builder AS prod-builder
RUN pnpm build --filter=@app/gateway

# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-builder /app /app
RUN corepack enable
CMD ["npx", "tsx", "apps/server/gateway/index.ts"]
