# --- Base Stage ---
FROM node:20-slim AS base
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/types-schema ./packages/types-schema
COPY packages/db ./packages/db
COPY packages/core ./packages/core
COPY apps/server/gateway/package.json ./apps/server/gateway/

# --- Builder Stage ---
FROM base AS builder
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --workspace=@app/types-schema || true
RUN npm run build --workspace=@app/db || true
RUN npm run build --workspace=@app/core || true

# --- Development Stage ---
FROM builder AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev", "--workspace=@app/gateway"]

# --- Production Builder Stage ---
FROM builder AS prod-builder
RUN npm run build --workspace=@app/gateway

# --- Production Stage ---
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-builder /app/apps/server/gateway/dist ./dist
COPY --from=prod-builder /app/apps/server/gateway/package.json ./package.json
RUN npm install --omit=dev --legacy-peer-deps
CMD ["node", "dist/index.js"]
