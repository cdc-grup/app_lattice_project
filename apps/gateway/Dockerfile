# --- Base Stage ---
FROM node:20-slim AS base
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared ./packages/shared
COPY packages/db ./packages/db
COPY apps/gateway/package.json ./apps/gateway/

# --- Builder Stage ---
FROM base AS builder
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --workspace=@app/shared || true
RUN npm run build --workspace=@app/db || true

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
COPY --from=prod-builder /app/apps/gateway/dist ./dist
COPY --from=prod-builder /app/apps/gateway/package.json ./package.json
RUN npm install --omit=dev --legacy-peer-deps
CMD ["node", "dist/index.js"]
