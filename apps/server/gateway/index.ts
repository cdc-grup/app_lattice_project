import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from '@app/core';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs (Defaults for local dev)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || 'http://localhost:3002';
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL || 'http://localhost:3003';

app.use(cors());
app.use(logger);

// Log incoming requests for debugging
app.use((req, _res, next) => {
  console.log(`[Gateway] Incoming: ${req.method} ${req.url}`);
  next();
});

// Health Check
router.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'gateway_ok', timestamp: new Date(), env: process.env.NODE_ENV, basePath });
});

// --- API ROUTING ---
const API_PREFIX = '/api/v1';

const stripPrefix = (path: string, req: express.Request) => {
  return path.replace(API_PREFIX, '');
};

// Auth Service
router.use(
  createProxyMiddleware({
    pathFilter: ['/**/auth/**', '/**/users/**', '/**/auth', '/**/users'],
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: stripPrefix
  })
);

// Geo Service
router.use(
  createProxyMiddleware({
    pathFilter: [
      '/**/pois/**',
      '/**/locations/**',
      '/**/navigation/**',
      '/**/map/**',
      '/**/saved/**',
      '/**/pois',
      '/**/locations',
      '/**/navigation',
      '/**/map',
      '/**/saved',
    ],
    target: GEO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: stripPrefix,
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Gateway -> Geo] Forwarding: ${req.url} -> ${proxyReq.path}`);
      }
    }
  })
);

// Social Service
router.use(
  createProxyMiddleware({
    pathFilter: [
      '/**/groups/**',
      '/**/telemetry/**',
      '/**/groups',
      '/**/telemetry'
    ],
    target: SOCIAL_SERVICE_URL,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: stripPrefix
  })
);

// Fallback for unhandled API routes
router.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found at Gateway level' });
});

if (basePath && basePath !== '/') {
  // Mount the router on the base path
  app.use(basePath, router);
  // Also provide a root fallback to catch things without a prefix directly and 404 immediately
  app.use('*', (req, res) => res.status(404).json({ error: 'Route not found at Global level. Missing /lattice prefix?' }));
  console.log(`[Gateway] Mounting API at base path: ${basePath}`);
} else {
  app.use('/', router);
}

app.listen(PORT, () => {
  console.log(`[Gateway] running on port ${PORT}`);
  console.log(`[Gateway] Routing /auth, /users -> ${AUTH_SERVICE_URL}`);
  console.log(`[Gateway] Routing /pois, /locations, /navigation -> ${GEO_SERVICE_URL}`);
  console.log(`[Gateway] Routing /groups -> ${SOCIAL_SERVICE_URL}`);
});
