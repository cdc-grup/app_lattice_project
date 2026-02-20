# --- Base Stage ---
FROM node:20-slim AS base
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/types-schema/package.json ./packages/types-schema/
COPY packages/db/package.json ./packages/db/
COPY packages/core/package.json ./packages/core/
COPY apps/server/social/package.json ./apps/server/social/

# --- Builder Stage ---
FROM base AS builder
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --workspace=@app/types-schema || true
RUN npm run build --workspace=@app/db || true
RUN npm run build --workspace=@app/core || true

# --- Development Stage ---
FROM builder AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev", "--workspace=@app/social"]

# --- Production Builder Stage ---
FROM builder AS prod-builder
RUN npm run build --workspace=@app/social

# --- Production Stage ---
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-builder /app/apps/server/social/dist ./dist
COPY --from=prod-builder /app/apps/server/social/package.json ./package.json
RUN npm install --omit=dev --legacy-peer-deps
CMD ["node", "dist/index.js"]
