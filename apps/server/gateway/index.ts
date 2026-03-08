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
app.get('/status', (req: Request, res: Response) => {
  res.json({ status: 'gateway_ok', timestamp: new Date(), env: process.env.NODE_ENV });
});

// --- ROUTING ---
const API_PREFIX = '/api/v1';

// Auth Service
app.use(
  createProxyMiddleware({
    pathFilter: [`${API_PREFIX}/auth`, `${API_PREFIX}/users`, '/auth', '/users'],
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^${API_PREFIX}`]: '',
    },
  })
);

// Geo Service
app.use(
  createProxyMiddleware({
    pathFilter: [
      `${API_PREFIX}/pois`,
      `${API_PREFIX}/locations`,
      `${API_PREFIX}/navigation`,
      `${API_PREFIX}/map`,
      `${API_PREFIX}/saved`,
      '/pois',
      '/locations',
      '/navigation',
      '/map',
      '/saved',
    ],
    target: GEO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^${API_PREFIX}`]: '',
    },
  })
);

// Social Service
app.use(
  createProxyMiddleware({
    pathFilter: [
      `${API_PREFIX}/groups`,
      `${API_PREFIX}/telemetry`,
      '/groups',
      '/telemetry'
    ],
    target: SOCIAL_SERVICE_URL,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: {
      [`^${API_PREFIX}`]: '',
    },
  })
);

// Fallback for unhandled routes (404)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found at Gateway level' });
});

app.listen(PORT, () => {
  console.log(`[Gateway] running on port ${PORT}`);
  console.log(`[Gateway] Routing /auth, /users -> ${AUTH_SERVICE_URL}`);
  console.log(`[Gateway] Routing /pois, /locations, /navigation -> ${GEO_SERVICE_URL}`);
  console.log(`[Gateway] Routing /groups -> ${SOCIAL_SERVICE_URL}`);
});
